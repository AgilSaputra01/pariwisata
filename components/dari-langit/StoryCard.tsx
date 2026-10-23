"use client";

import React from "react";
import { ArrowDown, Compass, Ship, Car } from "lucide-react";
import { StorySectionData } from "@/lib/data/lombok-3d-data";

interface StoryCardProps {
  currentSection: StorySectionData;
  onScrollToBooking: () => void;
}

export function StoryCard({
  currentSection,
  onScrollToBooking,
}: StoryCardProps) {
  return (
    <article className="story-card pointer-events-auto w-full max-w-xl p-5 lg:p-6 transition-all duration-500 ease-out shadow-2xl">
      {/* Top Meta Bar */}
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[11px] lg:text-xs tracking-[0.2em] text-[#14b8a6] uppercase font-sans font-semibold">
          {currentSection.subheading}
        </p>
        <p className="text-xs tabular-nums text-[#93a39e] font-mono">
          {currentSection.stepNumber} / {currentSection.totalSteps}
        </p>
      </div>

      {/* Headline */}
      <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl leading-none text-[#f3efe6] tracking-tight">
        {currentSection.title}
      </h1>

      {/* Narrative Description */}
      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#f3efe6]/90 font-sans font-light">
        {currentSection.description}
      </p>

      {/* Geographic / Cultural Stats Grid */}
      <dl className="mt-4 grid grid-cols-3 gap-2 sm:gap-3 border-t border-[#f3efe6]/15 pt-3.5">
        {currentSection.stats.map((stat, idx) => (
          <div key={idx}>
            <dt className="text-[10px] sm:text-xs text-[#93a39e] font-sans font-medium uppercase tracking-wider">
              {stat.label}
            </dt>
            <dd className="mt-0.5 text-xs sm:text-sm text-[#f3efe6] font-medium font-sans truncate">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>



      {/* Footer Meta & Action */}
      <div className="mt-4 pt-3 border-t border-[#f3efe6]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-[11px] text-[#93a39e]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Citra Satelit Aktif · Relief Mapterhorn</span>
        </div>

        <button
          type="button"
          onClick={onScrollToBooking}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-medium bg-[#14b8a6] hover:bg-[#2dd4bf] text-[#0b171c] font-semibold transition-all duration-200 shadow-sm shadow-[#14b8a6]/20 active:scale-95"
        >
          <Ship className="w-3.5 h-3.5" />
          <span>Lihat Transport &amp; Booking</span>
        </button>
      </div>
    </article>
  );
}

