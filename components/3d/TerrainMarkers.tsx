"use client";

import React, { useState } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { LOMBOK_MARKERS, LocationMarkerData } from "@/lib/data/lombok-3d-data";

interface TerrainMarkersProps {
  onSelectMarker: (marker: LocationMarkerData) => void;
  selectedMarkerId?: string | null;
}

export function TerrainMarkers({ onSelectMarker, selectedMarkerId }: TerrainMarkersProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <group position={[0, -0.1, 0]}>
      {LOMBOK_MARKERS.map((marker) => {
        const isSelected = selectedMarkerId === marker.id;
        const isHovered = hoveredId === marker.id;
        const [x, y, z] = marker.position;
        const stemHeight = marker.category === "volcano" ? 0.35 : 0.28;

        return (
          <group key={marker.id} position={[x, y, z]}>
            {/* Ground pulse ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
              <ringGeometry args={[0.015, isSelected ? 0.045 : isHovered ? 0.038 : 0.028, 24]} />
              <meshBasicMaterial
                color={isSelected ? "#2dd4bf" : isHovered ? "#5eead4" : "#14b8a6"}
                transparent
                opacity={isSelected ? 0.9 : isHovered ? 0.8 : 0.45}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Glowing core dot */}
            <mesh position={[0, 0.01, 0]}>
              <sphereGeometry args={[0.012, 12, 12]} />
              <meshBasicMaterial color={isSelected ? "#ffffff" : "#2dd4bf"} />
            </mesh>

            {/* Vertical stem line connecting terrain to floating beacon */}
            <line>
              <bufferGeometry
                attach="geometry"
                onUpdate={(self) => {
                  const pts = new Float32Array([0, 0, 0, 0, stemHeight, 0]);
                  self.setAttribute("position", new THREE.BufferAttribute(pts, 3));
                }}
              />
              <lineBasicMaterial
                color={isSelected ? "#2dd4bf" : isHovered ? "#99f6e4" : "#14b8a6"}
                transparent
                opacity={isSelected ? 0.85 : 0.45}
                linewidth={1}
              />
            </line>

            {/* Floating Beacon Head */}
            <mesh
              position={[0, stemHeight, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectMarker(marker);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredId(marker.id);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredId(null);
                document.body.style.cursor = "auto";
              }}
            >
              <octahedronGeometry args={[isSelected ? 0.024 : 0.018]} />
              <meshStandardMaterial
                color={isSelected ? "#5eead4" : isHovered ? "#2dd4bf" : "#0d9488"}
                emissive={isSelected ? "#2dd4bf" : "#0f766e"}
                emissiveIntensity={isSelected ? 0.9 : 0.5}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>

            {/* Editorial Minimal HTML Marker Label */}
            <Html
              position={[0, stemHeight + 0.04, 0]}
              center
              distanceFactor={4.8}
              zIndexRange={[10, 20]}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMarker(marker);
                }}
                onMouseEnter={() => setHoveredId(marker.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`group cursor-pointer select-none transition-all duration-300 ${
                  isSelected ? "scale-105" : isHovered ? "scale-105" : "scale-95 hover:scale-100"
                }`}
              >
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-sans tracking-wide transition-all backdrop-blur-md shadow-lg ${
                    isSelected
                      ? "bg-teal-500 text-slate-950 font-semibold shadow-teal-500/30 border border-teal-300"
                      : isHovered
                      ? "bg-slate-900/95 text-teal-300 border border-teal-400/60 shadow-slate-950/80"
                      : "bg-slate-950/80 text-neutral-200 border border-neutral-700/60 hover:border-teal-400/50"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected
                        ? "bg-slate-950 animate-ping"
                        : isHovered
                        ? "bg-teal-400 animate-pulse"
                        : "bg-teal-500/70"
                    }`}
                  />
                  <span className="whitespace-nowrap font-medium text-[11px]">
                    {marker.name}
                  </span>
                  {marker.elevation && (
                    <span
                      className={`text-[9px] font-mono px-1 rounded ${
                        isSelected
                          ? "bg-slate-950/20 text-slate-900"
                          : "bg-neutral-800/80 text-neutral-400"
                      }`}
                    >
                      {marker.elevation}
                    </span>
                  )}
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
