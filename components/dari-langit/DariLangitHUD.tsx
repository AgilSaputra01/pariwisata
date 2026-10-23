"use client";

import React, { useState } from "react";
import { Compass, Volume2, VolumeX, Sparkles, Calendar } from "lucide-react";
import { ambientSound } from "@/lib/ambient-sound";

interface DariLangitHUDProps {
  isExploreMode: boolean;
  onToggleExplore: () => void;
  onScrollToBooking: () => void;
}

export function DariLangitHUD({
  isExploreMode,
  onToggleExplore,
  onScrollToBooking,
}: DariLangitHUDProps) {
  const [soundActive, setSoundActive] = useState(false);

  const handleToggleSound = () => {
    if (ambientSound) {
      const active = ambientSound.toggle();
      setSoundActive(active);
    }
  };

  return (
    <header className="absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-4 px-4 py-4 lg:px-8 lg:py-6 pointer-events-none">
      {/* Brand & Subtitle */}
      <div className="pointer-events-auto">
        <a href="#hero" className="group block focus:outline-none">
          <p className="font-display text-2xl lg:text-3xl leading-none text-[#f3efe6] tracking-tight">
            Dari <span className="italic text-[#14b8a6] group-hover:text-[#2dd4bf] transition-colors">Langit</span>
          </p>
          <p className="mt-1 text-[10px] lg:text-xs tracking-[0.25em] text-[#93a39e] uppercase font-sans font-medium">
            Lombok · Tiga Gili
          </p>
        </a>
      </div>

      {/* Action Buttons HUD */}
      <div className="pointer-events-auto flex items-center gap-2 lg:gap-3">
        {/* Sound Toggle (Requirement 17: Default OFF) */}
        <button
          type="button"
          onClick={handleToggleSound}
          aria-label={soundActive ? "Nonaktifkan suara alam" : "Aktifkan suara alam"}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-sans font-medium transition-all duration-200 border ${
            soundActive
              ? "bg-[#14b8a6]/20 border-[#14b8a6] text-[#2dd4bf] shadow-sm shadow-[#14b8a6]/30"
              : "bg-[#0f222b]/85 border-[#f3efe6]/15 text-[#93a39e] hover:text-[#f3efe6] hover:border-[#14b8a6]/50"
          }`}
        >
          {soundActive ? (
            <Volume2 className="w-3.5 h-3.5 text-[#2dd4bf]" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">
            {soundActive ? "Sound ON" : "Sound OFF"}
          </span>
        </button>

        {/* Jelajah / Explore Mode Toggle (Requirement 3: Smooth drag/orbit) */}
        <button
          type="button"
          onClick={onToggleExplore}
          aria-pressed={isExploreMode}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs lg:text-sm font-sans font-medium transition-all duration-200 border ${
            isExploreMode
              ? "bg-[#14b8a6] text-[#0b171c] border-[#2dd4bf] shadow-md shadow-[#14b8a6]/40"
              : "bg-[#0f222b]/85 border-[#f3efe6]/15 text-[#f3efe6] hover:border-[#14b8a6] hover:bg-[#132c38]"
          }`}
        >
          <Compass className={`w-4 h-4 ${isExploreMode ? "text-[#0b171c] animate-spin" : "text-[#14b8a6]"}`} />
          <span>{isExploreMode ? "Mode Kamera Bebas" : "Jelajah 3D"}</span>
        </button>

        {/* Quick Booking Anchor */}
        <button
          type="button"
          onClick={onScrollToBooking}
          className="hidden md:inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs lg:text-sm font-sans font-medium bg-[#14b8a6]/15 text-[#2dd4bf] border border-[#14b8a6]/40 hover:bg-[#14b8a6] hover:text-[#0b171c] transition-all duration-200"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Booking Tiket</span>
        </button>
      </div>
    </header>
  );
}
