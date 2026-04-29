"use client";

import { useEffect, useRef } from "react";
import { NeatGradient } from "@firecms/neat";

const config = {
  colors: [
    { color: "#FF5373", enabled: true },
    { color: "#FFC858", enabled: true },
    { color: "#17E7FF", enabled: true },
    { color: "#6D3BFF", enabled: true },
    { color: "#f5e1e5", enabled: false },
    { color: "#A8E6CF", enabled: false },
  ],
  speed: 2,
  horizontalPressure: 2,
  verticalPressure: 5,
  waveFrequencyX: 2,
  waveFrequencyY: 2,
  waveAmplitude: 5,
  shadows: 10,
  highlights: 8,
  colorBrightness: 1,
  colorSaturation: 10,
  wireframe: true,
  colorBlending: 6,
  backgroundColor: "#003FFF",
  backgroundAlpha: 1,
  grainScale: 0,
  grainSparsity: 0,
  grainIntensity: 0,
  grainSpeed: 0,
  resolution: 0.95,
  yOffset: 0,
  yOffsetWaveMultiplier: 3.5,
  yOffsetColorMultiplier: 3.5,
  yOffsetFlowMultiplier: 3.5,
  flowDistortionA: 1.2,
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
  textureEase: 0.6,
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
