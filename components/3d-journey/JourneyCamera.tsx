"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

interface JourneyCameraProps {
  scrollProgress: number; // 0.0 to 1.0
}

interface CameraKeyframe {
  progress: number;
  position: [number, number, number];
  target: [number, number, number];
}

const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  {
    progress: 0.0,
    // SCENE 01 — HERO: Wide aerial view of Bali landscape & road
    position: [0, 4.8, -10.5],
    target: [0, 0.5, -13.5],
  },
  {
    progress: 0.18,
    // SCENE 02 — RENTAL MOBIL: Tracking shot following the 3D car
    position: [-2.2, 1.6, -10.0],
    target: [0, 0.5, -8.0],
  },
  {
    progress: 0.35,
    // SCENE 03 — DESTINATION: Scenic roadside travel toward the coast
    position: [2.2, 1.3, -5.5],
    target: [0, 0.4, -3.5],
  },
  {
    progress: 0.50,
    // SCENE 04 — MENUJU PELABUHAN: Approaching harbor, ocean opens up
    position: [1.4, 1.8, -1.8],
    target: [0, 0.3, 0.2],
  },
  {
    progress: 0.62,
    // SCENE 05 — TRANSISI MOBIL KE FASTBOAT: Camera pivots from car to harbor dock & boat
    position: [-1.2, 1.4, 0.2],
    target: [0.3, 0.3, 1.5],
  },
  {
    progress: 0.76,
    // SCENE 06 — OCEAN JOURNEY: Dynamic tracking behind fastboat crossing ocean
    position: [-2.0, 1.8, 6.5],
    target: [0.8, 0.4, 10.5],
  },
  {
    progress: 0.88,
    // SCENE 07 — ISLAND ARRIVAL: Nusa Penida / Gili sea cliffs emerge
    position: [1.6, 2.4, 14.5],
    target: [1.8, 0.8, 18.5],
  },
  {
    progress: 1.0,
    // SCENE 08 & 09 — FINAL SUNSET & BOOKING: Elevated serene panoramic view
    position: [0, 3.8, 16.5],
    target: [1.5, 0.6, 20.0],
  },
];

export function JourneyCamera({ scrollProgress }: JourneyCameraProps) {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 4.8, -10.5));
  const currentLookAt = useRef(new THREE.Vector3(0, 0.5, -13.5));

  useEffect(() => {
    camera.position.set(0, 4.8, -10.5);
    camera.lookAt(0, 0.5, -13.5);
  }, [camera]);

  useFrame((state, delta) => {
    // Find active keyframe segment
    const p = Math.max(0, Math.min(1, scrollProgress));

    let kfA = CAMERA_KEYFRAMES[0];
    let kfB = CAMERA_KEYFRAMES[CAMERA_KEYFRAMES.length - 1];

    for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
      if (p >= CAMERA_KEYFRAMES[i].progress && p <= CAMERA_KEYFRAMES[i + 1].progress) {
        kfA = CAMERA_KEYFRAMES[i];
        kfB = CAMERA_KEYFRAMES[i + 1];
        break;
      }
    }

    // Segment interpolation factor t in [0, 1] with smoothstep easing
    const segRange = kfB.progress - kfA.progress;
    const rawT = segRange > 0 ? (p - kfA.progress) / segRange : 0;
    // Smoothstep easing for cinematic motion
    const t = rawT * rawT * (3 - 2 * rawT);

    const targetPos = new THREE.Vector3(
      THREE.MathUtils.lerp(kfA.position[0], kfB.position[0], t),
      THREE.MathUtils.lerp(kfA.position[1], kfB.position[1], t),
      THREE.MathUtils.lerp(kfA.position[2], kfB.position[2], t)
    );

    const targetLook = new THREE.Vector3(
      THREE.MathUtils.lerp(kfA.target[0], kfB.target[0], t),
      THREE.MathUtils.lerp(kfA.target[1], kfB.target[1], t),
      THREE.MathUtils.lerp(kfA.target[2], kfB.target[2], t)
    );

    // Subtle pointer parallax
    const parallaxX = state.pointer.x * 0.14;
    const parallaxY = state.pointer.y * 0.08;
    targetPos.x += parallaxX;
    targetPos.y += parallaxY;

    // Smooth damping to avoid abrupt jumps
    const damping = Math.min(1.0, delta * 3.5);
    currentPos.current.lerp(targetPos, damping);
    currentLookAt.current.lerp(targetLook, damping);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
