"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

interface CameraControllerProps {
  targetPosition: [number, number, number];
  targetLookAt: [number, number, number];
  isExploreMode: boolean;
}

export function CameraController({
  targetPosition,
  targetLookAt,
  isExploreMode,
}: CameraControllerProps) {
  const { camera } = useThree();
  const orbitRef = useRef<any>(null);

  // Desired camera state vectors
  const currentPos = useRef(new THREE.Vector3(0, 7.5, 6.5)); // Initial high stratosphere position
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const introFinished = useRef(false);

  // Sync initial camera position
  useEffect(() => {
    camera.position.set(0, 7.5, 6.5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame((state, delta) => {
    if (isExploreMode && orbitRef.current) {
      // In manual explore mode, OrbitControls takes active charge
      orbitRef.current.update();
      return;
    }

    const dampSpeed = introFinished.current ? 2.5 : 1.2; // Slower during initial descent
    const factor = Math.min(1.0, delta * dampSpeed);

    // Subtle mouse parallax in cinematic mode
    const parallaxX = state.pointer.x * 0.12;
    const parallaxY = state.pointer.y * 0.08;

    const desiredX = targetPosition[0] + parallaxX;
    const desiredY = targetPosition[1] + parallaxY;
    const desiredZ = targetPosition[2];

    currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, desiredX, factor);
    currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, desiredY, factor);
    currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, desiredZ, factor);

    currentLookAt.current.x = THREE.MathUtils.lerp(currentLookAt.current.x, targetLookAt[0], factor);
    currentLookAt.current.y = THREE.MathUtils.lerp(currentLookAt.current.y, targetLookAt[1], factor);
    currentLookAt.current.z = THREE.MathUtils.lerp(currentLookAt.current.z, targetLookAt[2], factor);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);

    if (!introFinished.current && camera.position.distanceTo(new THREE.Vector3(...targetPosition)) < 1.0) {
      introFinished.current = true;
    }
  });

  return (
    <>
      {isExploreMode && (
        <OrbitControls
          ref={orbitRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1.2}
          maxDistance={7.0}
          maxPolarAngle={Math.PI / 2.15} // Prevent going below sea level
          minPolarAngle={Math.PI / 6}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          dampingFactor={0.06}
          enableDamping
        />
      )}
    </>
  );
}
