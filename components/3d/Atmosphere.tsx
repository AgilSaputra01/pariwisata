"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export function Atmosphere() {
  const cloudsRef = useRef<THREE.Group>(null);
  const starsRef = useRef<THREE.Points>(null);
  const shimmerRef = useRef<THREE.Mesh>(null);

  // Generate star field particle positions in a sphere shell
  const starGeometry = useMemo(() => {
    const count = 900;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 14 + Math.random() * 3;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.abs(Math.sin(phi) * Math.sin(theta));
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  // Cloud panel transforms: [x, y, z, width, opacity, rotation]
  const cloudPanels = useMemo<[number, number, number, number, number, number][]>(() => [
    [0.25, 0.72, -0.25, 1.6, 0.14, 0.4],
    [-0.10, 0.68, 0.30, 1.4, 0.11, -0.2],
    [0.55, 0.75, 0.12, 1.1, 0.10, 0.8],
    [-0.35, 0.70, -0.18, 1.28, 0.09, 1.2],
    [0.80, 0.65, -0.40, 0.88, 0.08, -0.5],
    [-0.60, 0.74, 0.25, 1.20, 0.12, 0.1],
  ], []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (starsRef.current) {
      starsRef.current.rotation.y = t * 0.006;
      starsRef.current.rotation.x = Math.sin(t * 0.002) * 0.02;
    }
    if (cloudsRef.current) {
      cloudsRef.current.position.x = Math.sin(t * 0.035) * 0.18;
      cloudsRef.current.position.z = Math.cos(t * 0.028) * 0.14;
      cloudsRef.current.rotation.y = t * 0.004;
    }
    if (shimmerRef.current) {
      const mat = shimmerRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.04 + Math.sin(t * 1.2) * 0.025 + Math.cos(t * 0.7) * 0.015;
    }
  });

  return (
    <>
      {/* Horizon Exponential Fog */}
      <fogExp2 attach="fog" args={["#0b1720", 0.11]} />

      {/* Ambient atmospheric skylight */}
      <ambientLight color="#1a3545" intensity={1.1} />

      {/* Main sun — low golden hour angle for topographic relief shadow */}
      <directionalLight
        position={[-5.0, 5.5, 3.0]}
        intensity={2.6}
        color="#ffe8c0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={16}
        shadow-camera-left={-3.5}
        shadow-camera-right={3.5}
        shadow-camera-top={3.5}
        shadow-camera-bottom={-3.5}
        shadow-bias={-0.0003}
      />

      {/* Secondary: Soft cyan lagoon fill from west sea direction */}
      <directionalLight position={[3.5, 2.2, -3.0]} intensity={0.85} color="#38d1c4" />

      {/* Hemisphere sky/ground gradient ambient */}
      <hemisphereLight args={["#1a3852", "#050d12", 0.55]} />

      {/* Ocean shimmer pulse light — sun-glint on water */}
      <mesh ref={shimmerRef} position={[1.2, 0.01, -0.5]} rotation={[-Math.PI / 2, 0, 0.3]}>
        <planeGeometry args={[3.5, 3.5]} />
        <meshBasicMaterial
          color="#5eead4"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Star Field Particles */}
      <points ref={starsRef} geometry={starGeometry}>
        <pointsMaterial
          color="#c8e8f5"
          size={0.035}
          sizeAttenuation
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
        />
      </points>

      {/* Sky dome — dark deep ocean ink sphere */}
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[13, 32, 16]} />
        <meshBasicMaterial color="#060d15" side={THREE.BackSide} fog={false} />
      </mesh>

      {/* Horizon glow ring at sea horizon level */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[9.0, 12.5, 64]} />
        <meshBasicMaterial
          color="#0f3b45"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
          fog={false}
        />
      </mesh>

      {/* Warm sun-side horizon glow plane */}
      <mesh position={[-3.5, 0.2, 1.5]} rotation={[0, Math.PI / 6, 0]}>
        <planeGeometry args={[6, 3]} />
        <meshBasicMaterial
          color="#ff8c42"
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
          fog={false}
        />
      </mesh>

      {/* Translucent high-altitude cloud wisps */}
      <group ref={cloudsRef}>
        {cloudPanels.map(([cx, cy, cz, w, opacity, rot], idx) => (
          <mesh
            key={idx}
            position={[cx, cy, cz]}
            rotation={[-Math.PI / 2, 0, rot]}
          >
            <planeGeometry args={[w * 3, w * 1.5]} />
            <meshBasicMaterial
              color="#dff0f8"
              transparent
              opacity={opacity}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}


