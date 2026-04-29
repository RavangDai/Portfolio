"use client";

import { useEffect, useRef } from "react";
import { NeatGradient } from "@firecms/neat";

const config = {
  colors: [
    { color: "#E3D1E6", enabled: true },
    { color: "#ffc8dd", enabled: true },
    { color: "#ffafcc", enabled: true },
    { color: "#C5E2FF", enabled: true },
    { color: "#00B3FF", enabled: false },
  ],
  speed: 4.5,
  horizontalPressure: 6,
  verticalPressure: 6,
  waveFrequencyX: 3,
  waveFrequencyY: 3,
  waveAmplitude: 3,
  shadows: 2,
  highlights: 3,
  colorBrightness: 1,
  colorSaturation: -4,
  wireframe: true,
  colorBlending: 6,
  backgroundColor: "#FF9D9D",
  backgroundAlpha: 1,
  grainScale: 0,
  grainSparsity: 0,
  grainIntensity: 0,
  grainSpeed: 0,
  resolution: 0.4,
  yOffset: 0,
  yOffsetWaveMultiplier: 10.9,
  yOffsetColorMultiplier: 3.8,
  yOffsetFlowMultiplier: 6.2,
  flowDistortionA: 2.8,
  flowDistortionB: 2.4,
  flowScale: 1.5,
  flowEase: 0.41,
  flowEnabled: false,
  enableProceduralTexture: false,
  textureVoidLikelihood: 0.06,
  textureVoidWidthMin: 10,
  textureVoidWidthMax: 500,
  textureBandDensity: 0.8,
  textureColorBlending: 0.06,
  textureSeed: 333,
  textureEase: 0.72,
  proceduralBackgroundColor: "#FFED00",
  textureShapeTriangles: 20,
  textureShapeCircles: 15,
  textureShapeBars: 15,
  textureShapeSquiggles: 10,
  domainWarpEnabled: false,
  domainWarpIntensity: 0,
  domainWarpScale: 3,
  vignetteIntensity: 0.3,
  vignetteRadius: 0.6,
  fresnelEnabled: true,
  fresnelPower: 2,
  fresnelIntensity: 0.2,
  fresnelColor: "#FF0000",
  iridescenceEnabled: false,
  iridescenceIntensity: 0.8,
  iridescenceSpeed: 1,
  bloomIntensity: 0.4,
  bloomThreshold: 0.7,
  chromaticAberration: 9,
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
