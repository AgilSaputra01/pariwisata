"use client";

import React from "react";
import { BookOpen, Compass, ShieldAlert, Luggage, MapPin, ArrowRight, Clock, Anchor } from "lucide-react";

interface TravelGuideProps {
  onOpenBooking: () => void;
  lang: "id" | "en";
}

export default function TravelGuide({ onOpenBooking, lang }: TravelGuideProps) {
  const guides = [
    {
      icon: Clock,
      title: lang === "id" ? "Check-in Pelabuhan Tepat Waktu" : "Port Check-in on Time",
      desc:
        lang === "id"
          ? "Tiba di Dermaga Sanur atau Padang Bai minimal 30–45 menit sebelum kapal berangkat untuk penukaran boarding pass fisik dan boarding yang tertib."
          : "Arrive at Sanur or Padang Bai harbour at least 30–45 minutes before departure for physical boarding pass collection and smooth boarding.",
      tag: lang === "id" ? "Persiapan Berangkat" : "Departure Prep",
    },
    {
      icon: Luggage,
      title: lang === "id" ? "Ketentuan Bagasi Fastboat" : "Fastboat Luggage Policy",
      desc:
        lang === "id"
          ? "Setiap penumpang berhak atas bagasi hingga 25 kg gratis. Koper akan disimpan aman di kompartemen bagasi tertutup oleh awak kapal."
          : "Each passenger is entitled to up to 25 kg free baggage. Suitcases are safely stowed in covered luggage compartments by the crew.",
      tag: lang === "id" ? "Batas Muatan" : "Luggage Allowance",
    },
    {
      icon: Anchor,
      title: lang === "id" ? "Tips Penyeberangan Nyaman" : "Smooth Crossing Tips",
      desc:
        lang === "id"
          ? "Bagi yang sensitif terhadap ombak, pilih kursi di bagian tengah atau belakang kabin dan konsumsi obat anti-mabuk 30 menit sebelum berlayar."
          : "If you are prone to motion sickness, choose seats toward the middle or rear cabin and take motion sickness tablets 30 minutes before sailing.",
      tag: lang === "id" ? "Kenyamanan" : "Comfort Tips",
    },
    {
      icon: MapPin,
      title: lang === "id" ? "Transportasi Lanjutan di Pulau" : "On-Island Island Transfers",
      desc:
        lang === "id"
          ? "Setibanya di Nusa Penida atau Lembongan, pesan mobil sewa lokal atau transfer hotel sebelumnya agar tidak kehabisan kendaraan saat peak season."
          : "Upon arrival in Nusa Penida or Lembongan, pre-book your local driver or hotel transfer so you avoid long waits during peak hours.",
      tag: lang === "id" ? "Destinasi Akhir" : "Island Transport",
    },
  ];

  return (
    <section id="guide" className="py-16 sm:py-20 bg-[#0b171c] text-[#f3efe6] border-t border-[#f3efe6]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/30 text-[#14b8a6] text-xs font-bold uppercase tracking-wider mb-2.5">
              <BookOpen className="w-3.5 h-3.5 text-[#14b8a6]" />
              <span>{lang === "id" ? "Panduan Perjalanan Wisata" : "Essential Travel Guide"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#f3efe6] tracking-tight">
              {lang === "id" ? "Tips Penyeberangan & Transportasi Bali" : "Smart Travel Tips for Bali & Island Crossings"}
            </h2>
            <p className="mt-2 text-[#93a39e] max-w-2xl text-sm sm:text-base">
              {lang === "id"
                ? "Panduan praktis agar liburan Anda dari Bali menuju Nusa Penida, Lembongan, dan Gili berjalan lancar, aman, dan tanpa kendala."
                : "Helpful insights to make your crossings between Bali and surrounding islands effortless, safe, and worry-free."}
            </p>
          </div>

          <button
            onClick={onOpenBooking}
            className="mt-6 md:mt-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#14b8a6]/15 hover:bg-[#14b8a6] text-[#2dd4bf] hover:text-[#0b171c] border border-[#14b8a6]/30 font-bold text-sm transition-all duration-200 self-start md:self-end"
          >
            <span>{lang === "id" ? "Konsultasi Rute Gratis" : "Free Route Consultation"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-[rgba(15,34,43,0.85)] border border-[#f3efe6]/10 hover:border-[#14b8a6]/40 shadow-xl shadow-black/30 backdrop-blur-xs transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#14b8a6]/15 border border-[#14b8a6]/30 flex items-center justify-center text-[#14b8a6] group-hover:bg-[#14b8a6] group-hover:text-[#0b171c] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono tracking-wider uppercase text-[#14b8a6] px-2 py-0.5 rounded-md bg-[#14b8a6]/10">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-bold font-display text-base text-[#f3efe6] mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#93a39e] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#f3efe6]/10 flex items-center justify-between text-xs text-[#14b8a6] font-medium">
                  <span>{lang === "id" ? "Rekomendasi BaliRide" : "BaliRide Tip"}</span>
                  <Compass className="w-3.5 h-3.5 opacity-60" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
