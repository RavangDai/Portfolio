"use client";

import { useEffect, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  OrthographicCamera,
  Points,
  ShaderMaterial,
  Scene,
  Vector2,
  Vector4,
  WebGLRenderer,
} from "three";

/**
 * Footer halftone field — a print-halftone dot grid, ink on paper.
 *
 * Deliberately NOT a glossy 3D scene: no lights, no materials, no reflections, no bloom.
 * It's a flat grid of circles whose RADIUS is driven by a travelling wave, which is how a
 * halftone screen encodes tone. That keeps it inside the site's paper-and-ink brutalist
 * language instead of reading as generic portfolio WebGL.
 *
 * The trick that makes it feel authored: the giant BIBEK PATHAK wordmark in the DOM is
 * measured every resize and fed in as a rounded-box SDF (`uNameRect`). Dots are erased
 * inside the letters' box and pile into a pressure ring around its edge, so the type looks
 * like it is physically displacing the ink field. The wordmark stays real, selectable DOM
 * text — the field just reacts to where it is.
 *
 * One draw call: a single THREE.Points, circles cut in the fragment shader.
 *
 * Perf contract (this is the site's SECOND WebGL context, see lib/neat-control.ts):
 *   - the parent only mounts us near the footer; the background gradient parks while we run
 *   - DPR capped at 1.5, antialias off, low-power GPU hint
 *   - rAF stops entirely on tab hide
 *   - reduced motion renders one frame and never starts the loop
 */

// Grid density. Denser on wide screens so the pressure ring reads as a curve, not stairs.
function gridFor(width: number) {
  if (width < 640) return { cols: 56, rows: 40 };
  if (width < 1280) return { cols: 88, rows: 46 };
  return { cols: 116, rows: 52 };
}

const VERT = /* glsl */ `
  uniform float uTime;
  uniform vec2  uPointer;
  uniform float uScale;
  uniform float uReveal;
  uniform vec4  uNameRect;   // cx, cy, halfW, halfH — the wordmark, in grid space
  varying float vTone;

  // Signed distance to a box: negative inside, positive outside.
  float sdBox(vec2 p, vec2 half_) {
    vec2 q = abs(p) - half_;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
  }

  void main() {
    vec2 p = position.xy;

    // Base field: a travelling wave from the pointer, plus a slower cross-drift so it never
    // reads as one clean concentric ripple.
    float d = distance(p, uPointer);
    float wave  = sin(d * 5.5 - uTime * 1.5);
    float drift = sin(p.x * 1.7 + uTime * 0.35) * cos(p.y * 1.9 - uTime * 0.28);
    float tone = 0.42 + 0.26 * wave + 0.16 * drift;

    // The wordmark displaces the field.
    float sd = sdBox(p - uNameRect.xy, uNameRect.zw);
    float clear = smoothstep(-0.015, 0.12, sd);          // erased inside the letters' box
    float ring  = exp(-pow(max(sd, 0.0) * 6.5, 2.0));    // ink piles up along its edge
    tone = tone * clear + ring * 0.62;

    // Dots grow in from the bottom as the curtain rises.
    float rise = smoothstep(-1.0, 1.0, -p.y);
    tone *= clamp(uReveal * 1.45 - rise * 0.3, 0.0, 1.0);

    vTone = clamp(tone, 0.0, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = max(vTone * uScale, 0.0);
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uAccent;
  varying float vTone;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r2 = dot(c, c);
    if (r2 > 0.25) discard;

    // Soften only the outermost pixel so dots don't shimmer as the radius animates.
    float edge = 1.0 - smoothstep(0.19, 0.25, r2);

    // Ink, tipping to terracotta where tone peaks — the accent emerges from the field's own
    // density (mostly the pressure ring) rather than being painted on as decoration.
    vec3 col = mix(uInk, uAccent, smoothstep(0.55, 0.92, vTone));

    gl_FragColor = vec4(col, edge * 0.92);
  }
`;

export default function FooterHalftone() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        alpha: true, // paper shows through — dots are the only thing drawn
        antialias: false,
        powerPreference: "low-power",
      });
    } catch {
      return; // no WebGL — the footer's paper + type stand on their own
    }
    renderer.setClearAlpha(0);

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 10);
    camera.position.z = 1;

    const material = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: new Vector2(0, 0) },
        uScale: { value: 10 },
        uReveal: { value: reduce ? 1 : 0 },
        uNameRect: { value: new Vector4(0, 0, 0, 0) },
        uInk: { value: new Color("#1a1714") },
        uAccent: { value: new Color("#bd5232") },
      },
    });

    let geometry = new BufferGeometry();
    const points = new Points(geometry, material);
    scene.add(points);

    let cols = 0;
    let rows = 0;
    const buildGrid = (w: number) => {
      const next = gridFor(w);
      if (next.cols === cols && next.rows === rows) return;
      cols = next.cols;
      rows = next.rows;
      const count = cols * rows;
      const positions = new Float32Array(count * 3);
      let i = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          positions[i++] = (x / (cols - 1)) * 2 - 1;
          positions[i++] = (y / (rows - 1)) * 2 - 1;
          positions[i++] = 0;
        }
      }
      const g = new BufferGeometry();
      g.setAttribute("position", new BufferAttribute(positions, 3));
      points.geometry = g;
      geometry.dispose();
      geometry = g;
    };

    // ── Sizing ────────────────────────────────────────────────────────────────
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let aspect = 1;

    const curtain = canvas.closest("[data-curtain]") as HTMLElement | null;
    const signature = curtain?.querySelector("[data-signature]") as HTMLElement | null;

    // Feed the wordmark's live box to the shader, converted into grid space.
    const measureName = () => {
      const rect = material.uniforms.uNameRect.value as Vector4;
      if (!signature) return rect.set(0, 0, 0, 0);
      const c = canvas.getBoundingClientRect();
      const r = signature.getBoundingClientRect();
      if (!c.width || !c.height) return rect.set(0, 0, 0, 0);
      const cx = ((r.left + r.width / 2 - c.left) / c.width) * 2 * aspect - aspect;
      const cy = -(((r.top + r.height / 2 - c.top) / c.height) * 2 - 1);
      // Padding so the ring hugs the type rather than crushing into it.
      return rect.set(cx, cy, (r.width / c.width) * aspect * 1.02, (r.height / c.height) * 0.82);
    };

    const resize = () => {
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      aspect = w / h;
      camera.left = -aspect;
      camera.right = aspect;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      buildGrid(w);
      material.uniforms.uScale.value = ((w * dpr) / cols) * 1.12;
      points.scale.set(aspect, 1, 1);
      measureName();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (signature) ro.observe(signature);

    // The wordmark uses a webfont; its box changes once that swaps in.
    document.fonts?.ready.then(measureName).catch(() => {});

    // ── Pointer ───────────────────────────────────────────────────────────────
    const pointerTarget = new Vector2(0, 0);
    const onPointerMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      pointerTarget.set(
        ((e.clientX - r.left) / r.width) * 2 * aspect - aspect,
        -(((e.clientY - r.top) / r.height) * 2 - 1)
      );
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const readReveal = () => {
      // No curtain element means the reduced-motion / in-flow layout: full tone.
      if (!curtain) return 1;
      // ScrollTrigger hasn't written the var yet (the scene preloads a viewport early).
      // Treat that as "not revealed" so the dots grow in rather than pop.
      const v = parseFloat(curtain.style.getPropertyValue("--curtain-p"));
      return Number.isFinite(v) ? v : 0;
    };

    if (reduce) {
      material.uniforms.uTime.value = 1.2; // a non-flat slice of the wave
      measureName();
      renderer.render(scene, camera);
    }

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      material.uniforms.uTime.value += dt;
      (material.uniforms.uPointer.value as Vector2).lerp(pointerTarget, 1 - Math.pow(0.001, dt));
      material.uniforms.uReveal.value += (readReveal() - material.uniforms.uReveal.value) * 0.12;

      renderer.render(scene, camera);
    };
    if (!reduce) raf = requestAnimationFrame(tick);

    // A background tab should cost nothing.
    const onVisibility = () => {
      if (reduce) return;
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="brut-curtain-canvas" aria-hidden />;
}
