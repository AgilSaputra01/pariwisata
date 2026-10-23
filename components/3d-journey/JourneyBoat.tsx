"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface JourneyBoatProps {
  scrollProgress: number; // 0.0 to 1.0
}

export function JourneyBoat({ scrollProgress }: JourneyBoatProps) {
  const boatGroup = useRef<THREE.Group>(null);
  const wakeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!boatGroup.current) return;

    const tTime = clock.getElapsedTime();

    // Boat trajectory in ocean:
    // Starts docked at z = 0.5 when scrollProgress <= 0.55
    // Accelerates across ocean to z = 16 when scrollProgress is 0.55 -> 0.88
    // Stays near island bay when scrollProgress > 0.88
    let boatZ = 0.6;
    let boatX = 0.3;

    if (scrollProgress > 0.55) {
      const oceanProgress = Math.min(1.0, (scrollProgress - 0.55) / 0.33);
      // Smooth travel path curving toward the island at x = 1.8, z = 16.5
      boatZ = 0.6 + oceanProgress * 15.5;
      boatX = 0.3 + Math.sin(oceanProgress * Math.PI * 0.7) * 1.5;
    }

    boatGroup.current.position.set(boatX, 0.04, boatZ);

    // Natural water pitching & roll
    const isMoving = scrollProgress > 0.55 && scrollProgress < 0.92;
    const wavePitch = Math.sin(tTime * 3) * (isMoving ? 0.06 : 0.02);
    const waveRoll = Math.cos(tTime * 2.5) * (isMoving ? 0.04 : 0.015);
    const heading = isMoving ? 0.12 : 0;

    boatGroup.current.rotation.set(wavePitch, heading, waveRoll);

    // Dynamic water wake opacity and scale when boat is moving
    if (wakeRef.current) {
      wakeRef.current.visible = isMoving;
      if (isMoving) {
        const wakeScale = 1.0 + Math.sin(tTime * 8) * 0.15;
        wakeRef.current.scale.set(wakeScale, 1, wakeScale);
      }
    }
  });

  return (
    <group ref={boatGroup} position={[0.3, 0.04, 0.6]} castShadow receiveShadow>
      {/* 1. Main Hull (Modern Fastboat Deep-V Hull) */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.92, 0.35, 2.4]} />
        <meshStandardMaterial
          color="#f8fafc" // Crisp clean marine white
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Pointed Bow (Front of boat) */}
      <mesh position={[0, 0.18, 1.35]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[0.65, 0.32, 0.65]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Sleek Turquoise Ocean Accent Stripe */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.94, 0.06, 2.42]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>

      {/* 2. Enclosed Passenger Cabin */}
      <mesh position={[0, 0.42, -0.1]} castShadow>
        <boxGeometry args={[0.78, 0.3, 1.5]} />
        <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.35} />
      </mesh>

      {/* Tinted Marine Passenger Windows */}
      <mesh position={[0.4, 0.43, -0.1]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.3, 0.16]} />
        <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-0.4, 0.43, -0.1]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.3, 0.16]} />
        <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Front Bridge Window */}
      <mesh position={[0, 0.43, 0.66]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[0.72, 0.22]} />
        <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 3. Outboard High-Power Engines (3 Outboard Motors) */}
      {[-0.26, 0, 0.26].map((xOffset, i) => (
        <group key={i} position={[xOffset, 0.12, -1.3]}>
          <mesh castShadow>
            <boxGeometry args={[0.14, 0.32, 0.18]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* 4. Navigation Radar & Mast */}
      <mesh position={[0, 0.65, -0.2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh position={[0, 0.74, -0.2]}>
        <boxGeometry args={[0.26, 0.04, 0.06]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* Glowing Navigation Lights */}
      <mesh position={[0.42, 0.3, 0.7]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#10b981" /> {/* Starboard Green */}
      </mesh>
      <mesh position={[-0.42, 0.3, 0.7]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ef4444" /> {/* Port Red */}
      </mesh>

      {/* 5. V-Wake & Foam Spray Behind Fastboat */}
      <mesh
        ref={wakeRef}
        position={[0, -0.02, -1.8]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[1.6, 2.8]} />
        <meshBasicMaterial
          color="#e0f2fe"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
