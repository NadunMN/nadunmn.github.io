import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { DeveloperModel, type Pointer } from "./DeveloperModel";
import { poseAt } from "./choreography";
import { palette } from "./palette";

export interface DeveloperSceneProps {
  progress: MotionValue<number>;
  pointer: MutableRefObject<Pointer>;
  waveAt: MutableRefObject<number>;
  reducedMotion: boolean;
  /** Stops rendering while the canvas is off screen */
  active: boolean;
}

const LOOK_AT = new THREE.Vector3(0, 0.74, -0.18);

/** Orbits the camera around the desk following the scroll pose, with a little pointer parallax. */
function CameraRig({ progress, pointer, reducedMotion }: Pick<DeveloperSceneProps, "progress" | "pointer" | "reducedMotion">) {
  const cam = useRef({ angle: 0, radius: 0, height: 0, init: false });

  useFrame((state, delta) => {
    const pose = poseAt(progress.get());
    const c = cam.current;
    const dt = Math.min(delta, 1 / 20);
    const rate = reducedMotion ? 60 : 3.2;
    if (!c.init) {
      Object.assign(c, { angle: pose.camAngle, radius: pose.camRadius, height: pose.camHeight, init: true });
    }
    c.angle = THREE.MathUtils.damp(c.angle, pose.camAngle, rate, dt);
    c.radius = THREE.MathUtils.damp(c.radius, pose.camRadius, rate, dt);
    c.height = THREE.MathUtils.damp(c.height, pose.camHeight, rate, dt);

    const p = pointer.current;
    const px = reducedMotion || !p.active ? 0 : p.x;
    const py = reducedMotion || !p.active ? 0 : p.y;
    const angle = c.angle + px * 0.08;

    state.camera.position.set(
      LOOK_AT.x + Math.sin(angle) * c.radius,
      c.height + py * 0.08,
      LOOK_AT.z + Math.cos(angle) * c.radius,
    );
    state.camera.lookAt(LOOK_AT);
  });

  return null;
}

/** Slow-drifting wireframe solids that give the paper backdrop some depth. */
function Drift({ progress, reducedMotion }: Pick<DeveloperSceneProps, "progress" | "reducedMotion">) {
  const group = useRef<THREE.Group>(null!);
  const shapes = useMemo(
    () => [
      { geo: new THREE.IcosahedronGeometry(0.09, 0), pos: [-0.75, 1.55, -0.6], speed: 0.6 },
      { geo: new THREE.OctahedronGeometry(0.07, 0), pos: [0.8, 1.35, -0.2], speed: 0.8 },
      { geo: new THREE.TetrahedronGeometry(0.07, 0), pos: [0.55, 1.75, -0.9], speed: 0.5 },
      { geo: new THREE.IcosahedronGeometry(0.05, 0), pos: [-0.6, 1.05, 0.45], speed: 0.9 },
      { geo: new THREE.OctahedronGeometry(0.05, 0), pos: [0.2, 1.9, 0.3], speed: 0.7 },
    ],
    [],
  );
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ color: palette.ink, wireframe: true, transparent: true, opacity: 0.28 }),
    [],
  );

  useFrame((state) => {
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const lift = progress.get() * 0.5;
    group.current.children.forEach((child, i) => {
      const s = shapes[i];
      child.position.y = s.pos[1] + Math.sin(t * s.speed + i) * 0.05 - lift * s.speed * 0.4;
      child.rotation.x = t * s.speed * 0.4;
      child.rotation.y = t * s.speed * 0.3 + progress.get() * 3;
    });
  });

  return (
    <group ref={group}>
      {shapes.map((s, i) => (
        <mesh key={i} geometry={s.geo} material={material} position={s.pos as [number, number, number]} />
      ))}
    </group>
  );
}

export default function DeveloperScene({ progress, pointer, waveAt, reducedMotion, active }: DeveloperSceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ fov: 30, near: 0.1, far: 30, position: [3, 1.4, 1] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[2.5, 4, 2]} intensity={1.6} color="#fff4e6" />
      <directionalLight position={[-3, 2, -2]} intensity={0.45} color={palette.amber} />

      {/* Studio reflections built in-scene, so nothing is fetched from a CDN */}
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 4, 1]} scale={[6, 3, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.2} position={[4, 1.5, 2]} scale={[3, 2, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="rect" intensity={0.8} color={palette.signal} position={[-4, 1, -1]} scale={[2, 2, 1]} rotation-y={Math.PI / 2} />
      </Environment>

      <DeveloperModel progress={progress} pointer={pointer} waveAt={waveAt} reducedMotion={reducedMotion} />
      <Drift progress={progress} reducedMotion={reducedMotion} />

      <ContactShadows position={[0, 0.001, -0.2]} scale={3.2} resolution={512} blur={2.4} opacity={0.5} far={1.2} color={palette.ink} frames={1} />

      <CameraRig progress={progress} pointer={pointer} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
