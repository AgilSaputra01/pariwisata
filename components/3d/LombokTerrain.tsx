"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface LombokTerrainProps {
  onHoverLocation?: (id: string | null) => void;
  selectedLocationId?: string | null;
}

/**
 * Calculates geographic elevation of Pulau Lombok and Tiga Gili at coordinates (x, z)
 * Center of Lombok mainland is approximately around (0, 0)
 * Bounds: x in [-1.5, 1.3], z in [-1.2, 1.0]
 */
export function getLombokElevation(x: number, z: number): number {
  // 1. Tiga Gili archipelago (Northwest off Lombok coast)
  // Gili Trawangan around (-1.15, -0.72)
  const distTrawangan = Math.hypot(x - (-1.15), z - (-0.72));
  if (distTrawangan < 0.12) {
    const norm = Math.max(0, 1 - distTrawangan / 0.12);
    return Math.pow(norm, 1.8) * 0.08;
  }

  // Gili Meno around (-0.98, -0.66)
  const distMeno = Math.hypot(x - (-0.98), z - (-0.66));
  if (distMeno < 0.09) {
    const norm = Math.max(0, 1 - distMeno / 0.09);
    return Math.pow(norm, 1.8) * 0.05;
  }

  // Gili Air around (-0.82, -0.60)
  const distAir = Math.hypot(x - (-0.82), z - (-0.60));
  if (distAir < 0.09) {
    const norm = Math.max(0, 1 - distAir / 0.09);
    return Math.pow(norm, 1.8) * 0.06;
  }

  // 2. Lombok mainland island mask
  // Lombok is roughly a rounded polygon/ellipse with bays
  const dx = x * 1.15;
  const dz = z * 1.05;
  
  // Base elliptical island boundary radius
  const angle = Math.atan2(dz, dx);
  // Shape modulation to create Lombok's real silhouette:
  // - Sekotong peninsula stretching to southwest
  // - Tanjung Ringgit at southeast
  // - Ampenan/Senggigi bay on the west
  // - North coast round bulge
  let radiusBound = 0.88 + 
    0.16 * Math.cos(angle - 0.3) + 
    0.12 * Math.sin(2 * angle + 0.8) - 
    0.08 * Math.cos(3 * angle);

  // Extend Sekotong peninsula (SW, angle around -2.4 rad)
  if (x < -0.6 && z > 0.1 && z < 0.7) {
    radiusBound += 0.35 * Math.exp(-Math.pow(x + 0.9, 2) * 8 - Math.pow(z - 0.45, 2) * 12);
  }

  const distFromCenter = Math.hypot(dx, dz);
  if (distFromCenter > radiusBound) {
    return 0; // Ocean
  }

  // Falloff from coastline into mainland
  const coastDistance = radiusBound - distFromCenter;
  const landFactor = Math.min(1.0, coastDistance * 6.5);

  let elevation = 0.02 * landFactor;

  // 3. Mount Rinjani (North Central - summit around x = 0.15, z = -0.38)
  const drx = x - 0.15;
  const drz = z - (-0.38);
  const distRinjani = Math.hypot(drx, drz);

  if (distRinjani < 0.65) {
    const rinjaniSlope = Math.max(0, 1 - distRinjani / 0.65);
    // Stratovolcano steepness exponent
    let peakHeight = Math.pow(rinjaniSlope, 2.4) * 0.95;

    // Caldera & Danau Segara Anak depression at summit
    const distCaldera = Math.hypot(drx + 0.03, drz - 0.02);
    if (distCaldera < 0.12) {
      const craterDepth = Math.max(0, 1 - distCaldera / 0.12);
      peakHeight -= Math.pow(craterDepth, 1.5) * 0.35;
    }
    // Barujari mini cone inside caldera
    const distBarujari = Math.hypot(drx + 0.01, drz - 0.01);
    if (distBarujari < 0.04) {
      peakHeight += Math.max(0, 1 - distBarujari / 0.04) * 0.12;
    }

    elevation += peakHeight;
  }

  // 4. Sembalun & Senaru mountain foothills (North/East ridges)
  const distNorthHills = Math.hypot(x - 0.35, z - (-0.45));
  if (distNorthHills < 0.4) {
    elevation += Math.pow(Math.max(0, 1 - distNorthHills / 0.4), 2.0) * 0.32;
  }

  // 5. Southern Hills / Pegunungan Selatan (Kuta, Sekotong, Mawun ridges)
  const distSouthHills = Math.hypot(x - 0.05, z - 0.55);
  if (distSouthHills < 0.55) {
    const ridgeNoise = Math.sin(x * 14) * Math.cos(z * 12) * 0.04;
    elevation += (Math.pow(Math.max(0, 1 - distSouthHills / 0.55), 1.8) * 0.22) + ridgeNoise;
  }

  // 6. Western Senggigi coastal hills
  const distWestHills = Math.hypot(x - (-0.45), z - (-0.1));
  if (distWestHills < 0.35) {
    elevation += Math.pow(Math.max(0, 1 - distWestHills / 0.35), 2.0) * 0.18;
  }

  // Central valley (Praya / Mataram plain) stays flatter naturally
  return Math.max(0, elevation);
}

export function LombokTerrain({ onHoverLocation, selectedLocationId }: LombokTerrainProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const oceanRef = useRef<THREE.Mesh>(null);

  // Generate high-resolution displaced terrain geometry
  const { geometry, colors } = useMemo(() => {
    const width = 4.2;
    const height = 4.2;
    const segments = 220; // High detail, optimal 60fps
    const geom = new THREE.PlaneGeometry(width, height, segments, segments);
    geom.rotateX(-Math.PI / 2);

    const pos = geom.attributes.position;
    const colorArray = new Float32Array(pos.count * 3);

    // Color palettes for satellite + natural terrain + contours
    const colorDeepOcean = new THREE.Color("#08141b");
    const colorShallowReef = new THREE.Color("#14b8a6"); // Vibrant turquoise lagoon
    const colorBeach = new THREE.Color("#d4cbaf");      // White/gold sand
    const colorLowland = new THREE.Color("#1d382c");   // Tropical lush green
    const colorHighland = new THREE.Color("#2a4c3a");  // Forested slope
    const colorVolcanic = new THREE.Color("#4a4c52");  // Volcanic basalt & ash
    const colorCraterLake = new THREE.Color("#0284c7"); // Segara Anak deep blue
    const colorContourGlow = new THREE.Color("#5eead4"); // Subtle cyan contour line

    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const pz = pos.getZ(i);

      const elev = getLombokElevation(px, pz);
      pos.setY(i, elev);

      // Vertex color blending based on elevation & geography
      const vertexColor = new THREE.Color();

      if (elev <= 0.001) {
        // Ocean / Coastal reef proximity
        // Check if close to island shoreline for turquoise coral shelf
        const testOffsets = [0.08, 0.15];
        let nearLand = false;
        for (const off of testOffsets) {
          if (
            getLombokElevation(px + off, pz) > 0.001 ||
            getLombokElevation(px - off, pz) > 0.001 ||
            getLombokElevation(px, pz + off) > 0.001 ||
            getLombokElevation(px, pz - off) > 0.001
          ) {
            nearLand = true;
            break;
          }
        }

        if (nearLand) {
          // Turquoise reef lagoon halo (especially prominent around Gili and Lombok shores)
          vertexColor.copy(colorShallowReef).multiplyScalar(0.75);
        } else {
          vertexColor.copy(colorDeepOcean);
        }
      } else if (elev < 0.04) {
        // Coastline & beach sand
        const t = elev / 0.04;
        vertexColor.copy(colorBeach).lerp(colorLowland, t);
      } else if (elev < 0.28) {
        // Lowland plains & coconut groves
        const t = (elev - 0.04) / 0.24;
        vertexColor.copy(colorLowland).lerp(colorHighland, t);
      } else if (elev < 0.65) {
        // Highland forests & Rinjani slopes
        const t = (elev - 0.28) / 0.37;
        vertexColor.copy(colorHighland).lerp(colorVolcanic, t);
      } else {
        // Rinjani high volcanic crater & caldera
        const drx = px - 0.15;
        const drz = pz - (-0.38);
        const distCaldera = Math.hypot(drx + 0.03, drz - 0.02);

        if (distCaldera < 0.11 && elev < 0.8) {
          // Segara Anak crater lake
          vertexColor.copy(colorCraterLake);
        } else {
          // Ash, rock, and summit
          const t = Math.min(1.0, (elev - 0.65) / 0.3);
          vertexColor.copy(colorVolcanic).lerp(new THREE.Color("#6b7280"), t);
        }
      }

      // Topographic contour line effect:
      // Subtle contour rings every interval of elevation
      const contourInterval = 0.12;
      const distToContour = Math.abs((elev % contourInterval) - (contourInterval * 0.5));
      if (elev > 0.05 && distToContour < 0.006) {
        // Blend in a subtle glowing contour line
        vertexColor.lerp(colorContourGlow, 0.45);
      }

      colorArray[i * 3] = vertexColor.r;
      colorArray[i * 3 + 1] = vertexColor.g;
      colorArray[i * 3 + 2] = vertexColor.b;
    }

    geom.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));
    geom.computeVertexNormals();

    return { geometry: geom, colors: colorArray };
  }, []);

  // Ocean wave pulse + reflective shimmer animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (oceanRef.current) {
      oceanRef.current.position.y = -0.005 + Math.sin(t * 0.75) * 0.0025 + Math.cos(t * 0.4) * 0.001;
      const mat = oceanRef.current.material as THREE.MeshStandardMaterial;
      mat.metalness = 0.62 + Math.sin(t * 0.55) * 0.08;
    }
  });

  return (
    <group position={[0, -0.1, 0]}>
      {/* 3D Displaced Terrain Mesh */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial
          vertexColors
          roughness={0.72}
          metalness={0.08}
          flatShading={false}
          bumpScale={0.02}
        />
      </mesh>

      {/* Deep ocean plane with animated reflective sheen */}
      <mesh ref={oceanRef} position={[0, -0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 14, 2, 2]} />
        <meshStandardMaterial
          color="#071420"
          roughness={0.18}
          metalness={0.65}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Coral reef turquoise ring underlay around Tiga Gili archipelago */}
      <mesh position={[-0.98, 0.003, -0.66]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.48, 56]} />
        <meshBasicMaterial
          color="#0d9488"
          transparent
          opacity={0.42}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Wide coastal reef glow around Lombok western coast (Senggigi / Sekotong side) */}
      <mesh position={[-0.52, 0.001, 0.06]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.38, 0.88, 48]} />
        <meshBasicMaterial
          color="#134e4a"
          transparent
          opacity={0.20}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Southern lagoon halo — Kuta Mandalika bay */}
      <mesh position={[0.08, 0.001, 0.88]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.32, 32]} />
        <meshBasicMaterial
          color="#0891b2"
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
