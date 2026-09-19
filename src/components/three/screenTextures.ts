import * as THREE from "three";
import { palette } from "./palette";

/** Small deterministic PRNG so the "code" on screen looks the same on every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function finish(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/**
 * A tall sheet of syntax-highlighted "code" drawn as bars. It tiles vertically,
 * so scrolling `texture.offset.y` reads as an editor scrolling forever.
 */
export function createCodeTexture() {
  const width = 512;
  const height = 1024;
  const lineHeight = 24;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const rand = mulberry32(7);

  ctx.fillStyle = palette.screen;
  ctx.fillRect(0, 0, width, height);

  // Gutter
  ctx.fillStyle = "#1a1a18";
  ctx.fillRect(0, 0, 48, height);

  const tokens = [palette.signal, palette.paper, palette.muted, palette.amber, palette.paperDim];
  let indent = 0;

  for (let row = 0; row < height / lineHeight; row++) {
    const y = row * lineHeight + 7;

    ctx.fillStyle = "#4a4944";
    ctx.font = "11px ui-monospace, monospace";
    ctx.fillText(String(row + 1).padStart(3, " "), 10, y + 9);

    // Blank lines and brace-driven indentation make the rhythm read as real code
    if (rand() < 0.14) {
      indent = Math.max(0, indent - 1);
      continue;
    }

    let x = 64 + indent * 22;
    const count = 1 + Math.floor(rand() * 4);
    for (let i = 0; i < count; i++) {
      const w = 18 + rand() * 90;
      if (x + w > width - 16) break;
      ctx.globalAlpha = i === 0 ? 0.95 : 0.8;
      ctx.fillStyle = tokens[Math.floor(rand() * tokens.length)];
      ctx.beginPath();
      ctx.roundRect(x, y, w, 10, 3);
      ctx.fill();
      x += w + 8;
    }
    ctx.globalAlpha = 1;

    const r = rand();
    if (r < 0.22 && indent < 4) indent++;
    else if (r > 0.82) indent = Math.max(0, indent - 1);
  }

  const texture = finish(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 0.34);
  return texture;
}

/** The "shipped" state shown on screen at the end of the scroll story. */
export function createDeployTexture() {
  const width = 512;
  const height = 340;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = palette.screen;
  ctx.fillRect(0, 0, width, height);

  // Check mark in a ring
  ctx.strokeStyle = palette.signal;
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.arc(width / 2, 120, 58, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(width / 2 - 26, 122);
  ctx.lineTo(width / 2 - 6, 142);
  ctx.lineTo(width / 2 + 30, 100);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = palette.paper;
  ctx.font = "600 34px Geist, ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("Deployed", width / 2, 236);
  ctx.fillStyle = palette.muted;
  ctx.font = "500 15px ui-monospace, monospace";
  ctx.fillText("BUILD PASSED · ALL CHECKS GREEN", width / 2, 272);

  return finish(canvas);
}
