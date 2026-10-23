"use client";

import React from "react";

interface Milestone {
  label: string;
  short: string;
  progress: number;
}

const MILESTONES: Milestone[] = [
  { label: "Mulai Perjalanan", short: "01 Bali", progress: 0.05 },
  { label: "Rental Mobil", short: "02 Mobil", progress: 0.25 },
  { label: "Pesisir Pantai", short: "03 Pantai", progress: 0.45 },
  { label: "Pelabuhan", short: "04 Pelabuhan", progress: 0.60 },
  { label: "Fastboat", short: "05 Fastboat", progress: 0.72 },
  { label: "Nusa Penida & Gili", short: "06 Pulau", progress: 0.86 },
  { label: "Booking", short: "07 Booking", progress: 0.96 },
];

interface JourneyProgressBarProps {
  scrollProgress: number; // 0.0 to 1.0
  onJumpToProgress: (progress: number) => void;
}

export function JourneyProgressBar({
  scrollProgress,
  onJumpToProgress,
}: JourneyProgressBarProps) {
  return (
    <aside
      aria-label="Progres Perjalanan 3D BaliRide"
      className="fixed right-4 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-end gap-2.5 pointer-events-auto select-none"
    >
      <div className="bg-slate-950/75 backdrop-blur-md border border-slate-700/60 rounded-2xl py-3 px-2 flex flex-col items-center gap-3 shadow-xl">
        {MILESTONES.map((m, idx) => {
          const isActive = Math.abs(scrollProgress - m.progress) < 0.09;
          const isPassed = scrollProgress > m.progress;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onJumpToProgress(m.progress)}
              className="group relative flex items-center justify-end"
              aria-label={m.label}
            >
              {/* Tooltip on hover */}
              <span className="absolute right-6 px-2.5 py-1 rounded-md text-[11px] font-sans font-medium whitespace-nowrap bg-slate-900 text-slate-100 border border-slate-700/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                {m.label}
              </span>

              {/* Indicator Dot */}
              <div
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? "w-2.5 h-6 bg-teal-400 ring-2 ring-teal-400/40"
                    : isPassed
                    ? "w-2 h-2 bg-teal-500/70"
                    : "w-2 h-2 bg-slate-600 hover:bg-slate-400"
                }`}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
