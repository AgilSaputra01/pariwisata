"use client";

import React from "react";
import { UserCheck, ShieldCheck, Banknote, Clock, Award, CheckCircle2, Sparkles } from "lucide-react";

interface WhyChooseUsProps {
  lang: "id" | "en";
}

export default function WhyChooseUs({ lang }: WhyChooseUsProps) {
  const points = [
    {
      icon: UserCheck,
      color: "text-brand-600 bg-brand-50 border-brand-200",
      title: lang === "id" ? "Booking Cepat Tanpa Akun" : "Instant Booking, No Account",
      desc: lang === "id"
        ? "Tidak perlu registrasi rumit atau password. Cukup isi formulir singkat, sistem mengenerate Booking ID unik dan langsung terhubung ke WhatsApp operator."
        : "No lengthy registration forms or password hassle. Instant Booking ID generated straight to official WhatsApp."
    },
    {
      icon: ShieldCheck,
      color: "text-teal-600 bg-teal-50 border-teal-200",
      title: lang === "id" ? "Armada & Supir Berlisensi Resmi" : "Licensed Fleet & Verified Drivers",
      desc: lang === "id"
        ? "Seluruh supir kami berpengalaman, ramah, dan menguasai rute wisata Bali. Fastboat rekanan bersertifikat keselamatan maritim IMO dan tercover asuransi."
        : "Professional tourism-certified drivers and fastboats meeting international IMO maritime safety regulations."
    },
    {
      icon: Banknote,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      title: lang === "id" ? "Penawaran Terbaik & Sesuai Budget" : "Flexible Quotation & Tailored Budget",
      desc: lang === "id"
        ? "Kami memberikan fleksibilitas estimasi budget dan penawaran terbaik all-in (mobil, bensin, supir, tiket resmi). Tidak ada biaya tersembunyi."
        : "Flexible budgeting and best all-in custom quotations (vehicle, fuel, certified driver, official boat passes). No hidden costs."
    },
    {
      icon: Clock,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
      title: lang === "id" ? "Jaminan Penjemputan Tepat Waktu" : "Punctual Pickup & Delay Monitoring",
      desc: lang === "id"
        ? "Penjemputan bandara dipantau real-time sesuai jadwal flight delay Anda. Armada tiba 15 menit lebih awal di lobi hotel atau titik pertemuan."
        : "Real-time flight tracking for airport pickups. Drivers arrive 15 minutes before scheduled departure time."
    }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-[#0e1d24] border-y border-[#f3efe6]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/30 text-[#14b8a6] text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5 text-[#14b8a6]" />
            <span>{lang === "id" ? "Standar Layanan Unggulan" : "Why Choose BaliRide"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#f3efe6] tracking-tight">
            {lang === "id" ? "Mengapa Ribuan Wisatawan Memilih Kami?" : "Why Thousands of Travelers Trust Us"}
          </h2>
          <p className="mt-2 text-[#93a39e] text-sm sm:text-base">
            {lang === "id"
              ? "Kenyamanan dan kepastian perjalanan Anda di Bali adalah prioritas nomor satu kami."
              : "Delivering reliable, comfortable, and seamless transport experiences across Bali and the Nusa Islands."}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-[rgba(15,34,43,0.85)] rounded-2xl p-6 border border-[#f3efe6]/10 hover:border-[#14b8a6]/50 shadow-xl shadow-black/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between backdrop-blur-xs"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border bg-[#14b8a6]/15 border-[#14b8a6]/30 text-[#14b8a6]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-display text-[#f3efe6] mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#93a39e] leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#f3efe6]/10 flex items-center gap-1.5 text-xs font-semibold text-[#14b8a6]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === "id" ? "Garansi Kepuasan" : "Quality Guaranteed"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
