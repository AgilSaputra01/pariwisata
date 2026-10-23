"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Ship, Clock, Calendar, CheckCircle2, ChevronRight, Anchor, ExternalLink } from "lucide-react";
import { POPULAR_ROUTES } from "@/lib/data/routes";
import { FastboatRoute } from "@/types";
import { trackViewRoute } from "@/lib/analytics";

interface PopularRoutesProps {
  onSelectRoute: (route: FastboatRoute) => void;
  lang: "id" | "en";
}

export default function PopularRoutes({ onSelectRoute, lang }: PopularRoutesProps) {
  const [selectedDestinationFilter, setSelectedDestinationFilter] = useState<string>("ALL");

  const filterOptions = [
    { id: "ALL", label: lang === "id" ? "Semua Rute" : "All Routes" },
    { id: "Nusa Penida", label: "Nusa Penida" },
    { id: "Nusa Lembongan", label: "Nusa Lembongan" },
    { id: "Gili Trawangan", label: "Gili Trawangan & Lombok" },
  ];

  const filteredRoutes = selectedDestinationFilter === "ALL"
    ? POPULAR_ROUTES
    : POPULAR_ROUTES.filter(r => r.destinationName.includes(selectedDestinationFilter) || r.arrivalPort.includes(selectedDestinationFilter));

  return (
    <section id="routes" className="py-16 sm:py-20 bg-[#0b171c] border-t border-[#f3efe6]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/30 text-[#14b8a6] text-xs font-bold uppercase tracking-wider mb-2.5">
              <Anchor className="w-3.5 h-3.5 text-[#14b8a6]" />
              <span>{lang === "id" ? "Jadwal Kapal Cepat Resmi" : "Fastboat Schedule & Booking"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#f3efe6] tracking-tight">
              {lang === "id" ? "Rute & Tiket Fastboat Bali Penyeberangan" : "Popular Fastboat Routes & Crossings"}
            </h2>
            <p className="mt-2 text-[#93a39e] max-w-2xl text-sm sm:text-base">
              {lang === "id"
                ? "Dermaga Sanur Baru & Padang Bai menuju Nusa Penida, Lembongan, dan Gili Trawangan. Operator bersertifikat keselamatan maritim IMO dan asuransi penumpang."
                : "Fast, safe crossings from Sanur and Padang Bai harbour to Nusa Penida, Lembongan, and Gili Islands. Direct WhatsApp ticket delivery."}
            </p>
          </div>

          {/* Filters */}
          <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedDestinationFilter(opt.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedDestinationFilter === opt.id
                    ? "bg-[#14b8a6] text-[#0b171c] font-black shadow-xs"
                    : "bg-[#0b171c] text-[#93a39e] hover:text-[#f3efe6] hover:bg-[#132534] border border-[#f3efe6]/10"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {filteredRoutes.map((route) => (
            <div
              key={route.id}
              className="bg-[rgba(15,34,43,0.85)] rounded-2xl border border-[#f3efe6]/10 p-5 sm:p-6 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group hover:border-[#14b8a6]/50 shadow-xl shadow-black/40 backdrop-blur-xs"
            >
              <div>
                {/* Header row: Ports & Duration */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#f3efe6]/10">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#14b8a6] mb-1">
                      <Ship className="w-4 h-4 text-[#14b8a6]" />
                      <span>{route.destinationName}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-[#f3efe6] leading-snug">
                      {route.departurePort.split("(")[0]}
                      <span className="text-[#14b8a6] mx-2">➔</span>
                      {route.arrivalPort.split("(")[0]}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0b171c] border border-[#f3efe6]/10 text-[#93a39e] text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#14b8a6]" />
                      {route.durationMinutes} menit
                    </span>
                  </div>
                </div>

                {/* Schedules Available */}
                <div className="mt-4">
                  <span className="text-xs font-semibold text-[#93a39e] block mb-2">
                    {lang === "id" ? "Pilihan Jam Keberangkatan:" : "Available Departure Times:"}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {route.schedules.map((time) => (
                      <span
                        key={time}
                        className="px-2.5 py-1 rounded-md bg-[#0b171c] border border-[#f3efe6]/15 text-[#f3efe6] text-xs font-bold shadow-2xs group-hover:border-[#14b8a6]/30"
                      >
                        {time} WITA
                      </span>
                    ))}
                  </div>
                </div>

                {/* Operators and inclusions */}
                <div className="mt-4 pt-3 border-t border-dashed border-[#f3efe6]/10">
                  <div className="text-xs text-[#93a39e] mb-2">
                    <strong className="text-[#f3efe6]">Operator Rekanan: </strong>
                    {route.operators.join(" • ")}
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-[#93a39e] font-medium">
                    {route.included.map((inc, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#14b8a6]" />
                        {inc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="mt-6 pt-4 border-t border-[#f3efe6]/10 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#14b8a6] font-bold uppercase tracking-wider bg-[#14b8a6]/10 px-2 py-0.5 rounded-md w-fit border border-[#14b8a6]/30">
                    <Ship className="w-3 h-3" /> {lang === "id" ? "Jadwal Reguler" : "Regular Crossing"}
                  </span>
                  <span className="text-sm font-bold text-[#f3efe6]">
                    {route.schedules.length} {lang === "id" ? "Jadwal / Hari" : "Trips / Day"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/routes/${route.id}`}
                    onClick={() => trackViewRoute(route.id, `${route.departurePort} → ${route.destinationName}`)}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#14b8a6]/40 text-[#14b8a6] hover:bg-[#14b8a6]/10 font-semibold text-xs transition-all"
                  >
                    <span>Detail</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => onSelectRoute(route)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#14b8a6] hover:bg-[#0d9488] text-[#0b171c] font-black text-sm shadow-md shadow-[#14b8a6]/20 transition-all active:scale-95"
                  >
                    <span>{lang === "id" ? "Pilih Rute" : "Select"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
