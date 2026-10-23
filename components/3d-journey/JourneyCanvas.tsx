"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { JourneyTerrain } from "./JourneyTerrain";
import { JourneyCar } from "./JourneyCar";
import { JourneyBoat } from "./JourneyBoat";
import { JourneyCamera } from "./JourneyCamera";
import { JourneyAtmosphere } from "./JourneyAtmosphere";

interface JourneyCanvasProps {
  scrollProgress: number; // 0.0 to 1.0
}

export function JourneyCanvas({ scrollProgress }: JourneyCanvasProps) {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-8 text-center">
        <p className="font-display text-2xl mb-2">BaliRide Digital Journey</p>
        <p className="text-sm text-slate-400">
          Akselerasi 3D dinonaktifkan. Menampilkan tata letak perjalanan standar.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{
          fov: 44,
          position: [0, 4.8, -10.5],
          near: 0.1,
          far: 60,
        }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
        className="w-full h-full"
      >
        <color attach="background" args={["#0c1921"]} />
        <Suspense fallback={null}>
          <JourneyAtmosphere scrollProgress={scrollProgress} />
          <JourneyCamera scrollProgress={scrollProgress} />
          <JourneyTerrain scrollProgress={scrollProgress} />
          <JourneyCar scrollProgress={scrollProgress} />
          <JourneyBoat scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
