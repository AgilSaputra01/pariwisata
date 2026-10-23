"use client";

import React from "react";
import { ArrowRight, MessageSquare, Zap } from "lucide-react";
import { WHATSAPP_OPERATOR_PHONE } from "@/lib/whatsapp";

interface HeroProps {
  onOpenBooking: (type?: "car" | "fastboat") => void;
  onScrollToSearch: () => void;
  lang: "id" | "en";
}

export default function Hero({ onOpenBooking, onScrollToSearch, lang }: HeroProps) {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[75vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-slate-950">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 scale-105 transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=80')`
        }}
      />
      
      {/* Gradient Vignette & Clean Ambience */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/90" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-6 right-10 w-72 h-72 bg-teal-500/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle, minimalist pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-teal-300 text-xs sm:text-sm font-semibold mb-6 animate-in fade-in duration-500">
          <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-ping" />
          <span>Bali Tourism Transport & Fastboat Hub</span>
        </div>

        {/* Clean, high-impact Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
          Find Your Ride for <br />
          <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            Bali & Beyond
          </span>
        </h1>

        {/* Clean subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8">
          {lang === "id" 
            ? "Layanan sewa mobil terpercaya dengan supir berpengalaman & tiket fastboat resmi ke Nusa Penida, Lembongan, dan Gili. Tanpa antre, tanpa repot registrasi akun."
            : "Car rental, private drivers, and official fastboat crossings to Nusa Penida, Lembongan, and Gili. Instant WhatsApp booking without complex signups."}
        </p>

        {/* Clean, non-excessive action CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={onScrollToSearch}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white font-extrabold text-base shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all group"
          >
            <Zap className="w-5 h-5 fill-white" />
            <span>{lang === "id" ? "Pesan Cepat Sekarang" : "Book Fastboat & Car"}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href={`https://wa.me/${WHATSAPP_OPERATOR_PHONE}?text=${encodeURIComponent(
              "Halo BaliRide! Saya ingin tanya jadwal transportasi dan fastboat di Bali."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 text-sm font-semibold transition-all"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>{lang === "id" ? "Konsultasi WhatsApp CS" : "Consult WhatsApp"}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
