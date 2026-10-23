"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  X,
  Navigation,
  Ship,
  Car,
  Plane,
  Anchor,
  Compass,
  CheckCircle2,
  Clock,
  Calendar,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Tag,
  ChevronRight,
} from "lucide-react";
import { LocationMarkerData, TransportOption, TransportCategory } from "@/lib/data/lombok-3d-data";
import { buildTransportBookingWhatsAppLink, WHATSAPP_OPERATOR_PHONE } from "@/lib/whatsapp";

interface DestinationDetailPopupProps {
  marker: LocationMarkerData | null;
  onClose: () => void;
  onBookFastboat?: (slug: string) => void;
  onBookCar?: (category: string) => void;
}

export function DestinationDetailPopup({
  marker,
  onClose,
  onBookFastboat,
  onBookCar,
}: DestinationDetailPopupProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [imageError, setImageError] = useState(false);

  // Reset category filter and image error when destination changes
  useEffect(() => {
    setSelectedCategory("ALL");
    setImageError(false);
  }, [marker?.id]);

  // Keyboard accessibility: ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const transportOptions = marker?.transportOptions || [];

  // Available categories in this destination
  const availableCategories = useMemo(() => {
    const cats = new Set<TransportCategory>();
    transportOptions.forEach((opt) => cats.add(opt.category));
    return Array.from(cats);
  }, [transportOptions]);

  // Filtered transport options
  const filteredOptions = useMemo(() => {
    if (selectedCategory === "ALL") return transportOptions;
    return transportOptions.filter((opt) => opt.category === selectedCategory);
  }, [transportOptions, selectedCategory]);

  if (!marker) return null;

  // Icon mapping
  const getCategoryIcon = (category: TransportCategory) => {
    switch (category) {
      case "fastboat":
        return <Ship className="w-4 h-4 text-[#2dd4bf]" />;
      case "public_boat":
        return <Anchor className="w-4 h-4 text-[#60a5fa]" />;
      case "car_rental":
        return <Car className="w-4 h-4 text-[#34d399]" />;
      case "airport_transfer":
        return <Plane className="w-4 h-4 text-[#c084fc]" />;
      case "tour_package":
        return <Compass className="w-4 h-4 text-[#f59e0b]" />;
      default:
        return <Ship className="w-4 h-4 text-[#2dd4bf]" />;
    }
  };

  const getCategoryLabel = (category: TransportCategory) => {
    switch (category) {
      case "fastboat":
        return "Fastboat";
      case "public_boat":
        return "Public Boat";
      case "car_rental":
        return "Rental Mobil";
      case "airport_transfer":
        return "Airport Transfer";
      case "tour_package":
        return "Paket Tour";
      default:
        return category;
    }
  };

  const handleBookingAction = (option: TransportOption) => {
    if (!option.isAvailable) return;

    if (option.whatsappNumber) {
      const waUrl = buildTransportBookingWhatsAppLink({
        destinationName: marker.name,
        transportName: option.name,
        provider: option.provider,
        price: option.price,
        schedule: option.schedule,
        phone: option.whatsappNumber || WHATSAPP_OPERATOR_PHONE,
      });
      window.open(waUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (option.bookingUrl) {
      if (option.bookingUrl.startsWith("#")) {
        const targetId = option.bookingUrl.slice(1);
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
        if (marker.fastboatRouteSlug && onBookFastboat) {
          onBookFastboat(marker.fastboatRouteSlug);
        }
      } else {
        window.open(option.bookingUrl, "_blank", "noopener,noreferrer");
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Detail Destinasi: ${marker.name}`}
      className="absolute z-40 inset-x-3 top-20 sm:top-24 sm:right-16 sm:left-auto w-auto sm:w-[420px] lg:w-[440px] max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-7rem)] flex flex-col rounded-2xl bg-[#09151c]/95 border border-[#14b8a6]/40 shadow-2xl shadow-black/85 backdrop-blur-xl text-[#f3efe6] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 select-text"
    >
      {/* 1. Header with Destination Image & Badges */}
      <div className="relative w-full h-44 sm:h-48 shrink-0 overflow-hidden bg-[#0f2229]">
        {marker.image && !imageError ? (
          <img
            src={marker.image}
            alt={marker.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0e2733] to-[#09151c] text-[#93a39e] p-4 text-center">
            <Compass className="w-10 h-10 text-[#14b8a6]/40 mb-2" />
            <p className="text-xs font-mono uppercase tracking-wider">{marker.name}</p>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09151c] via-[#09151c]/40 to-black/30 pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail destinasi"
          title="Tutup (Esc)"
          className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/20 backdrop-blur-md shadow-lg transition-all duration-200 active:scale-95 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Badges on Image */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 border border-[#14b8a6]/40 backdrop-blur-md text-[10px] font-mono tracking-wider text-[#2dd4bf] uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-pulse" />
            <span>{marker.tag}</span>
          </div>

          {marker.elevation && (
            <span className="px-2 py-0.5 rounded-md bg-black/60 border border-white/15 text-[10px] font-mono text-[#f3efe6]/90 backdrop-blur-md">
              ALT {marker.elevation}
            </span>
          )}
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar">
        {/* 2. Destination Info */}
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#93a39e]">
            <Navigation className="w-3 h-3 text-[#14b8a6] shrink-0" />
            <span className="truncate">{marker.subLocation || "Pulau Lombok, NTB"}</span>
            <span className="text-white/20">·</span>
            <span className="text-[#93a39e]/80 text-[10px] truncate">{marker.coordinates}</span>
          </div>

          <h2 className="mt-1 font-display text-2xl font-bold text-[#f3efe6] tracking-tight leading-snug">
            {marker.name}
          </h2>

          {marker.nativeName && (
            <p className="text-xs text-[#93a39e] font-sans italic">
              {marker.nativeName}
            </p>
          )}

          <p className="mt-2.5 text-xs text-[#f3efe6]/85 leading-relaxed font-light">
            {marker.description}
          </p>

          {/* Highlights */}
          {marker.highlights && marker.highlights.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#f3efe6]/10">
              <p className="text-[10px] font-sans uppercase tracking-widest text-[#93a39e] font-medium mb-1.5">
                Sorotan Destinasi
              </p>
              <div className="flex flex-wrap gap-1.5">
                {marker.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-[#14b8a6]/10 border border-[#14b8a6]/25 text-[#f3efe6]"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-[#14b8a6] shrink-0" />
                    <span>{h}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Transport Options Section */}
        <div className="pt-3 border-t border-[#f3efe6]/10">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <Ship className="w-3.5 h-3.5 text-[#14b8a6]" />
              <h3 className="text-xs font-sans uppercase tracking-wider text-[#f3efe6] font-semibold">
                Pilihan Transportasi & Tiket
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#93a39e]">
              {filteredOptions.length} Opsi
            </span>
          </div>

          {/* Category Filter Pills (if multiple categories available) */}
          {availableCategories.length > 1 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              <button
                type="button"
                onClick={() => setSelectedCategory("ALL")}
                className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
                  selectedCategory === "ALL"
                    ? "bg-[#14b8a6] text-[#09151c] font-semibold shadow-sm shadow-[#14b8a6]/30"
                    : "bg-[#0f222b] text-[#93a39e] border border-[#f3efe6]/10 hover:text-[#f3efe6] hover:border-[#14b8a6]/40"
                }`}
              >
                Semua
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-[#14b8a6] text-[#09151c] font-semibold shadow-sm shadow-[#14b8a6]/30"
                      : "bg-[#0f222b] text-[#93a39e] border border-[#f3efe6]/10 hover:text-[#f3efe6] hover:border-[#14b8a6]/40"
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>
          )}

          {/* Transport Cards List */}
          {filteredOptions.length > 0 ? (
            <div className="space-y-2.5">
              {filteredOptions.map((opt) => (
                <div
                  key={opt.id}
                  className="p-3 rounded-xl bg-[#0e222b]/80 border border-[#f3efe6]/10 hover:border-[#14b8a6]/40 transition-all duration-200 space-y-2"
                >
                  {/* Card Title & Provider */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <div className="p-1.5 rounded-lg bg-[#0b171c] border border-[#f3efe6]/10 shrink-0 mt-0.5">
                        {getCategoryIcon(opt.category)}
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-[#f3efe6] leading-snug">
                          {opt.name}
                        </h4>
                        <p className="text-[10px] text-[#93a39e] mt-0.5">
                          Oleh: <span className="text-[#f3efe6]/80">{opt.provider}</span>
                        </p>
                      </div>
                    </div>

                    {/* Category Tag */}
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[#93a39e] shrink-0 uppercase">
                      {getCategoryLabel(opt.category)}
                    </span>
                  </div>

                  {/* Price, Duration & Schedule Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#f3efe6]/5">
                    {/* Price */}
                    <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5">
                      <span className="text-[10px] text-[#93a39e]">Tarif:</span>
                      <span className="font-semibold text-[#2dd4bf] truncate">
                        {opt.price || "Belum tersedia"}
                      </span>
                    </div>

                    {/* Duration */}
                    {opt.duration && (
                      <div className="flex items-center gap-1 text-[#93a39e]">
                        <Clock className="w-3 h-3 text-[#14b8a6] shrink-0" />
                        <span className="truncate">{opt.duration}</span>
                      </div>
                    )}

                    {/* Schedule */}
                    {opt.schedule && (
                      <div className="col-span-2 flex items-center gap-1 text-[10px] text-[#93a39e]/90">
                        <Calendar className="w-3 h-3 text-[#14b8a6] shrink-0" />
                        <span className="truncate">{opt.schedule}</span>
                      </div>
                    )}
                  </div>

                  {/* Description / Features */}
                  {opt.description && (
                    <p className="text-[10.5px] text-[#93a39e] leading-relaxed font-light">
                      {opt.description}
                    </p>
                  )}

                  {/* Booking Action / Status */}
                  <div className="pt-1">
                    {opt.isAvailable ? (
                      <button
                        type="button"
                        onClick={() => handleBookingAction(opt)}
                        className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium bg-[#14b8a6] text-[#09151c] hover:bg-[#2dd4bf] transition-all duration-200 active:scale-98 shadow-sm font-sans"
                      >
                        {opt.whatsappNumber ? (
                          <>
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Booking via WhatsApp Resmi</span>
                          </>
                        ) : opt.bookingUrl ? (
                          <>
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Pesan Tiket Sekarang</span>
                          </>
                        ) : (
                          <>
                            <span>Pesan Layanan</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="space-y-1">
                        <button
                          type="button"
                          disabled
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[11px] font-medium bg-[#0b171c]/80 text-[#93a39e]/60 border border-white/5 cursor-not-allowed"
                        >
                          <AlertCircle className="w-3 h-3 text-[#93a39e]/60" />
                          <span>Booking Online Belum Tersedia</span>
                        </button>
                        {opt.bookingNote && (
                          <p className="text-[10px] text-amber-400/80 italic text-center px-1">
                            ℹ️ {opt.bookingNote}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#0e222b]/40 border border-[#f3efe6]/10 text-center space-y-1">
              <p className="text-xs text-[#93a39e]">
                Belum ada pilihan transportasi terdaftar untuk kategori ini.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Quick Action */}
      <div className="p-3 px-5 border-t border-[#f3efe6]/10 bg-[#071117] flex items-center justify-between gap-3 text-xs">
        <a
          href={`https://wa.me/${WHATSAPP_OPERATOR_PHONE}?text=${encodeURIComponent(
            `Halo Dari Langit, saya ingin menanyakan informasi transportasi dan perjalanan menuju ${marker.name}.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] text-[#2dd4bf] hover:text-[#5eead4] transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Tanya CS WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={onClose}
          className="text-[11px] text-[#93a39e] hover:text-[#f3efe6] transition-colors"
        >
          Tutup Panel
        </button>
      </div>
    </div>
  );
}
