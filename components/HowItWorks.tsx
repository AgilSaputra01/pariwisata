"use client";

import React from "react";
import { Search, FileText, MessageSquare, Car, ArrowRight, CheckCircle } from "lucide-react";

interface HowItWorksProps {
  onOpenBooking: () => void;
  lang: "id" | "en";
}

export default function HowItWorks({ onOpenBooking, lang }: HowItWorksProps) {
  const steps = [
    {
      num: "01",
      icon: Search,
      title: lang === "id" ? "Pilih Layanan / Rute" : "Select Service or Route",
      desc: lang === "id"
        ? "Tentukan kebutuhan Anda: Rental mobil harian + supir, antar-jemput bandara, atau tiket fastboat ke Nusa Penida/Gili."
        : "Choose between private car hire with driver, airport transfer, or scheduled fastboat tickets."
    },
    {
      num: "02",
      icon: FileText,
      title: lang === "id" ? "Isi Data Singkat" : "Fill Travel Details",
      desc: lang === "id"
        ? "Masukkan tanggal, titik penjemputan (hotel/bandara), jumlah penumpang, dan catatan khusus tanpa harus registrasi akun."
        : "Provide dates, passenger count, and hotel/airport pickup details in a simple 30-second form."
    },
    {
      num: "03",
      icon: MessageSquare,
      title: lang === "id" ? "Generate Booking ID & WhatsApp" : "Instant Booking ID & WhatsApp",
      desc: lang === "id"
        ? "Sistem membuat kode unik (misal: BK-20260921-001) dan membuka WhatsApp dengan pesan rincian otomatis."
        : "Our system issues your unique booking code (e.g. BK-20260921-001) and pre-fills WhatsApp message."
    },
    {
      num: "04",
      icon: Car,
      title: lang === "id" ? "Konfirmasi & Nikmati Perjalanan" : "Instant Confirm & Travel",
      desc: lang === "id"
        ? "Operator mengonfirmasi ketersediaan armada dan boarding pass. Supir/kapal siap melayani Anda tepat waktu!"
        : "Operator confirms your ride & e-ticket in minutes. Enjoy a stress-free holiday in Bali!"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#0b171c] border-b border-[#f3efe6]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/30 text-[#14b8a6] text-xs font-bold uppercase tracking-wider mb-3">
            <span>{lang === "id" ? "Proses Simpel & Cepat" : "Seamless Process"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#f3efe6] tracking-tight">
            {lang === "id" ? "Cara Booking Mudah Dalam 4 Langkah" : "How Booking Works"}
          </h2>
          <p className="mt-2 text-[#93a39e] text-sm sm:text-base">
            {lang === "id"
              ? "Alur pemesanan langsung dari website menuju WhatsApp operator tanpa hambatan."
              : "Zero friction, zero account creation. Directly connected to local customer support."}
          </p>
        </div>

        {/* Steps Grid with connector lines */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative flex flex-col items-center text-center group">
                {/* Step badge */}
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#14b8a6] text-[#0b171c] flex items-center justify-center shadow-lg shadow-[#14b8a6]/25 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-[#0b171c]" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#0b171c] text-[#14b8a6] font-extrabold text-xs flex items-center justify-center border-2 border-[#14b8a6] shadow-xs">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-display text-[#f3efe6] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#93a39e] leading-relaxed max-w-xs">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA trigger */}
        <div className="mt-14 text-center">
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#14b8a6] hover:bg-[#0d9488] text-[#0b171c] font-black text-sm sm:text-base shadow-lg shadow-[#14b8a6]/25 transition-all active:scale-95"
          >
            <span>{lang === "id" ? "Mulai Pesan Sekarang" : "Start Booking Now"}</span>
            <ArrowRight className="w-4 h-4 text-[#0b171c]" />
          </button>
        </div>
      </div>
    </section>
  );
}
