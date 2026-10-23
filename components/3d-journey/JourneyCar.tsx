"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface JourneyCarProps {
  scrollProgress: number; // 0.0 to 1.0
}

export function JourneyCar({ scrollProgress }: JourneyCarProps) {
  const carGroup = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);

  // Road trajectory spline: runs from z = -14 to z = -0.4 (harbor dock)
  const roadCurve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let z = -15; z <= -0.2; z += 0.5) {
      const x = Math.sin(z * 0.35) * 1.5;
      points.push(new THREE.Vector3(x, 0.12, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  useFrame(() => {
    if (!carGroup.current) return;

    // Car drives during scroll progress 0.0 -> 0.55
    // Map scrollProgress [0.0, 0.55] to spline t [0.05, 0.98]
    const carT = Math.min(0.98, Math.max(0.05, (scrollProgress / 0.55) * 0.95));

    const currentPos = roadCurve.getPoint(carT);
    const tangent = roadCurve.getTangent(carT);

    carGroup.current.position.copy(currentPos);

    // Car heading
    const angle = Math.atan2(tangent.x, tangent.z);
    carGroup.current.rotation.y = angle;

    // Spin wheels if moving
    if (scrollProgress < 0.55) {
      const spinSpeed = scrollProgress * 180;
      wheelsRef.current.forEach((w) => {
        if (w) w.rotation.x = spinSpeed;
      });
    }
  });

  return (
    <group ref={carGroup} position={[0, 0.12, -14]} castShadow receiveShadow>
      {/* 1. Main Car Body (Sleek Modern SUV / MPV) */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.78, 0.32, 1.8]} />
        <meshStandardMaterial
          color="#0f172a" // Deep midnight slate/sapphire
          metalness={0.88}
          roughness={0.25}
        />
      </mesh>

      {/* 2. Cabin / Roof with Aerodynamic Slope */}
      <mesh position={[0, 0.44, -0.1]} castShadow>
        <boxGeometry args={[0.7, 0.26, 1.15]} />
        <meshStandardMaterial
          color="#090d16"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* 3. Tinted Windshield & Windows */}
      <mesh position={[0, 0.44, 0.36]} rotation={[-0.32, 0, 0]}>
        <planeGeometry args={[0.66, 0.3]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.95}
          roughness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Side Windows */}
      <mesh position={[0.36, 0.44, -0.1]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.9, 0.2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-0.36, 0.44, -0.1]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.9, 0.2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 4. Glowing LED Headlights */}
      <mesh position={[0.26, 0.22, 0.91]}>
        <boxGeometry args={[0.16, 0.08, 0.04]} />
        <meshStandardMaterial color="#f8fafc" emissive="#38bdf8" emissiveIntensity={1.8} />
      </mesh>
      <mesh position={[-0.26, 0.22, 0.91]}>
        <boxGeometry args={[0.16, 0.08, 0.04]} />
        <meshStandardMaterial color="#f8fafc" emissive="#38bdf8" emissiveIntensity={1.8} />
      </mesh>

      {/* Headlight Beams */}
      <spotLight
        position={[0, 0.28, 0.95]}
        target-position={[0, 0, 4]}
        color="#bae6fd"
        intensity={1.2}
        angle={0.45}
        penumbra={0.6}
        distance={8}
      />

      {/* 5. Sleek Red Tail Lights */}
      <mesh position={[0.26, 0.25, -0.91]}>
        <boxGeometry args={[0.16, 0.06, 0.04]} />
        <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[-0.26, 0.25, -0.91]}>
        <boxGeometry args={[0.16, 0.06, 0.04]} />
        <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={1.5} />
      </mesh>

      {/* 6. Wheels (Front-Left, Front-Right, Rear-Left, Rear-Right) */}
      {[
        { x: 0.41, z: 0.55 },
        { x: -0.41, z: 0.55 },
        { x: 0.41, z: -0.55 },
        { x: -0.41, z: -0.55 },
      ].map((wheelPos, idx) => (
        <group
          key={idx}
          ref={(el) => {
            if (el) wheelsRef.current[idx] = el;
          }}
          position={[wheelPos.x, 0.1, wheelPos.z]}
        >
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.1, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
          {/* Wheel Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.09, 0.09, 0.11, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
