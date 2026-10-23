"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Briefcase, Check, Sparkles, ChevronRight, ExternalLink } from "lucide-react";
import { TransportService } from "@/types";
import { trackViewService } from "@/lib/analytics";
import { useLanguage } from "@/components/LanguageProvider";

interface PopularServicesProps {
  onSelectService: (service: TransportService) => void;
  lang: "id" | "en";
}

export default function PopularServices({ onSelectService, lang }: PopularServicesProps) {
  const { products: translatedServices } = useLanguage();
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  const categories = [
    { id: "ALL", label: lang === "id" ? "Semua Layanan" : "All Services" },
    { id: "AIRPORT_TRANSFER", label: lang === "id" ? "Antar Jemput Bandara" : "Airport Transfer" },
    { id: "PRIVATE_DRIVER", label: lang === "id" ? "Sewa Mobil + Supir" : "Car with Driver" },
    { id: "TOUR_PACKAGE", label: lang === "id" ? "Paket Tur / HiAce Rombongan" : "Tour / HiAce Van" },
    { id: "CAR_RENTAL", label: lang === "id" ? "Lepas Kunci / Premium" : "Self-Drive / Premium" },
  ];

  const filtered = filterCategory === "ALL" 
    ? translatedServices 
    : translatedServices.filter(s => s.category === filterCategory);

  return (
    <section id="services" className="py-20 bg-[#0b171c] border-t border-[#f3efe6]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/30 text-[#14b8a6] text-xs font-bold uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#14b8a6]" />
              <span>{lang === "id" ? "Layanan Mobil Terpercaya" : "Car Rental & Transfers"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#f3efe6] tracking-tight">
              {lang === "id" ? "Armada Transportasi & Rental Mobil Bali" : "Bali Car Rental & Private Transport"}
            </h2>
            <p className="mt-2 text-[#93a39e] max-w-2xl text-sm sm:text-base">
              {lang === "id"
                ? "Pilihan armada terawat mulai dari Avanza, Innova Reborn/Zenix, hingga HiAce. Supir ramah berpengalaman, harga all-inclusive tanpa biaya siluman."
                : "From airport transfers to multi-day private touring with English-speaking drivers. Clean, modern, fully air-conditioned vehicles."}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterCategory === cat.id
                    ? "bg-[#14b8a6] text-[#0b171c] font-black shadow-xs"
                    : "bg-[#0f222b] text-[#93a39e] hover:text-[#f3efe6] hover:bg-[#132534] border border-[#f3efe6]/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((service) => (
            <div
              key={service.id}
              className="bg-[rgba(15,34,43,0.85)] rounded-2xl border border-[#f3efe6]/10 hover:border-[#14b8a6]/50 shadow-xl shadow-black/40 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group backdrop-blur-xs"
            >
              {/* Image banner */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#0b171c]">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b171c] via-transparent to-transparent" />
                
                {/* Badge */}
                {service.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black bg-[#14b8a6] text-[#0b171c] shadow-md">
                    {service.badge}
                  </span>
                )}

                {/* Capacity badge */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
                  <span className="flex items-center gap-1.5 bg-[#0b171c]/80 border border-[#f3efe6]/10 px-2.5 py-1 rounded-lg backdrop-blur-xs text-[#f3efe6]">
                    <Users className="w-3.5 h-3.5 text-[#14b8a6]" />
                    <span>{service.capacity}</span>
                  </span>
                  {service.luggageCapacity && (
                    <span className="flex items-center gap-1.5 bg-[#0b171c]/80 border border-[#f3efe6]/10 px-2.5 py-1 rounded-lg backdrop-blur-xs text-[#f3efe6]">
                      <Briefcase className="w-3.5 h-3.5 text-[#14b8a6]" />
                      <span>{service.luggageCapacity}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold font-display text-[#f3efe6] group-hover:text-[#14b8a6] transition-colors">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#93a39e] line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Pricing & CTA */}
                <div className="mt-6 pt-4 border-t border-[#f3efe6]/10 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#14b8a6] font-bold uppercase tracking-wider bg-[#14b8a6]/10 px-2 py-0.5 rounded-md w-fit border border-[#14b8a6]/30">
                      <Check className="w-3 h-3" /> {lang === "id" ? "Armada Ready" : "Fleet Ready"}
                    </span>
                    <span className="text-sm font-bold text-[#f3efe6]">
                      {lang === "id" ? "Supir Berlisensi" : "Licensed Driver"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/services/${service.id}`}
                      onClick={() => trackViewService(service.id, service.name)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#14b8a6]/40 text-[#14b8a6] hover:bg-[#14b8a6]/10 font-semibold text-xs transition-all"
                    >
                      <span>Detail</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => onSelectService(service)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#14b8a6] hover:bg-[#0d9488] text-[#0b171c] font-black text-xs sm:text-sm shadow-md shadow-[#14b8a6]/20 transition-all active:scale-95"
                    >
                      <span>{lang === "id" ? "Pesan" : "Book"}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
