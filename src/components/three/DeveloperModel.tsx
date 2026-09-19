import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { palette } from "./palette";
import { poseAt, type Pose } from "./choreography";
import { createCodeTexture, createDeployTexture } from "./screenTextures";

export interface Pointer {
  /** Normalised device coords, -1…1 */
  x: number;
  y: number;
  active: boolean;
}

interface DeveloperModelProps {
  progress: MotionValue<number>;
  pointer: MutableRefObject<Pointer>;
  /** performance.now() of the last click, drives the wave */
  waveAt: MutableRefObject<number>;
  reducedMotion: boolean;
}

// Hip and shoulder heights (m) — the rest of the rig hangs off these
const HIP = new THREE.Vector3(0, 0.5, 0.04);
const UPPER_ARM = 0.28;
const FOREARM = 0.28;
const DESK_TOP = 0.7525;

type Side = -1 | 1;

function useMaterials() {
  return useMemo(() => {
    const std = (color: string, roughness = 0.75, metalness = 0) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness });
    return {
      skin: std(palette.skin, 0.62),
      hair: std(palette.hair, 0.9),
      hoodie: std(palette.inkSoft, 0.92),
      hoodieDark: std(palette.ink, 0.95),
      pants: std(palette.charcoal, 0.9),
      shoe: std(palette.paper, 0.7),
      sole: std(palette.ink, 0.8),
      ink: std(palette.ink, 0.5),
      signal: std(palette.signal, 0.45),
      paper: std(palette.paper, 0.8),
      wood: std(palette.wood, 0.7),
      metal: std(palette.aluminium, 0.32, 0.65),
      keys: std(palette.charcoal, 0.8),
      frame: std(palette.ink, 0.25, 0.4),
      coffee: std("#3b2618", 0.3),
    };
  }, []);
}

/**
 * A seated developer at a desk, authored from primitives so every joint can be
 * posed from scroll. Faces −z; +x is the character's right-hand side.
 */
export function DeveloperModel({ progress, pointer, waveAt, reducedMotion }: DeveloperModelProps) {
  const m = useMaterials();

  const codeTexture = useMemo(createCodeTexture, []);
  const deployTexture = useMemo(createDeployTexture, []);
  const codeMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ map: codeTexture, toneMapped: false }),
    [codeTexture],
  );
  const deployMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ map: deployTexture, toneMapped: false, transparent: true, opacity: 0 }),
    [deployTexture],
  );

  useEffect(
    () => () => {
      codeTexture.dispose();
      deployTexture.dispose();
      codeMaterial.dispose();
      deployMaterial.dispose();
      Object.values(m).forEach((mat) => mat.dispose());
    },
    [codeTexture, deployTexture, codeMaterial, deployMaterial, m],
  );

  const torso = useRef<THREE.Group>(null!);
  const neck = useRef<THREE.Group>(null!);
  const lid = useRef<THREE.Group>(null!);
  const screenLight = useRef<THREE.PointLight>(null!);
  const shoulders = useRef<Record<Side, THREE.Group | null>>({ [-1]: null, [1]: null });
  const forearms = useRef<Record<Side, THREE.Group | null>>({ [-1]: null, [1]: null });
  const hands = useRef<Record<Side, THREE.Group | null>>({ [-1]: null, [1]: null });

  // Damped copy of the pose so scroll jumps ease in rather than snap
  const current = useRef<Pose>(poseAt(progress.get()));
  const look = useRef({ yaw: 0, pitch: 0, weight: 0 });
  const scratch = useMemo(() => ({ v: new THREE.Vector3(), w: new THREE.Vector3() }), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const t = state.clock.elapsedTime;
    const target = poseAt(progress.get());
    const pose = current.current;
    const rate = reducedMotion ? 60 : 5;
    for (const key of Object.keys(target) as (keyof Pose)[]) {
      pose[key] = THREE.MathUtils.damp(pose[key], target[key], rate, dt);
    }
    const idle = reducedMotion ? 0 : 1;

    // Laptop
    lid.current.rotation.x = pose.lid;
    codeMaterial.color.setScalar(0.06 + 0.94 * pose.screen);
    deployMaterial.opacity = pose.deployed * pose.screen;
    screenLight.current.intensity = pose.screen * 0.22;
    codeTexture.offset.y = (codeTexture.offset.y + dt * idle * (0.015 + pose.typing * 0.09)) % 1;

    // Torso: lean + breathing
    torso.current.rotation.x = pose.lean;
    torso.current.scale.y = 1 + Math.sin(t * 1.7) * 0.01 * idle;

    // Head: follow the cursor by turning toward where it points in the scene
    const p = pointer.current;
    const lk = look.current;
    let yaw = 0;
    let pitch = 0;
    if (p.active && neck.current.parent) {
      const { v, w } = scratch;
      neck.current.getWorldPosition(w);
      const dist = state.camera.position.distanceTo(w);
      v.set(p.x, p.y, 0.5).unproject(state.camera).sub(state.camera.position).normalize();
      v.multiplyScalar(dist).add(state.camera.position);
      neck.current.parent.worldToLocal(v);
      v.sub(neck.current.position);
      yaw = THREE.MathUtils.clamp(Math.atan2(-v.x, -v.z), -0.85, 0.85);
      pitch = THREE.MathUtils.clamp(Math.atan2(v.y, Math.hypot(v.x, v.z)), -0.45, 0.4);
    }
    lk.weight = THREE.MathUtils.damp(lk.weight, p.active ? 0.85 : 0, 4, dt);
    lk.yaw = THREE.MathUtils.damp(lk.yaw, yaw, 6, dt);
    lk.pitch = THREE.MathUtils.damp(lk.pitch, pitch, 6, dt);
    const nod = Math.sin(t * 2.1) * 0.025 * pose.typing * idle;
    neck.current.rotation.y = lk.yaw * lk.weight + Math.sin(t * 0.45) * 0.05 * idle * (1 - lk.weight);
    neck.current.rotation.x = THREE.MathUtils.lerp(pose.headPitch + nod, lk.pitch, lk.weight) - pose.lean * 0.6;

    // Click → wave with the right arm (envelope over ~1.8s)
    const since = (performance.now() - waveAt.current) / 1000;
    const wave = since < 1.8 ? Math.min(1, since / 0.25) * Math.min(1, (1.8 - since) / 0.35) : 0;

    for (const s of [-1, 1] as Side[]) {
      const shoulder = shoulders.current[s];
      const forearm = forearms.current[s];
      const hand = hands.current[s];
      if (!shoulder || !forearm || !hand) continue;

      // Typing: hands on the keyboard with alternating finger taps
      const phase = t * 11 + (s === 1 ? 0 : Math.PI * 0.7);
      const tap = Math.max(0, Math.sin(phase)) * 0.12 * pose.typing * idle;
      const typeShoulderX = 0.55 - pose.lean;
      const typeShoulderZ = -0.24 * s;
      const typeForearmX = 1.05 + tap * 0.4;
      const typeForearmZ = 0;

      // Stretch: elbows out wide, hands laced behind the head. Solved from the
      // desired upper-arm (out/up) and forearm (in/back) directions in torso space;
      // forearm X stays positive (>π) so the elbow keeps flexing rather than snapping straight.
      const stretchShoulderX = -0.29;
      const stretchShoulderZ = 2.36 * s;
      const stretchForearmX = 3.84;
      const stretchForearmZ = 0.63 * s;

      const k = pose.stretch;
      let sx = THREE.MathUtils.lerp(typeShoulderX, stretchShoulderX, k);
      let sz = THREE.MathUtils.lerp(typeShoulderZ, stretchShoulderZ, k);
      let fx = THREE.MathUtils.lerp(typeForearmX, stretchForearmX, k);
      let fz = THREE.MathUtils.lerp(typeForearmZ, stretchForearmZ, k);

      if (s === 1 && wave > 0) {
        const wag = Math.sin(t * 13) * 0.4 * idle;
        sx = THREE.MathUtils.lerp(sx, 0.25, wave);
        sz = THREE.MathUtils.lerp(sz, 2.35, wave);
        fx = THREE.MathUtils.lerp(fx, 0, wave);
        fz = THREE.MathUtils.lerp(fz, 0.75 + wag, wave);
      }

      shoulder.rotation.set(sx, 0, sz);
      forearm.rotation.set(fx, 0, fz);
      hand.rotation.x = -tap * 2 + (1 - pose.stretch) * -0.35;
    }
  });

  return (
    <group>
      <Chair m={m} />
      <Desk m={m} />

      {/* Laptop */}
      <group position={[0, DESK_TOP, -0.42]}>
        <RoundedBox args={[0.34, 0.016, 0.235]} radius={0.006} position={[0, 0.008, 0]} material={m.metal} />
        <mesh position={[0, 0.0165, -0.035]} material={m.keys}>
          <boxGeometry args={[0.3, 0.002, 0.11]} />
        </mesh>
        <mesh position={[0, 0.0165, 0.07]} material={m.metal}>
          <boxGeometry args={[0.11, 0.002, 0.065]} />
        </mesh>
        <group ref={lid} position={[0, 0.016, -0.1175]} rotation={[1.52, 0, 0]}>
          <RoundedBox args={[0.34, 0.225, 0.01]} radius={0.004} position={[0, 0.1125, 0]} material={m.metal} />
          <mesh position={[0, 0.1125, 0.0052]} material={m.frame}>
            <planeGeometry args={[0.33, 0.215]} />
          </mesh>
          <mesh position={[0, 0.117, 0.0056]} material={codeMaterial}>
            <planeGeometry args={[0.31, 0.19]} />
          </mesh>
          <mesh position={[0, 0.117, 0.006]} material={deployMaterial}>
            <planeGeometry args={[0.31, 0.19]} />
          </mesh>
          <mesh position={[0, 0.115, -0.0055]} rotation={[0, Math.PI, 0]} material={m.signal}>
            <circleGeometry args={[0.014, 24]} />
          </mesh>
        </group>
        <pointLight ref={screenLight} position={[0, 0.16, 0.05]} color={palette.amber} intensity={0} distance={1.4} decay={1.5} />
      </group>

      <Mug m={m} />
      <Notebook m={m} />

      {/* The developer */}
      <group position={HIP}>
        <RoundedBox args={[0.34, 0.14, 0.28]} radius={0.05} position={[0, 0.02, 0]} material={m.pants} />

        {([-1, 1] as Side[]).map((s) => (
          <group key={s} position={[s * 0.09, 0, 0]} rotation={[0, s * 0.06, 0]}>
            <mesh position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]} material={m.pants}>
              <capsuleGeometry args={[0.068, 0.3, 6, 14]} />
            </mesh>
            <group position={[0, 0, -0.4]}>
              <mesh position={[0, -0.22, 0]} material={m.pants}>
                <capsuleGeometry args={[0.06, 0.34, 6, 14]} />
              </mesh>
              <RoundedBox args={[0.11, 0.075, 0.25]} radius={0.03} position={[0, -0.44, -0.05]} material={m.shoe} />
              <mesh position={[0, -0.4745, -0.05]} material={m.sole}>
                <boxGeometry args={[0.112, 0.012, 0.252]} />
              </mesh>
            </group>
          </group>
        ))}

        <group ref={torso} position={[0, 0.07, 0.01]}>
          <RoundedBox args={[0.4, 0.48, 0.25]} radius={0.08} position={[0, 0.24, 0]} material={m.hoodie} />
          <RoundedBox args={[0.24, 0.1, 0.02]} radius={0.008} position={[0, 0.1, -0.126]} material={m.hoodieDark} />
          <mesh position={[0, 0.46, 0.085]} rotation={[Math.PI / 2 - 0.5, 0, 0]} material={m.hoodie}>
            <torusGeometry args={[0.11, 0.045, 10, 22]} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.045, 0.37, -0.128]} material={m.paper}>
              <cylinderGeometry args={[0.007, 0.007, 0.14, 6]} />
            </mesh>
          ))}

          {/* Headphones resting around the neck */}
          <mesh position={[0, 0.49, -0.005]} rotation={[Math.PI / 2 + 0.25, 0, 0]} material={m.signal}>
            <torusGeometry args={[0.125, 0.018, 10, 32]} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.125, 0.47, -0.05]} rotation={[0, 0, Math.PI / 2]} material={m.ink}>
              <cylinderGeometry args={[0.048, 0.048, 0.035, 20]} />
            </mesh>
          ))}

          <group ref={neck} position={[0, 0.49, 0]} rotation-order="YXZ">
            <mesh position={[0, 0.03, 0]} material={m.skin}>
              <cylinderGeometry args={[0.05, 0.055, 0.09, 14]} />
            </mesh>
            <Head m={m} />
          </group>

          {([-1, 1] as Side[]).map((s) => (
            <group
              key={s}
              ref={(el) => {
                shoulders.current[s] = el;
              }}
              position={[s * 0.23, 0.42, 0]}
            >
              <mesh material={m.hoodie}>
                <sphereGeometry args={[0.075, 16, 12]} />
              </mesh>
              <mesh position={[0, -0.14, 0]} material={m.hoodie}>
                <capsuleGeometry args={[0.058, 0.2, 6, 14]} />
              </mesh>
              <group
                ref={(el) => {
                  forearms.current[s] = el;
                }}
                position={[0, -UPPER_ARM, 0]}
              >
                <mesh position={[0, -0.13, 0]} material={m.hoodie}>
                  <capsuleGeometry args={[0.052, 0.18, 6, 14]} />
                </mesh>
                <mesh position={[0, -0.245, 0]} material={m.hoodieDark}>
                  <cylinderGeometry args={[0.052, 0.05, 0.03, 14]} />
                </mesh>
                <group
                  ref={(el) => {
                    hands.current[s] = el;
                  }}
                  position={[0, -FOREARM + 0.015, 0]}
                >
                  <RoundedBox args={[0.075, 0.095, 0.034]} radius={0.015} position={[0, -0.045, 0]} material={m.skin} />
                  <RoundedBox
                    args={[0.022, 0.05, 0.022]}
                    radius={0.009}
                    position={[s * 0.042, -0.03, -0.006]}
                    rotation={[0, 0, s * 0.5]}
                    material={m.skin}
                  />
                </group>
              </group>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}

type Materials = ReturnType<typeof useMaterials>;

function Head({ m }: { m: Materials }) {
  return (
    <group position={[0, 0.07, 0]}>
      <RoundedBox args={[0.21, 0.25, 0.23]} radius={0.085} smoothness={5} position={[0, 0.13, -0.01]} material={m.skin} />
      {/* Hair: crown, back, swept fringe */}
      <RoundedBox args={[0.226, 0.1, 0.244]} radius={0.045} position={[0, 0.235, 0.005]} material={m.hair} />
      <RoundedBox args={[0.222, 0.17, 0.09]} radius={0.04} position={[0, 0.16, 0.075]} material={m.hair} />
      <RoundedBox
        args={[0.2, 0.05, 0.06]}
        radius={0.022}
        position={[0.018, 0.225, -0.105]}
        rotation={[0.2, 0, -0.14]}
        material={m.hair}
      />
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.108, 0.125, 0.01]} material={m.skin}>
            <sphereGeometry args={[0.028, 12, 10]} />
          </mesh>
          <mesh position={[s * 0.05, 0.14, -0.121]} material={m.ink}>
            <sphereGeometry args={[0.011, 10, 8]} />
          </mesh>
          <mesh position={[s * 0.05, 0.14, -0.128]} material={m.frame}>
            <torusGeometry args={[0.036, 0.0065, 8, 28]} />
          </mesh>
          <mesh position={[s * 0.1, 0.145, -0.07]} rotation={[0, Math.PI / 2, 0]} material={m.frame}>
            <boxGeometry args={[0.11, 0.006, 0.006]} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.145, -0.13]} material={m.frame}>
        <boxGeometry args={[0.03, 0.006, 0.006]} />
      </mesh>
      <RoundedBox args={[0.032, 0.05, 0.04]} radius={0.012} position={[0, 0.105, -0.13]} material={m.skin} />
      <mesh position={[0, 0.06, -0.122]} material={m.ink}>
        <boxGeometry args={[0.045, 0.007, 0.01]} />
      </mesh>
    </group>
  );
}

function Chair({ m }: { m: Materials }) {
  return (
    <group>
      <RoundedBox args={[0.48, 0.06, 0.46]} radius={0.025} position={[0, 0.42, 0.07]} material={m.ink} />
      <RoundedBox args={[0.46, 0.52, 0.05]} radius={0.025} position={[0, 0.76, 0.32]} rotation={[0.1, 0, 0]} material={m.ink} />
      <mesh position={[0, 0.55, 0.3]} material={m.frame}>
        <boxGeometry args={[0.04, 0.2, 0.02]} />
      </mesh>
      <mesh position={[0, 0.22, 0.07]} material={m.frame}>
        <cylinderGeometry args={[0.022, 0.022, 0.36, 12]} />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i} position={[0, 0.045, 0.07]} rotation={[0, a, 0]}>
            <mesh position={[0.14, 0, 0]} material={m.frame}>
              <boxGeometry args={[0.28, 0.025, 0.035]} />
            </mesh>
            <mesh position={[0.27, -0.02, 0]} material={m.ink}>
              <sphereGeometry args={[0.022, 10, 8]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Desk({ m }: { m: Materials }) {
  return (
    <group>
      <RoundedBox args={[1.2, 0.035, 0.62]} radius={0.01} position={[0, DESK_TOP - 0.0175, -0.47]} material={m.wood} />
      {[-1, 1].flatMap((sx) =>
        [-0.2, -0.74].map((z) => (
          <mesh key={`${sx}${z}`} position={[sx * 0.56, (DESK_TOP - 0.035) / 2, z]} material={m.ink}>
            <boxGeometry args={[0.03, DESK_TOP - 0.035, 0.03]} />
          </mesh>
        )),
      )}
      <mesh position={[0, 0.16, -0.74]} material={m.ink}>
        <boxGeometry args={[1.12, 0.025, 0.02]} />
      </mesh>
    </group>
  );
}

function Mug({ m }: { m: Materials }) {
  return (
    <group position={[0.4, DESK_TOP, -0.34]}>
      <mesh position={[0, 0.05, 0]} material={m.paper}>
        <cylinderGeometry args={[0.04, 0.036, 0.1, 22]} />
      </mesh>
      <mesh position={[0, 0.072, 0]} material={m.signal}>
        <cylinderGeometry args={[0.0405, 0.0395, 0.018, 22]} />
      </mesh>
      <mesh position={[0, 0.093, 0]} rotation={[-Math.PI / 2, 0, 0]} material={m.coffee}>
        <circleGeometry args={[0.035, 22]} />
      </mesh>
      <mesh position={[0.045, 0.05, 0]} material={m.paper}>
        <torusGeometry args={[0.024, 0.007, 8, 16]} />
      </mesh>
    </group>
  );
}

function Notebook({ m }: { m: Materials }) {
  return (
    <group position={[-0.37, DESK_TOP, -0.38]} rotation={[0, 0.22, 0]}>
      <RoundedBox args={[0.16, 0.014, 0.22]} radius={0.004} position={[0, 0.007, 0]} material={m.hoodie} />
      <mesh position={[0.02, 0.019, 0]} rotation={[Math.PI / 2, 0, 0.35]} material={m.signal}>
        <cylinderGeometry args={[0.005, 0.005, 0.15, 8]} />
      </mesh>
    </group>
  );
}
