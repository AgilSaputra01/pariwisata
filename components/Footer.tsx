"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ShieldCheck, Heart, Ship, Car } from "lucide-react";

interface FooterProps {
  lang: "id" | "en";
}

export default function Footer({ lang }: FooterProps) {
  return (
    <footer className="bg-[#060e12] text-[#93a39e] pt-14 pb-24 sm:pb-10 border-t border-[#f3efe6]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b border-[#f3efe6]/10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center shadow-md shadow-[#14b8a6]/20">
                <Ship className="w-5 h-5 text-[#0b171c]" />
              </div>
              <span className="text-xl font-bold text-[#f3efe6] tracking-tight">
                Bali<span className="text-[#14b8a6]">Ride</span>
              </span>
            </div>

            <p className="text-sm leading-relaxed max-w-sm">
              {lang === "id"
                ? "Platform resmi booking transportasi wisata Bali — sewa mobil all-in dengan supir berlisensi & tiket fastboat resmi ke Nusa Penida, Lembongan, dan Gili."
                : "Official tourism transportation platform in Bali. Verified car rentals with drivers and licensed fastboat crossings to Nusa Penida and Gili."}
            </p>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-[#14b8a6]">
                <ShieldCheck className="w-4 h-4" />
                Licensed Operator
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#14b8a6]">
                <Clock className="w-4 h-4" />
                24/7 Support
              </span>
            </div>
          </div>

          {/* Col 2: Car Services */}
          <div>
            <h4 className="text-xs font-bold text-[#f3efe6] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-[#14b8a6]" />
              {lang === "id" ? "Layanan Mobil" : "Car Services"}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><a href="/#services" className="hover:text-[#14b8a6] transition-colors">Airport Transfer Ngurah Rai</a></li>
              <li><a href="/#services" className="hover:text-[#14b8a6] transition-colors">Sewa Mobil + Supir Bali</a></li>
              <li><a href="/#services" className="hover:text-[#14b8a6] transition-colors">Toyota Innova Zenix / Reborn</a></li>
              <li><a href="/#services" className="hover:text-[#14b8a6] transition-colors">HiAce Commuter Rombongan</a></li>
              <li><a href="/#services" className="hover:text-[#14b8a6] transition-colors">Custom Bali Day Tour</a></li>
            </ul>
          </div>

          {/* Col 3: Fastboat Routes */}
          <div>
            <h4 className="text-xs font-bold text-[#f3efe6] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Ship className="w-3.5 h-3.5 text-[#14b8a6]" />
              {lang === "id" ? "Rute Fastboat" : "Fastboat Routes"}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><a href="/#routes" className="hover:text-[#14b8a6] transition-colors">Sanur → Nusa Penida</a></li>
              <li><a href="/#routes" className="hover:text-[#14b8a6] transition-colors">Sanur → Nusa Lembongan</a></li>
              <li><a href="/#routes" className="hover:text-[#14b8a6] transition-colors">Padang Bai → Gili Trawangan</a></li>
              <li><a href="/#routes" className="hover:text-[#14b8a6] transition-colors">Padang Bai → Gili Air</a></li>
              <li><a href="/#routes" className="hover:text-[#14b8a6] transition-colors">Padang Bai → Bangsal Lombok</a></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-xs font-bold text-[#f3efe6] uppercase tracking-wider mb-4">
              {lang === "id" ? "Kontak & Lokasi" : "Contact & Office"}
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#14b8a6] shrink-0 mt-0.5" />
                <span>Jl. Hang Tuah No. 45, Sanur Kaja, Denpasar Selatan, Bali 80227</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+62 877-6145-9651</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>booking@baliride-trans.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#14b8a6] shrink-0" />
                <span>Setiap Hari: 06:00 - 23:00 WITA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4 text-[#93a39e]/70">
          <p>© 2026 BaliRide Transport & Fastboat Hub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/#faq" className="hover:text-[#14b8a6] transition-colors">Terms & Conditions</a>
            <span>•</span>
            <a href="/#faq" className="hover:text-[#14b8a6] transition-colors">Privacy Policy</a>
            <span>•</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-[#14b8a6] fill-[#14b8a6] mx-0.5" /> for Bali Tourism
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
