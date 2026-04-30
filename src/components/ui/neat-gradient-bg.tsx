"use client";

import { useEffect, useRef } from "react";
import { NeatGradient } from "@firecms/neat";

const config = {
  colors: [
    { color: "#554226", enabled: true },
    { color: "#03162D", enabled: true },
    { color: "#002027", enabled: true },
    { color: "#020210", enabled: true },
    { color: "#02152A", enabled: true },
    { color: "#B8D4E6", enabled: false },
  ],
  speed: 2,
  horizontalPressure: 3,
  verticalPressure: 5,
  waveFrequencyX: 1,
  waveFrequencyY: 3,
  waveAmplitude: 8,
  shadows: 0,
  highlights: 2,
  colorBrightness: 1,
  colorSaturation: 6,
  wireframe: false,
  colorBlending: 7,
  backgroundColor: "#003FFF",
  backgroundAlpha: 1,
  grainScale: 2,
  grainSparsity: 0,
  grainIntensity: 0.175,
  grainSpeed: 1,
  resolution: 1,
  yOffset: 0,
  yOffsetWaveMultiplier: 1.8,
  yOffsetColorMultiplier: 2,
  yOffsetFlowMultiplier: 2.2,
  flowDistortionA: 3.1,
  flowDistortionB: 2.4,
  flowScale: 1.5,
  flowEase: 0.31,
  flowEnabled: false,
  enableProceduralTexture: false,
  textureVoidLikelihood: 0.06,
  textureVoidWidthMin: 10,
  textureVoidWidthMax: 500,
  textureBandDensity: 0.8,
  textureColorBlending: 0.06,
  textureSeed: 333,
  textureEase: 0.8,
  proceduralBackgroundColor: "#FFED00",
  textureShapeTriangles: 20,
  textureShapeCircles: 15,
  textureShapeBars: 15,
  textureShapeSquiggles: 10,
  domainWarpEnabled: false,
  domainWarpIntensity: 0,
  domainWarpScale: 3,
  vignetteIntensity: 0,
  vignetteRadius: 0.8,
  fresnelEnabled: false,
  fresnelPower: 2,
  fresnelIntensity: 0.5,
  fresnelColor: "#FFFFFF",
  iridescenceEnabled: false,
  iridescenceIntensity: 0.5,
  iridescenceSpeed: 1,
  bloomIntensity: 0,
  bloomThreshold: 0.7,
  chromaticAberration: 0,
};

export function NeatGradientBg() {
  const ref = useRef<HTMLCanvasElement>(null);
  const gradientRef = useRef<NeatGradient | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    gradientRef.current = new NeatGradient({ ref: ref.current, ...config });

    const handleScroll = () => {
      if (gradientRef.current) {
        gradientRef.current.yOffset = window.scrollY;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      gradientRef.current?.destroy();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
