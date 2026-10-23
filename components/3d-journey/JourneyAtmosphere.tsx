"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface JourneyAtmosphereProps {
  scrollProgress: number; // 0.0 to 1.0
}

export function JourneyAtmosphere({ scrollProgress }: JourneyAtmosphereProps) {
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const fogRef = useRef<THREE.FogExp2>(null);

  useFrame(() => {
    const p = Math.max(0, Math.min(1, scrollProgress));

    // Dynamic light color interpolation:
    // Morning (soft gold/white) -> Daylight (clear sky blue/white) -> Sunset (golden amber/rose)
    const colorMorning = new THREE.Color("#fff5e6");
    const colorDay = new THREE.Color("#ffffff");
    const colorSunset = new THREE.Color("#fdba74");

    const ambientMorning = new THREE.Color("#cbd5e1");
    const ambientDay = new THREE.Color("#94a3b8");
    const ambientSunset = new THREE.Color("#78350f");

    const fogDay = new THREE.Color("#94a3b8");
    const fogSunset = new THREE.Color("#1e1b4b");

    let currentSunColor = new THREE.Color();
    let currentAmbient = new THREE.Color();
    let currentFog = new THREE.Color();

    if (p < 0.6) {
      const t = p / 0.6;
      currentSunColor.copy(colorMorning).lerp(colorDay, t);
      currentAmbient.copy(ambientMorning).lerp(ambientDay, t);
      currentFog.copy(new THREE.Color("#e2e8f0")).lerp(fogDay, t);
    } else {
      const t = (p - 0.6) / 0.4;
      currentSunColor.copy(colorDay).lerp(colorSunset, t);
      currentAmbient.copy(ambientDay).lerp(ambientSunset, t);
      currentFog.copy(fogDay).lerp(fogSunset, t);
    }

    if (sunLightRef.current) {
      sunLightRef.current.color.copy(currentSunColor);
      // Sun angle lowers toward sunset
      sunLightRef.current.position.set(
        -8 + p * 4,
        8 - p * 3.5, // lowers toward horizon
        -6 + p * 18
      );
    }

    if (ambientLightRef.current) {
      ambientLightRef.current.color.copy(currentAmbient);
    }

    if (fogRef.current) {
      fogRef.current.color.copy(currentFog);
    }
  });

  return (
    <>
      <fogExp2 ref={fogRef} attach="fog" args={["#e2e8f0", 0.028]} />

      <ambientLight ref={ambientLightRef} intensity={0.8} />

      <directionalLight
        ref={sunLightRef}
        position={[-8, 8, -6]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      >
        <orthographicCamera attach="shadow-camera" args={[-16, 16, 16, -16, 0.5, 40]} />
      </directionalLight>

      {/* Ocean water specular bounce light */}
      <directionalLight position={[6, 4, 15]} intensity={0.6} color="#38bdf8" />
    </>
  );
}
