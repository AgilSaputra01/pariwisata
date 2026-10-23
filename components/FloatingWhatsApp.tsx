"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { WHATSAPP_OPERATOR_PHONE } from "@/lib/whatsapp";

export default function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-20 sm:bottom-6 right-5 z-40">
      <a
        href={`https://wa.me/${WHATSAPP_OPERATOR_PHONE}?text=${encodeURIComponent(
          "Halo BaliRide! Saya ingin tanya ketersediaan sewa mobil dan tiket fastboat."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Chat WhatsApp Operator"
      >
        {/* Pulsing ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-60 animate-ping pointer-events-none" />
        
        <MessageSquare className="w-7 h-7 relative z-10 fill-white/20" />

        {/* Hover Tooltip (Desktop) */}
        <span className="hidden md:block absolute right-16 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity shadow-lg">
          Chat WhatsApp CS (24/7 Aktif)
        </span>
      </a>
    </div>
  );
}
