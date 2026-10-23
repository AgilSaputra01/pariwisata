"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface JourneyTerrainProps {
  scrollProgress: number; // 0.0 to 1.0
}

/**
 * Continuous 3D World for BaliRide Journey:
 * - Inland Bali green hills and volcano silhouette (Z from -20 to -6)
 * - Asphalt road curving through hills to coastal harbor (Z from -16 to 0)
 * - Harbor pier & coastal beach shoreline (Z around 0)
 * - Ocean water with animated waves and sun reflection (Z from 0 to 30)
 * - Dramatic Nusa Penida / Gili limestone sea cliffs (Z around 18 to 25)
 */
export function JourneyTerrain({ scrollProgress }: JourneyTerrainProps) {
  const oceanRef = useRef<THREE.Mesh>(null);

  // Inland Bali Landscape Geometry (Hills & Valley)
  const inlandTerrain = useMemo(() => {
    const width = 24;
    const depth = 22;
    const segments = 120;
    const geom = new THREE.PlaneGeometry(width, depth, segments, segments);
    geom.rotateX(-Math.PI / 2);

    const pos = geom.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    const colorGrass = new THREE.Color("#163828");
    const colorHill = new THREE.Color("#224d36");
    const colorVolcano = new THREE.Color("#2a353d");
    const colorSand = new THREE.Color("#d5caa8");
    const colorRock = new THREE.Color("#4a4f54");

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      let y = 0;

      // Inland background mountains (at z < -10)
      if (z < -8) {
        const distMt = Math.hypot(x - 4, z - (-16));
        const volcanoPeak = Math.max(0, 1 - distMt / 9) * 4.5;
        const sideHills = (Math.sin(x * 0.4) * Math.cos(z * 0.3) + 1) * 1.4;
        y = volcanoPeak + sideHills;
      } else if (z < -1) {
        // Rolling roadside hills
        const distFromRoad = Math.abs(x - Math.sin(z * 0.35) * 1.5);
        const hillProfile = Math.sin(distFromRoad * 0.5) * Math.cos(z * 0.4);
        y = Math.max(0, hillProfile * 1.2);
        // Flatten the road corridor
        if (distFromRoad < 1.6) {
          y *= (distFromRoad / 1.6);
        }
      } else {
        // Coastline drop to ocean level
        const distCoast = Math.max(0, 2 - z);
        y = distCoast * 0.15;
      }

      pos.setY(i, y);

      // Color mapping
      const vertexColor = new THREE.Color();
      if (z > -1) {
        vertexColor.copy(colorSand);
      } else if (y > 2.8) {
        vertexColor.copy(colorVolcano);
      } else if (y > 1.2) {
        vertexColor.copy(colorRock).lerp(colorHill, 0.6);
      } else {
        vertexColor.copy(colorGrass).lerp(colorHill, y / 1.2);
      }

      colors[i * 3] = vertexColor.r;
      colors[i * 3 + 1] = vertexColor.g;
      colors[i * 3 + 2] = vertexColor.b;
    }

    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Road Geometry (Curved spline matching road path)
  const { roadGeom, roadMarkingsGeom } = useMemo(() => {
    // Generate curved road points from Z = -16 to Z = 0 (Harbor)
    const curvePoints: THREE.Vector3[] = [];
    for (let z = -16; z <= 0; z += 0.5) {
      const x = Math.sin(z * 0.35) * 1.5;
      // Road elevation is slightly above terrain
      curvePoints.push(new THREE.Vector3(x, 0.04, z));
    }
    const spline = new THREE.CatmullRomCurve3(curvePoints);
    const roadWidth = 1.4;
    const roadSegments = 100;

    const roadGeo = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const markingGeo = new THREE.BufferGeometry();
    const markingVerts: number[] = [];

    for (let i = 0; i <= roadSegments; i++) {
      const t = i / roadSegments;
      const pt = spline.getPoint(t);
      const tangent = spline.getTangent(t);
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      const left = pt.clone().add(normal.clone().multiplyScalar(roadWidth * 0.5));
      const right = pt.clone().add(normal.clone().multiplyScalar(-roadWidth * 0.5));

      vertices.push(left.x, left.y, left.z);
      vertices.push(right.x, right.y, right.z);

      uvs.push(0, t * 10);
      uvs.push(1, t * 10);

      if (i < roadSegments) {
        const b = i * 2;
        indices.push(b, b + 1, b + 2);
        indices.push(b + 1, b + 3, b + 2);
      }

      // Dashed center markings
      if (i % 4 < 2) {
        const centerLeft = pt.clone().add(normal.clone().multiplyScalar(0.03));
        const centerRight = pt.clone().add(normal.clone().multiplyScalar(-0.03));
        markingVerts.push(centerLeft.x, centerLeft.y + 0.005, centerLeft.z);
        markingVerts.push(centerRight.x, centerRight.y + 0.005, centerRight.z);
      }
    }

    roadGeo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    roadGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    roadGeo.setIndex(indices);
    roadGeo.computeVertexNormals();

    markingGeo.setAttribute("position", new THREE.Float32BufferAttribute(markingVerts, 3));

    return { roadGeom: roadGeo, roadMarkingsGeom: markingGeo };
  }, []);

  // Harbor Pier Platform (Wooden / Concrete Dock at Z = 0)
  const pierGeom = useMemo(() => {
    return new THREE.BoxGeometry(2.4, 0.25, 4.0);
  }, []);

  // Island Sea Cliffs (Nusa Penida Kelingking style & Gili Reefs at Z = 18 to 26)
  const islandCliffs = useMemo(() => {
    const width = 16;
    const depth = 14;
    const segments = 80;
    const geom = new THREE.PlaneGeometry(width, depth, segments, segments);
    geom.rotateX(-Math.PI / 2);

    const pos = geom.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    const colorCliff = new THREE.Color("#666964");
    const colorLush = new THREE.Color("#204632");
    const colorReef = new THREE.Color("#14b8a6");

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Kelingking T-Rex cliff spine and coastal cliffs
      const distCliff = Math.hypot(x - 2.5, z - 2);
      let y = 0;
      if (distCliff < 5.5) {
        const falloff = Math.max(0, 1 - distCliff / 5.5);
        y = Math.pow(falloff, 1.5) * 3.8;
        // Sheer drop on the ocean-facing side
        if (x < 1.0) {
          y *= Math.max(0.1, (x + 1.5) / 2.5);
        }
      }

      pos.setY(i, y);

      const vertexColor = new THREE.Color();
      if (y < 0.2) {
        vertexColor.copy(colorReef);
      } else if (y > 2.0) {
        vertexColor.copy(colorLush);
      } else {
        vertexColor.copy(colorCliff).lerp(colorLush, 0.4);
      }

      colors[i * 3] = vertexColor.r;
      colors[i * 3 + 1] = vertexColor.g;
      colors[i * 3 + 2] = vertexColor.b;
    }

    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Ocean wave animation
  useFrame(({ clock }) => {
    if (oceanRef.current) {
      const t = clock.getElapsedTime();
      oceanRef.current.position.y = -0.05 + Math.sin(t * 1.2) * 0.02;
    }
  });

  return (
    <group>
      {/* 1. Inland Bali Terrain (Mountains, Valleys, Road Base) */}
      <mesh geometry={inlandTerrain} position={[0, 0, -10]} receiveShadow castShadow>
        <meshStandardMaterial vertexColors roughness={0.8} metalness={0.1} />
      </mesh>

      {/* 2. Asphalt Road */}
      <mesh geometry={roadGeom} position={[0, 0.01, 0]} receiveShadow>
        <meshStandardMaterial color="#2d3136" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Road Center Markings */}
      <lineSegments geometry={roadMarkingsGeom} position={[0, 0.02, 0]}>
        <lineBasicMaterial color="#fef08a" linewidth={2} />
      </lineSegments>

      {/* 3. Harbor Pier Platform */}
      <mesh geometry={pierGeom} position={[0, 0.05, 0.2]} receiveShadow castShadow>
        <meshStandardMaterial color="#473e35" roughness={0.7} />
      </mesh>

      {/* 4. Ocean Surface (Stretches from harbor to island and beyond) */}
      <mesh ref={oceanRef} position={[0, -0.05, 14]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[36, 32]} />
        <meshStandardMaterial
          color="#0a2a38"
          roughness={0.18}
          metalness={0.82}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Shallow Turquoise Reef Shelf Around Island */}
      <mesh position={[2, -0.02, 21]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6.5, 32]} />
        <meshBasicMaterial color="#14b8a6" transparent opacity={0.3} />
      </mesh>

      {/* 5. Destination Island Cliffs (Nusa Penida / Gili Archipelago) */}
      <mesh geometry={islandCliffs} position={[2, 0, 21]} receiveShadow castShadow>
        <meshStandardMaterial vertexColors roughness={0.75} metalness={0.15} />
      </mesh>
    </group>
  );
}
