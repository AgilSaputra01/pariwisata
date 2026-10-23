"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Navigation, Sparkles, ArrowUpRight } from "lucide-react";
import { POPULAR_DESTINATIONS } from "@/lib/data/destinations";

interface DestinationsProps {
  onOpenBooking: () => void;
  lang: "id" | "en";
}

export default function Destinations({ onOpenBooking, lang }: DestinationsProps) {
  return (
    <section id="destinations" className="py-16 sm:py-20 bg-[#0b171c] text-[#f3efe6] border-t border-[#f3efe6]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/30 text-[#14b8a6] text-xs font-bold uppercase tracking-wider mb-3">
            <Navigation className="w-3.5 h-3.5 text-[#14b8a6]" />
            <span>{lang === "id" ? "Eksplorasi Destinasi Utama" : "Top Bali & Island Destinations"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-[#f3efe6]">
            {lang === "id" ? "Tujuan Favorit Liburan Anda di Bali" : "Popular Destinations for Your Journey"}
          </h2>
          <p className="mt-3 text-[#93a39e] text-sm sm:text-base">
            {lang === "id"
              ? "Dari keindahan tebing maritim Nusa Penida hingga heningnya sawah terasering Ubud. Kami siap mengantar perjalanan Anda dengan aman dan nyaman."
              : "Discover picturesque islands and cultural highlights with reliable transfers and fastboat schedules."}
          </p>
        </div>

        {/* Destination Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_DESTINATIONS.map((dest, idx) => (
            <div
              key={dest.id}
              className={`group relative rounded-2xl overflow-hidden border border-[#f3efe6]/10 bg-[rgba(15,34,43,0.85)] hover:border-[#14b8a6]/50 shadow-xl shadow-black/40 backdrop-blur-xs transition-all duration-300 flex flex-col justify-between ${
                idx === 0 ? "lg:col-span-2 lg:flex-row" : ""
              }`}
            >
              {/* Image */}
              <div
                className={`relative overflow-hidden ${
                  idx === 0 ? "lg:w-1/2 min-h-[260px] lg:min-h-full" : "h-56"
                }`}
              >
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b171c]/90 via-[#0b171c]/30 to-transparent" />
                
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#0b171c]/80 backdrop-blur-md text-[#14b8a6] border border-[#f3efe6]/10 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#14b8a6]" />
                  {dest.travelTime}
                </span>
              </div>

              {/* Text Info */}
              <div className={`p-6 flex flex-col justify-between ${idx === 0 ? "lg:w-1/2" : ""}`}>
                <div>
                  <h3 className="text-xl font-bold font-display text-[#f3efe6] group-hover:text-[#14b8a6] transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-[#14b8a6] font-semibold mb-2">{dest.subtitle}</p>
                  <p className="text-xs sm:text-sm text-[#93a39e] leading-relaxed mb-4">
                    {dest.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 mb-5">
                    <span className="text-[11px] font-bold text-[#93a39e] uppercase tracking-wider block">
                      Spot Ikonik:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {dest.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#0b171c] text-[#f3efe6] border border-[#f3efe6]/15"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f3efe6]/10 flex items-center justify-between">
                  <span className="text-xs text-[#93a39e]">
                    Tersedia: <strong className="text-[#f3efe6]">{dest.transportTypes.join(" & ")}</strong>
                  </span>
                  <button
                    onClick={onOpenBooking}
                    className="p-2 rounded-xl bg-[#14b8a6]/15 hover:bg-[#14b8a6] text-[#14b8a6] hover:text-[#0b171c] transition-colors"
                    aria-label="Pesan ke destinasi ini"
                  >
                    <ArrowUpRight className="w-4 h-4" />
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
