"use client";

import { useEffect, useRef } from "react";
import { NeatGradient } from "@firecms/neat";

const config = {
  colors: [
    { color: "#FFFFFF", enabled: true },
    { color: "#EEEEEE", enabled: true },
    { color: "#C8C8C8", enabled: true },
    { color: "#F0F0F0", enabled: true },
    { color: "#E0E0E0", enabled: true },
  ],
  speed: 2,
  horizontalPressure: 4,
  verticalPressure: 5,
  waveFrequencyX: 4,
  waveFrequencyY: 3,
  waveAmplitude: 2,
  shadows: 7,
  highlights: 10,
  colorBrightness: 1,
  colorSaturation: 0,
  wireframe: false,
  colorBlending: 7,
  backgroundColor: "#0A0A0A",
  backgroundAlpha: 1,
  grainScale: 100,
  grainSparsity: 0,
  grainIntensity: 0.06,
  grainSpeed: 0.3,
  resolution: 0.5,
  yOffset: 0,
  yOffsetWaveMultiplier: 5,
  yOffsetColorMultiplier: 4.5,
  yOffsetFlowMultiplier: 5.5,
  flowDistortionA: 0.4,
  flowDistortionB: 3,
  flowScale: 3.3,
  flowEase: 0.53,
  flowEnabled: true,
  enableProceduralTexture: false,
  textureVoidLikelihood: 0.06,
  textureVoidWidthMin: 10,
  textureVoidWidthMax: 500,
  textureBandDensity: 0.8,
  textureColorBlending: 0.06,
  textureSeed: 333,
  textureEase: 0.48,
  proceduralBackgroundColor: "#000000",
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
