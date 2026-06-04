"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download, FolderGit2, BadgeCheck, Trophy, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────

interface ThreeRefs {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  composer: EffectComposer | null;
  stars: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>[];
  nebula: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial> | null;
  buildings: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>[];
  buildingWindows: THREE.ShaderMaterial[];
  animationId: number | null;
  targetCameraX?: number;
  targetCameraY?: number;
  targetCameraZ?: number;
  locations?: number[];
}

type Beat = {
  title: string;
  line1: string;
  line2: string;
  cta?: "primary" | "explore";
};

// Navigation targets surfaced as the final "EXPLORE" beat — the cosmos scroll ends here
// in a button grid instead of falling into stacked sections.
const EXPLORE_LINKS = [
  { href: "/projects", label: "Projects", desc: "10+ builds", Icon: FolderGit2 },
  { href: "/certificates", label: "Certificates", desc: "Credentials", Icon: BadgeCheck },
  { href: "/achievements", label: "Achievements", desc: "Wins & honors", Icon: Trophy },
  { href: "/contact", label: "Contact", desc: "Let's talk", Icon: Mail },
] as const;

// Rebranded narrative beats (camera flies HORIZON -> COSMOS -> INFINITY underneath).
const BEATS: Beat[] = [
  {
    title: "BIBEK PATHAK",
    line1: "Full-Stack Engineer",
    line2: "AI & ML Developer",
    cta: "primary",
  },
  {
    title: "BUILDER",
    line1: "10+ projects across React, Next.js,",
    line2: "Python and applied AI",
  },
  {
    title: "EXPLORE",
    line1: "Dive into the work —",
    line2: "pick where to go next",
    cta: "explore",
  },
];

const TOTAL_BEATS = BEATS.length;

// Authored chapter labels for the branded scroll indicator (aligned 1:1 with BEATS).
const CHAPTERS = ["IDENTITY", "WORK", "EXPLORE"] as const;

export const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const threeRefs = useRef<ThreeRefs>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    buildings: [],
    buildingWindows: [],
    animationId: null,
  });

  // ── Initialize Three.js ──────────────────────────────────────────────────────
  useEffect(() => {
    const refs = threeRefs.current;

    const createStarField = () => {
      const starCount = 5000;

      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let j = 0; j < starCount; j++) {
          const radius = 200 + Math.random() * 800;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[j * 3 + 2] = radius * Math.cos(phi);

          // Color variation — mostly white with warm gold accents (Ember Gold theme)
          const color = new THREE.Color();
          const colorChoice = Math.random();
          if (colorChoice < 0.82) {
            color.setHSL(0, 0, 0.8 + Math.random() * 0.2);
          } else if (colorChoice < 0.94) {
            color.setHSL(0.11, 0.45, 0.82);
          } else {
            color.setHSL(0.09, 0.6, 0.78);
          }

          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;

          sizes[j] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i },
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;

            void main() {
              vColor = color;
              vec3 pos = position;

              float angle = time * 0.05 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;

              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;

            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;

              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const stars = new THREE.Points(geometry, material);
        refs.scene?.add(stars);
        refs.stars.push(stars);
      }
    };

    const createNebula = () => {
      const geometry = new THREE.PlaneGeometry(8000, 4000, 100, 100);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          // Ember Gold theme — warm bronze -> gold nebula
          color1: { value: new THREE.Color(0x43320f) },
          color2: { value: new THREE.Color(0xc9a24b) },
          opacity: { value: 0.28 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;

          void main() {
            vUv = uv;
            vec3 pos = position;

            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
            pos.z += elevation;
            vElevation = elevation;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;

          void main() {
            float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);

            float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
            alpha *= 1.0 + vElevation * 0.01;

            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.z = -1050;
      nebula.rotation.x = 0;
      refs.scene?.add(nebula);
      refs.nebula = nebula;
    };

    // City skyline (replaces the old mountain ridges — the 21st.dev "horizon" tell).
    // Each depth layer is a row of boxy towers, fainter with distance for haze; near
    // layers get sparse warm-gold lit windows, a few of which flicker.
    const createBuildings = () => {
      const layers = [
        { distance: -50, color: 0x0b0b10, opacity: 1.0, maxH: 340, minH: 110, lit: 0.5 },
        { distance: -100, color: 0x0e0d14, opacity: 0.82, maxH: 280, minH: 90, lit: 0.3 },
        { distance: -150, color: 0x121019, opacity: 0.55, maxH: 210, minH: 70, lit: 0.14 },
        { distance: -200, color: 0x16131c, opacity: 0.34, maxH: 160, minH: 55, lit: 0 },
      ];

      const SPAN = 1500; // total skyline width
      const BASE_Y = -300; // ground line (bottom of the towers), matches the old ridge base

      layers.forEach((layer, index) => {
        // 1) Lay towers across x; remember each rect for window placement.
        //    Heights ease toward a center-biased target (a "downtown" envelope) with a
        //    smooth random-walk, so neighbours cluster into a real skyline instead of
        //    white-noise spikes. Far layers are lower/flatter (read as distance/haze).
        const rects: { x: number; w: number; h: number }[] = [];
        let cx = -SPAN / 2;
        let h = layer.maxH * 0.6; // running height
        while (cx < SPAN / 2) {
          const t = Math.abs(cx) / (SPAN / 2); // 0 center → 1 edge
          const envelope = 0.45 + 0.55 * Math.pow(1 - t, 1.3); // taller downtown, higher floor
          const target = layer.maxH * envelope * (0.8 + Math.random() * 0.2); // tighter variance
          h += (target - h) * (0.22 + Math.random() * 0.16); // gentler ease → smoother skyline
          h = Math.max(layer.minH, h);
          const w = Math.max(64, h * 0.13) + Math.random() * 46; // wider towers → fewer jaggy steps
          rects.push({ x: cx, w, h });
          cx += w + 7 + Math.random() * 9; // gap to next tower
        }

        // 2) Silhouette polygon: step up/over/down each tower top, then close the base.
        const points: THREE.Vector2[] = [];
        points.push(new THREE.Vector2(-SPAN, BASE_Y));
        rects.forEach((r) => {
          points.push(new THREE.Vector2(r.x, BASE_Y));
          points.push(new THREE.Vector2(r.x, BASE_Y + r.h));
          points.push(new THREE.Vector2(r.x + r.w, BASE_Y + r.h));
          points.push(new THREE.Vector2(r.x + r.w, BASE_Y));
        });
        points.push(new THREE.Vector2(SPAN, BASE_Y));
        points.push(new THREE.Vector2(SPAN, BASE_Y - 200));
        points.push(new THREE.Vector2(-SPAN, BASE_Y - 200));

        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide,
        });

        const building = new THREE.Mesh(geometry, material);
        building.position.z = layer.distance;
        building.position.y = 50; // steady resting height (no bob — a city shouldn't wobble)
        building.userData = { baseZ: layer.distance, index };
        refs.scene?.add(building);
        refs.buildings.push(building);

        // 3) Gold lit windows — child Points so they parallax with the tower.
        if (layer.lit > 0) {
          const wp: number[] = [];
          const wr: number[] = [];
          rects.forEach((r) => {
            const cols = Math.max(1, Math.floor(r.w / 14));
            const rows = Math.max(2, Math.floor(r.h / 18));
            const gx = (r.w - 12) / Math.max(1, cols);
            const gy = (r.h - 20) / Math.max(1, rows);
            for (let c = 0; c < cols; c++) {
              for (let rr = 0; rr < rows; rr++) {
                if (Math.random() > layer.lit) continue;
                wp.push(r.x + 8 + c * gx, BASE_Y + 12 + rr * gy, 1);
                wr.push(Math.random());
              }
            }
          });

          if (wp.length > 0) {
            const wgeo = new THREE.BufferGeometry();
            wgeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(wp), 3));
            wgeo.setAttribute("aRand", new THREE.BufferAttribute(new Float32Array(wr), 1));

            const wmat = new THREE.ShaderMaterial({
              uniforms: {
                time: { value: 0 },
                size: { value: 3.4 - index * 0.7 },
                color: { value: new THREE.Color(0xffc873) }, // warm gold
              },
              vertexShader: `
                attribute float aRand;
                uniform float time;
                uniform float size;
                varying float vGlow;
                void main() {
                  // Most windows hold steady; a subset (aRand > 0.8) flickers.
                  float flicker = aRand > 0.8
                    ? 0.4 + 0.6 * (0.5 + 0.5 * sin(time * (2.0 + aRand * 4.0) + aRand * 30.0))
                    : 0.82 + 0.18 * sin(time * 0.6 + aRand * 6.28);
                  vGlow = flicker;
                  vec4 mv = modelViewMatrix * vec4(position, 1.0);
                  gl_PointSize = size * (300.0 / -mv.z);
                  gl_Position = projectionMatrix * mv;
                }
              `,
              fragmentShader: `
                uniform vec3 color;
                varying float vGlow;
                void main() {
                  vec2 q = gl_PointCoord - vec2(0.5);
                  float d = length(q);
                  if (d > 0.5) discard;
                  float a = (1.0 - smoothstep(0.1, 0.5, d)) * vGlow;
                  gl_FragColor = vec4(color, a);
                }
              `,
              transparent: true,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            });

            const windows = new THREE.Points(wgeo, wmat);
            building.add(windows);
            refs.buildingWindows.push(wmat);
          }
        }
      });
    };

    const createAtmosphere = () => {
      const geometry = new THREE.SphereGeometry(600, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;

          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;

          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(0.78, 0.62, 0.34) * intensity;

            float pulse = sin(time * 2.0) * 0.1 + 0.9;
            atmosphere *= pulse;

            gl_FragColor = vec4(atmosphere, intensity * 0.25);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
      });

      const atmosphere = new THREE.Mesh(geometry, material);
      refs.scene?.add(atmosphere);
    };

    const getLocation = () => {
      const locations: number[] = [];
      refs.buildings.forEach((building, i) => {
        locations[i] = building.position.z;
      });
      refs.locations = locations;
    };

    const animate = () => {
      refs.animationId = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      refs.stars.forEach((starField) => {
        if (starField.material.uniforms) {
          starField.material.uniforms.time.value = time;
        }
      });

      if (refs.nebula && refs.nebula.material.uniforms) {
        refs.nebula.material.uniforms.time.value = time * 0.5;
      }

      // Smooth camera movement with easing
      if (refs.camera && refs.targetCameraX !== undefined) {
        const smoothingFactor = 0.05;

        smoothCameraPos.current.x +=
          (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y +=
          ((refs.targetCameraY ?? 0) - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z +=
          ((refs.targetCameraZ ?? 0) - smoothCameraPos.current.z) * smoothingFactor;

        const floatX = Math.sin(time * 0.1) * 2;
        const floatY = Math.cos(time * 0.15) * 1;

        refs.camera.position.x = smoothCameraPos.current.x + floatX;
        refs.camera.position.y = smoothCameraPos.current.y + floatY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, 10, -600);
      }

      // Buildings stay steady (camera float supplies the parallax); just drive the
      // window flicker.
      refs.buildingWindows.forEach((wmat) => {
        wmat.uniforms.time.value = time;
      });

      if (refs.composer) {
        refs.composer.render();
      }
    };

    const initThree = () => {
      if (!canvasRef.current) return;

      refs.scene = new THREE.Scene();
      refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025);

      refs.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      refs.camera.position.z = 100;
      refs.camera.position.y = 20;

      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      refs.renderer.toneMappingExposure = 0.5;

      // Multisampled render target so the buildings' hard edges don't crawl/jag: the
      // canvas's own MSAA is lost once we render through the bloom composer, so add it here.
      // IMPORTANT: keep HalfFloatType (the EffectComposer default) — UnsignedByte clamps at
      // 1.0 and crushes the bright HDR bloom (the "sun"/atmosphere glow).
      const dbSize = refs.renderer.getDrawingBufferSize(new THREE.Vector2());
      const msaaTarget = new THREE.WebGLRenderTarget(dbSize.width, dbSize.height, {
        type: THREE.HalfFloatType,
        samples: 4,
      });
      refs.composer = new EffectComposer(refs.renderer, msaaTarget);
      const renderPass = new RenderPass(refs.scene, refs.camera);
      refs.composer.addPass(renderPass);

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.8,
        0.4,
        0.85
      );
      refs.composer.addPass(bloomPass);

      createStarField();
      createNebula();
      createBuildings();
      createAtmosphere();
      getLocation();

      animate();

      setIsReady(true);
    };

    initThree();

    const handleResize = () => {
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.composer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId);
      }

      window.removeEventListener("resize", handleResize);

      refs.stars.forEach((starField) => {
        starField.geometry.dispose();
        starField.material.dispose();
      });
      refs.stars = [];

      refs.buildings.forEach((building) => {
        // Dispose the gold-window child Points too.
        building.children.forEach((child) => {
          if (child instanceof THREE.Points) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
          }
        });
        building.geometry.dispose();
        building.material.dispose();
      });
      refs.buildings = [];
      refs.buildingWindows = [];

      if (refs.nebula) {
        refs.nebula.geometry.dispose();
        refs.nebula.material.dispose();
        refs.nebula = null;
      }

      if (refs.composer) {
        refs.composer.dispose();
        refs.composer = null;
      }

      if (refs.renderer) {
        refs.renderer.dispose();
        refs.renderer = null;
      }

      refs.scene = null;
      refs.camera = null;
    };
  }, []);

  // ── GSAP text reveal — re-runs on every beat change ──────────────────────────
  useEffect(() => {
    if (!isReady) return;

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.set(titleRef.current, { visibility: "visible" });
        const titleChars = titleRef.current.querySelectorAll(".title-char");
        gsap.from(titleChars, {
          y: 120,
          opacity: 0,
          duration: 1,
          stagger: 0.04,
          ease: "power4.out",
        });
      }

      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { visibility: "visible" });
        const subtitleLines = subtitleRef.current.querySelectorAll(".subtitle-line");
        gsap.from(subtitleLines, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          delay: 0.1,
          ease: "power3.out",
        });
      }
    });

    return () => ctx.revert();
  }, [isReady, currentSection]);

  // ── Reveal the scroll indicator once ─────────────────────────────────────────
  useEffect(() => {
    if (!isReady || !scrollProgressRef.current) return;
    gsap.set(scrollProgressRef.current, { visibility: "visible" });
    const tween = gsap.from(scrollProgressRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.4,
      ease: "power2.out",
    });
    return () => {
      tween.kill();
    };
  }, [isReady]);

  // ── Scroll handling — scoped to the hero container (not the whole document) ──
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      const refs = threeRefs.current;
      if (!el || !refs.scene) return;

      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const progress = total > 0 ? scrolled / total : 0;

      setScrollProgress(progress);
      const newSection = Math.min(Math.floor(progress * TOTAL_BEATS), TOTAL_BEATS - 1);
      setCurrentSection(newSection);

      // Camera fly-through across the three beats
      const cameraPositions = [
        { x: 0, y: 30, z: 300 }, // Beat 0 — HORIZON
        { x: 0, y: 40, z: -50 }, // Beat 1 — COSMOS
        { x: 0, y: 50, z: -700 }, // Beat 2 — INFINITY
      ];

      const span = cameraPositions.length - 1;
      const beatProgress = progress * span;
      const idx = Math.min(Math.floor(beatProgress), span - 1);
      const f = beatProgress - idx;
      const currentPos = cameraPositions[idx];
      const nextPos = cameraPositions[idx + 1];

      refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * f;
      refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * f;
      refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * f;

      // Smooth parallax for the skyline + nebula
      refs.buildings.forEach((building, i) => {
        const speed = 1 + i * 0.9;
        const targetZ = building.userData.baseZ + scrolled * speed * 0.5;
        if (refs.nebula) {
          refs.nebula.position.z = targetZ + progress * speed * 0.01 - 100;
        }
        building.userData.targetZ = targetZ;
        if (progress > 0.7) {
          building.position.z = 600000;
        } else if (refs.locations) {
          building.position.z = refs.locations[i];
        }
      });
      if (refs.nebula && refs.buildings[3]) {
        refs.nebula.position.z = refs.buildings[3].position.z;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const splitTitle = (text: string) =>
    text.split("").map((char, i) => (
      <span key={i} className="title-char">
        {char}
      </span>
    ));

  const beat = BEATS[currentSection];

  // Chapter markers double as a mini-nav: smooth-scroll to the middle of a beat's range.
  const scrollToBeat = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const range = el.offsetHeight - window.innerHeight;
    const top = el.offsetTop + ((i + 0.5) / TOTAL_BEATS) * range;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="hero-container">
      <div className="hero-sticky">
        <canvas ref={canvasRef} className="hero-canvas" />

        {/* Beat content — swaps as the camera flies */}
        <div className="hero-content">
          {/* The cosmos blooms bright at the end of the scroll; this dark pool keeps the
              EXPLORE cards/text legible while stars still show at the edges. */}
          {beat.cta === "explore" && <div className="hero-explore-scrim" aria-hidden />}
          <div key={currentSection} className="hero-beat-inner">
            {currentSection === 0 && (
              <span className="role-badge">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-50" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                Available for Work
              </span>
            )}

            <h1 ref={titleRef} className="hero-title">
              {splitTitle(beat.title)}
            </h1>

            <div ref={subtitleRef} className="hero-subtitle">
              <p className="subtitle-line">{beat.line1}</p>
              <p className="subtitle-line">{beat.line2}</p>
            </div>

            {beat.cta === "primary" && (
              <div className="hero-actions">
                <LiquidButton
                  size="lg"
                  className="rounded-full font-bold group"
                  onClick={() => (window.location.href = "/achievements")}
                >
                  View Achievements
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </LiquidButton>
                <LiquidButton
                  size="lg"
                  variant="ghost"
                  className="rounded-full font-semibold"
                  onClick={() => window.open("/Bibek_Pathak_Resume_Mar26.pdf", "_blank")}
                >
                  Download Resume
                  <Download className="h-3.5 w-3.5" />
                </LiquidButton>
                <a
                  href="https://github.com/RavangDai"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="btn-icon h-11 w-11"
                >
                  <FaGithub className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/bibek-pathak-10398a301/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="btn-icon h-11 w-11"
                >
                  <FaLinkedinIn className="h-5 w-5" />
                </a>
              </div>
            )}

            {beat.cta === "explore" && (
              <div className="hero-explore-grid">
                {EXPLORE_LINKS.map(({ href, label, desc, Icon }) => (
                  <Link key={href} href={href} className="glass-panel hero-explore-card group rounded-2xl">
                    <Icon className="hero-explore-icon" />
                    <span className="hero-explore-label">{label}</span>
                    <span className="hero-explore-desc">{desc}</span>
                    <ArrowUpRight className="hero-explore-arrow" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Branded chapter markers + progress (scoped to the hero) */}
        <div ref={scrollProgressRef} className="scroll-progress" style={{ visibility: "hidden" }}>
          <div className="hero-chapters">
            {CHAPTERS.map((name, i) => (
              <button
                key={name}
                type="button"
                onClick={() => scrollToBeat(i)}
                className={`hero-chapter${i === currentSection ? " is-active" : ""}`}
                aria-label={`Go to ${name}`}
              >
                <span className="hero-chapter-idx">{String(i).padStart(2, "0")}</span>
                <span className="hero-chapter-name">{name}</span>
              </button>
            ))}
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${scrollProgress * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
