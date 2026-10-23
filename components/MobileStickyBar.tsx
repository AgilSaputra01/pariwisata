"use client";

import React from "react";
import { MessageSquare, Calendar, Zap } from "lucide-react";
import { WHATSAPP_OPERATOR_PHONE } from "@/lib/whatsapp";

interface MobileStickyBarProps {
  onOpenBooking: () => void;
  lang: "id" | "en";
}

export default function MobileStickyBar({ onOpenBooking, lang }: MobileStickyBarProps) {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b171c]/95 backdrop-blur-md border-t border-[#f3efe6]/15 px-4 py-2.5 shadow-2xl flex items-center gap-2.5">
      <a
        href={`https://wa.me/${WHATSAPP_OPERATOR_PHONE}?text=${encodeURIComponent(
          "Halo BaliRide! Saya ingin menanyakan jadwal dan ketersediaan layanan pariwisata."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 py-2.5 px-3 rounded-xl bg-[#0f222b] text-[#14b8a6] border border-[#14b8a6]/30 font-bold text-xs flex items-center justify-center gap-1.5 active:bg-[#132534] transition-colors"
      >
        <MessageSquare className="w-4 h-4 text-[#14b8a6] shrink-0" />
        <span>WhatsApp</span>
      </a>

      <button
        onClick={onOpenBooking}
        className="flex-[2] py-2.5 px-4 rounded-xl bg-[#14b8a6] text-[#0b171c] font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-[#14b8a6]/25 active:scale-98 transition-all"
      >
        <Zap className="w-4 h-4 fill-[#0b171c]" />
        <span>{lang === "id" ? "Pesan Tiket & Mobil" : "Instant Booking"}</span>
      </button>
    </div>
  );
}
