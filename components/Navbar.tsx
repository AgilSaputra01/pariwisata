"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Compass,
  Menu,
  X,
  MessageSquare,
  Car,
  Ship,
  ChevronDown,
  ChevronRight,
  MapPin,
  ShieldCheck,
  HelpCircle,
  Clock,
  Sparkles,
  Zap,
} from "lucide-react";
import { WHATSAPP_OPERATOR_PHONE } from "@/lib/whatsapp";

interface NavbarProps {
  onOpenBooking: () => void;
  lang: "id" | "en";
  setLang: (lang: "id" | "en") => void;
  hideInHero?: boolean;
}

export default function Navbar({ onOpenBooking, lang, setLang, hideInHero = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const serviceItems = [
    {
      title: lang === "id" ? "Rental Mobil & Supir" : "Car Rental & Driver",
      desc: lang === "id" ? "Avanza, Innova Reborn/Zenix, HiAce & Airport Transfer" : "Private driver, airport pickup & island tours",
      href: "/#services",
      icon: Car,
      color: "text-brand-500 bg-brand-50",
    },
    {
      title: lang === "id" ? "Jadwal Tiket Fastboat" : "Fastboat Ferry Tickets",
      desc: lang === "id" ? "Penyeberangan Sanur ➔ Nusa Penida, Lembongan, Gili" : "Official daily crossings with instant seat confirmation",
      href: "/#routes",
      icon: Ship,
      color: "text-teal-600 bg-teal-50",
    },
    {
      title: lang === "id" ? "Destinasi Wisata Populer" : "Popular Destinations",
      desc: lang === "id" ? "Panduan spot hits Nusa Penida, Ubud, Kintamani, Uluwatu" : "Top Bali & island tourist highlights",
      href: "/#destinations",
      icon: MapPin,
      color: "text-amber-500 bg-amber-50",
    },
  ];

  const infoItems = [
    {
      title: lang === "id" ? "Keunggulan Kami" : "Why Choose Us",
      desc: lang === "id" ? "Armada resmi, supir berlisensi & jaminan harga transparan" : "Official fleets, licensed drivers & transparent pricing",
      href: "/#why-choose-us",
      icon: ShieldCheck,
      color: "text-emerald-500 bg-emerald-50",
    },
    {
      title: lang === "id" ? "Cara Pemesanan" : "How It Works",
      desc: lang === "id" ? "Alur booking 1 menit langsung terhubung ke WhatsApp" : "1-minute instant booking directly to WhatsApp",
      href: "/#how-it-works",
      icon: Clock,
      color: "text-indigo-500 bg-indigo-50",
    },
    {
      title: lang === "id" ? "Tanya Jawab (FAQ)" : "Frequently Asked Questions",
      desc: lang === "id" ? "Pertanyaan seputar penjemputan bandara, reschedule, & tiket" : "Answers on flight delays, payment & reschedule",
      href: "/#faq",
      icon: HelpCircle,
      color: "text-purple-500 bg-purple-50",
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        hideInHero
          ? "opacity-0 pointer-events-none translate-y-[-8px]"
          : isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5 opacity-100 translate-y-0"
          : "bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-transparent py-3.5 text-white opacity-100 translate-y-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between" ref={dropdownRef}>
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-brand-500/30 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-lg sm:text-xl font-black tracking-tight ${
                    isScrolled ? "text-slate-900" : "text-white"
                  }`}
                >
                  Bali<span className="text-teal-400">Ride</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  Official Transport
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation with Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* 0. Eksplorasi 3D Dari Langit */}
            <a
              href="#hero"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                isScrolled
                  ? "text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                  : "text-teal-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Compass className="w-4 h-4 text-teal-400" />
              <span>{lang === "id" ? "Eksplorasi 3D" : "3D Explore"}</span>
            </a>

            {/* 1. Layanan & Rute Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === "services" ? null : "services")
                }
                onMouseEnter={() => setActiveDropdown("services")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isScrolled
                    ? activeDropdown === "services"
                      ? "text-brand-600 bg-slate-100"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/70"
                    : activeDropdown === "services"
                    ? "text-white bg-white/15"
                    : "text-slate-200 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{lang === "id" ? "Layanan & Rute" : "Services & Routes"}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeDropdown === "services" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeDropdown === "services" && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-1 w-80 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 p-2 animate-in fade-in zoom-in-95 duration-150 z-50 text-slate-900"
                >
                  {serviceItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.title}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Informasi & Panduan Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "info" ? null : "info")}
                onMouseEnter={() => setActiveDropdown("info")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isScrolled
                    ? activeDropdown === "info"
                      ? "text-brand-600 bg-slate-100"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/70"
                    : activeDropdown === "info"
                    ? "text-white bg-white/15"
                    : "text-slate-200 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{lang === "id" ? "Informasi" : "Information"}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeDropdown === "info" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeDropdown === "info" && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-1 w-80 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 p-2 animate-in fade-in zoom-in-95 duration-150 z-50 text-slate-900"
                >
                  {infoItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.title}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Kontak Link */}
            <Link
              href="/contact"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                isScrolled
                  ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100/70"
                  : "text-slate-200 hover:text-white hover:bg-white/10"
              }`}
            >
              {lang === "id" ? "Kontak" : "Contact"}
            </Link>
          </nav>

          {/* Action Button Group */}
          <div className="hidden sm:flex items-center gap-2 xl:gap-3">
            {/* Language Switcher Pill */}
            <div
              className={`flex items-center p-0.5 rounded-xl border text-xs font-bold ${
                isScrolled
                  ? "bg-slate-100 border-slate-200 text-slate-700"
                  : "bg-white/10 border-white/20 text-white backdrop-blur-xs"
              }`}
            >
              <button
                type="button"
                onClick={() => setLang("id")}
                className={`px-2 py-1 rounded-lg transition-all ${
                  lang === "id"
                    ? "bg-brand-600 text-white shadow-xs"
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                🇮🇩 ID
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded-lg transition-all ${
                  lang === "en"
                    ? "bg-brand-600 text-white shadow-xs"
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                🇬🇧 EN
              </button>
            </div>

            {/* Direct WhatsApp Quick Consult Button */}
            <a
              href={`https://wa.me/${WHATSAPP_OPERATOR_PHONE}?text=${encodeURIComponent(
                "Halo BaliRide! Saya ingin tanya informasi jadwal dan reservasi armada."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all border ${
                isScrolled
                  ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  : "border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/20 backdrop-blur-xs"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/20" />
              <span className="hidden xl:inline">WhatsApp CS</span>
              <span className="xl:hidden">WA CS</span>
            </a>

            {/* Primary CTA: Pesan Cepat */}
            <button
              type="button"
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white shadow-md shadow-brand-500/25 transition-all active:scale-95 group"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>{lang === "id" ? "Pesan Cepat" : "Book Now"}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === "id" ? "en" : "id")}
              className={`px-2 py-1 text-xs font-bold rounded-lg border ${
                isScrolled ? "border-slate-300 text-slate-800" : "border-white/30 text-white"
              }`}
            >
              {lang === "id" ? "🇮🇩 ID" : "🇬🇧 EN"}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl transition-colors ${
                isScrolled ? "text-slate-800 hover:bg-slate-100" : "text-white hover:bg-white/10"
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white text-slate-900 border-b border-slate-200 shadow-2xl px-5 pt-3 pb-6 animate-in slide-in-from-top duration-200">
          <div className="space-y-4">
            {/* Group 1: Layanan */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {lang === "id" ? "Layanan & Rute" : "Services & Routes"}
              </p>
              <div className="space-y-1">
                {serviceItems.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-sm font-semibold text-slate-800 hover:text-brand-600"
                  >
                    <span>{item.title}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>

            {/* Group 2: Informasi */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {lang === "id" ? "Informasi & Bantuan" : "Information & Help"}
              </p>
              <div className="space-y-1">
                {infoItems.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-sm font-semibold text-slate-800 hover:text-brand-600"
                  >
                    <span>{item.title}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </a>
                ))}
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-sm font-semibold text-slate-800 hover:text-brand-600"
                >
                  <span>{lang === "id" ? "Hubungi Kami" : "Contact Us"}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-teal-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{lang === "id" ? "Buka Formulir Pesan Cepat" : "Instant Booking"}</span>
              </button>

              <a
                href={`https://wa.me/${WHATSAPP_OPERATOR_PHONE}?text=${encodeURIComponent(
                  "Halo, saya ingin reservasi transportasi mobil dan tiket fastboat di Bali."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl border border-emerald-500 text-emerald-700 font-semibold text-xs flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Chat Operator WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
