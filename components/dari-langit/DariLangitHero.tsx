"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { DariLangitHUD } from "./DariLangitHUD";
import { StoryCard } from "./StoryCard";
import { LocationDetailModal } from "./LocationDetailModal";
import { STORY_SECTIONS, LOMBOK_MARKERS, LocationMarkerData } from "@/lib/data/lombok-3d-data";

// Dynamically import 3D Scene to avoid SSR issues
const Lombok3DScene = dynamic(
  () => import("../3d/Lombok3DScene").then((mod) => mod.Lombok3DScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#0b171c] text-[#f3efe6]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#14b8a6]/20 border-t-[#14b8a6] animate-spin" />
          <p className="font-display text-lg tracking-wide text-[#f3efe6]">Dari Langit</p>
          <p className="text-xs font-mono text-[#93a39e] tracking-widest uppercase">
            Memetakan Topografi Lombok…
          </p>
        </div>
      </div>
    ),
  }
);

export function DariLangitHero() {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [isExploreMode, setIsExploreMode] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<LocationMarkerData | null>(null);
  const [isCardVisible, setIsCardVisible] = useState(true);

  const currentSection = STORY_SECTIONS[sectionIndex] || STORY_SECTIONS[0];

  // Handle nav pill selection (Lombok, Trawangan, Meno, Air)
  const handleSelectNav = (key: "lombok" | "trawangan" | "meno" | "air") => {
    setIsExploreMode(false);
    if (key === "lombok") {
      setSectionIndex(0);
      setSelectedMarker(null);
    } else if (key === "trawangan") {
      setSectionIndex(3);
      const m = LOMBOK_MARKERS.find((x) => x.id === "trawangan");
      setSelectedMarker(m || null);
    } else if (key === "meno") {
      setSectionIndex(3);
      const m = LOMBOK_MARKERS.find((x) => x.id === "meno");
      setSelectedMarker(m || null);
    } else if (key === "air") {
      setSectionIndex(3);
      const m = LOMBOK_MARKERS.find((x) => x.id === "air");
      setSelectedMarker(m || null);
    }
  };

  // Handle marker selection in 3D scene
  const handleSelectMarker = (marker: LocationMarkerData) => {
    setSelectedMarker(marker);
    // Find matching story section if applicable
    if (marker.id === "rinjani") {
      setSectionIndex(1);
    } else if (marker.id === "mataram") {
      setSectionIndex(2);
    } else if (["trawangan", "meno", "air"].includes(marker.id)) {
      setSectionIndex(3);
    }
  };

  // Open transport & booking popup for current context
  const handleOpenBooking = () => {
    if (selectedMarker) return;
    if (currentSection.id === "section-rinjani") {
      setSelectedMarker(LOMBOK_MARKERS.find((x) => x.id === "rinjani") || null);
    } else if (currentSection.id === "section-mataram") {
      setSelectedMarker(LOMBOK_MARKERS.find((x) => x.id === "mataram") || null);
    } else {
      setSelectedMarker(LOMBOK_MARKERS.find((x) => x.id === "trawangan") || LOMBOK_MARKERS[0]);
    }
  };

  return (
    <section id="hero" className="relative w-full h-screen min-h-[640px] bg-[#0b171c] overflow-hidden">
      {/* 3D Scene Viewport */}
      <div className="absolute inset-0 z-0">
        <Lombok3DScene
          targetPosition={currentSection.cameraPosition}
          targetLookAt={currentSection.cameraTarget}
          isExploreMode={isExploreMode}
          selectedMarkerId={selectedMarker?.id}
          sectionId={currentSection.id}
          onSelectMarker={handleSelectMarker}
        />
      </div>

      {/* Cinematic Vignette Overlay */}
      <div className="vignette-cinematic pointer-events-none absolute inset-0 z-10" />

      {/* Top HUD */}
      <DariLangitHUD
        isExploreMode={isExploreMode}
        onToggleExplore={() => setIsExploreMode((prev) => !prev)}
        onScrollToBooking={handleOpenBooking}
      />

      {/* Story Card Bottom Overlay + Toggle */}
      <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-4 lg:px-8 lg:pb-8 flex justify-start items-end gap-3">
        {/* Toggle button — always visible, sits beside or replaces card */}
        <button
          type="button"
          onClick={() => setIsCardVisible((v) => !v)}
          aria-label={isCardVisible ? "Sembunyikan panel info" : "Tampilkan panel info"}
          title={isCardVisible ? "Sembunyikan panel" : "Tampilkan panel"}
          className="flex-shrink-0 self-end mb-0.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-sans font-medium bg-[#0f222b]/90 border border-[#f3efe6]/15 text-[#93a39e] hover:text-[#f3efe6] hover:border-[#14b8a6]/50 transition-all duration-200 backdrop-blur-md shadow-lg"
        >
          {isCardVisible ? (
            <PanelLeftClose className="w-3.5 h-3.5" />
          ) : (
            <PanelLeftOpen className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">{isCardVisible ? "Sembunyikan" : "Tampilkan"}</span>
        </button>

        {/* Card — animates in/out */}
        <div
          className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
            isCardVisible
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <StoryCard
            currentSection={currentSection}
            onScrollToBooking={handleOpenBooking}
          />
        </div>
      </div>


      {/* Satellite Coordinate Ticker — bottom right corner */}
      <div className="absolute bottom-4 right-6 z-20 pointer-events-none hidden sm:block">
        <p className="text-[9px] font-mono text-[#93a39e]/70 tracking-[0.15em] text-right leading-relaxed">
          <span className="text-[#14b8a6]/60">◉</span>{" "}
          {currentSection.id === "section-tiga-gili"
            ? "8°35'01\" S  116°03'44\" E"
            : currentSection.id === "section-rinjani"
            ? "8°24'41\" S  116°27'26\" E"
            : currentSection.id === "section-mataram"
            ? "8°34'37\" S  116°05'56\" E"
            : "8°39'36\" S  116°19'22\" E"}
          <br />
          <span className="text-[10px]">ALT {currentSection.id === "section-tiga-gili" ? "42 m" : currentSection.id === "section-rinjani" ? "3.726 m" : "18 m"}</span>
          <span className="ml-2 text-[10px]">· LOMBOK / NTB</span>
        </p>
      </div>

      {/* Location Details Drawer (when marker clicked) */}
      <LocationDetailModal
        marker={selectedMarker}
        onClose={() => setSelectedMarker(null)}
      />
    </section>
  );
}
