/**
 * Scroll story for the developer scene. `p` runs 0→1 while the stage is on
 * screen (see the offsets in DeveloperStage). Three beats:
 *
 *   arrive (≈0.00–0.30)  lid opens, screen powers on, camera at a side view
 *   focus  (≈0.30–0.65)  leans in and types hard, camera swings to the front
 *   ship   (≈0.65–1.00)  build passes, leans back with hands behind head,
 *                        camera drifts over the shoulder to show the screen
 */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** 0→1 across [a, b] with smoothstep easing. */
export const window01 = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export interface Pose {
  /** Laptop lid rotation (rad): ~π/2 closed, negative = open past vertical */
  lid: number;
  /** 0 = screen off, 1 = full glow */
  screen: number;
  /** 0 = code, 1 = "deployed" card */
  deployed: number;
  /** How hard the hands are typing, 0–1 */
  typing: number;
  /** Torso pitch (rad): negative leans toward the desk, positive leans back */
  lean: number;
  /** Head pitch (rad): negative looks down */
  headPitch: number;
  /** 0 = hands on keyboard, 1 = hands behind head */
  stretch: number;
  /** Camera orbit angle around the desk (rad), radius and height */
  camAngle: number;
  camRadius: number;
  camHeight: number;
}

export function poseAt(p: number): Pose {
  const arrive = window01(p, 0.06, 0.3);
  const focus = window01(p, 0.3, 0.5);
  const ship = window01(p, 0.62, 0.8);

  return {
    lid: lerp(1.52, -0.3, arrive),
    screen: window01(p, 0.14, 0.3),
    deployed: window01(p, 0.66, 0.74),
    typing: lerp(lerp(0.25, 1, focus), 0, ship),
    lean: lerp(lerp(0.04, -0.2, focus), 0.26, ship),
    headPitch: lerp(lerp(-0.12, -0.32, focus), 0.12, ship),
    stretch: ship,
    camAngle: lerp(lerp(Math.PI * 0.6, Math.PI * 0.8, focus), Math.PI * 0.18, ship),
    camRadius: lerp(lerp(3.9, 3.4, focus), 3.3, ship),
    camHeight: lerp(lerp(1.3, 1.45, focus), 1.6, ship),
  };
}

/** Which beat is showing — drives the caption under the canvas. */
export function beatAt(p: number) {
  if (p < 0.3) return 0;
  if (p < 0.66) return 1;
  return 2;
}

export const beats = ["Booting up", "Deep work", "Shipped"] as const;
