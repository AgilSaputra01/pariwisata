"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Users,
  Briefcase,
  CheckCircle2,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import productsData from "@/lib/data/products.json";
import { formatRupiah } from "@/lib/whatsapp";
import { TransportService } from "@/types";

interface LenticularCarouselProps {
  onSelectService: (service: any) => void;
  lang?: "id" | "en";
}

export default function LenticularCarousel({
  onSelectService,
  lang = "id",
}: LenticularCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const products = productsData.map((p) => {
    const translation =
      p.translations[lang] || p.translations["id"] || p.translations["en"];
    return {
      id: p.id,
      category: p.category,
      priceStartingFrom: p.priceStartingFrom,
      popular: p.popular,
      badge: p.badge,
      image: p.image,
      name: translation.name,
      description: translation.description,
      capacity: translation.capacity,
      luggageCapacity: translation.luggageCapacity,
      included: translation.included,
    };
  });

  const total = products.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const toggleFlip = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle Touch Swipe for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 50) {
      nextSlide();
    } else if (diffX < -50) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  // Lenticular mouse tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <section className="relative py-16 sm:py-20 bg-[#0b171c] text-[#f3efe6] overflow-hidden border-t border-[#f3efe6]/10">
      {/* 3D Lenticular Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#14b8a6]/15 via-teal-500/10 to-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14b8a6]/10 backdrop-blur-md border border-[#14b8a6]/30 text-[#14b8a6] text-xs font-bold mb-4 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-[#14b8a6]" />
            <span>
              {lang === "id"
                ? "Highlight Armada & Layanan Wisata"
                : "Featured Transport & Rental Fleet"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-[#f3efe6] mb-3">
            {lang === "id" ? (
              <>
                Pilihan Terbaik{" "}
                <span className="text-[#14b8a6]">
                  Armada Liburan Bali
                </span>
              </>
            ) : (
              <>
                Curated Fleet for{" "}
                <span className="text-[#14b8a6]">
                  Your Bali Vacation
                </span>
              </>
            )}
          </h2>

          <p className="text-[#93a39e] text-sm sm:text-base font-normal max-w-xl mx-auto leading-relaxed">
            {lang === "id"
              ? "Klik kartu untuk membalik (turn over) dan melihat rincian fasilitas lengkap yang sudah termasuk dalam paket."
              : "Click any card to turn it over and explore all inclusive perks & features."}
          </p>
        </div>

        {/* Lenticular 3D Carousel Stage */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setMousePos({ x: 0, y: 0 });
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative min-h-[530px] sm:min-h-[560px] flex items-center justify-center select-none"
          style={{ perspective: "1400px" }}
        >
          {products.map((product, idx) => {
            // Calculate circular offset
            let offset = idx - currentIndex;
            if (offset < -1) offset += total;
            if (offset > total - 2) offset -= total;

            const isCenter = offset === 0;
            const isLeft = offset === -1 || (currentIndex === 0 && idx === total - 1);
            const isRight = offset === 1 || (currentIndex === total - 1 && idx === 0);
            const isVisible = isCenter || isLeft || isRight;

            if (!isVisible) return null;

            const isFlipped = !!flippedCards[product.id];

            // 3D transforms for Lenticular depth
            let translateX = 0;
            let translateZ = 0;
            let rotateY = 0;
            let scale = 0.85;
            let opacity = 0.55;
            let zIndex = 10;

            if (isCenter) {
              translateX = mousePos.x * 25;
              translateZ = 60 + Math.abs(mousePos.y) * 15;
              rotateY = mousePos.x * 12;
              scale = 1;
              opacity = 1;
              zIndex = 30;
            } else if (isLeft) {
              translateX = -280;
              translateZ = -120;
              rotateY = 32;
              scale = 0.85;
              opacity = 0.5;
              zIndex = 20;
            } else if (isRight) {
              translateX = 280;
              translateZ = -120;
              rotateY = -32;
              scale = 0.85;
              opacity = 0.5;
              zIndex = 20;
            }

            return (
              <div
                key={product.id}
                onClick={() => {
                  if (!isCenter) {
                    setCurrentIndex(idx);
                  }
                }}
                className={`absolute w-[320px] sm:w-[370px] h-[490px] transition-all duration-500 ease-out cursor-pointer ${
                  isCenter ? "cursor-default" : "hover:opacity-80"
                }`}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* 3D Card Flipper Container */}
                <div
                  className="w-full h-full relative transition-transform duration-700 ease-in-out"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* FRONT FACE OF LENTICULAR CARD */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-3xl bg-[rgba(15,34,43,0.92)] border border-[#f3efe6]/15 overflow-hidden shadow-2xl flex flex-col justify-between backdrop-blur-md"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    {/* Lenticular Holographic Sheen overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay z-20"
                      style={{
                        background: `linear-gradient(${
                          105 + mousePos.x * 40
                        }deg, transparent 20%, rgba(255,255,255,0.7) 45%, rgba(45,212,191,0.5) 55%, transparent 80%)`,
                        backgroundSize: "200% 200%",
                      }}
                    />

                    {/* Image Header with Badge */}
                    <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="400px"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

                      {product.badge && (
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black bg-teal-500 text-slate-950 shadow-md">
                          {product.badge}
                        </span>
                      )}

                      {/* Flip Hint Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleFlip(product.id, e)}
                        className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition-all active:scale-90 z-20"
                        title="Balik kartu untuk rincian fasilitas"
                      >
                        <RotateCw className="w-3.5 h-3.5 text-teal-400" />
                        <span>Fasilitas</span>
                      </button>

                      {/* Capacity Pill Bar */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs font-semibold">
                          <Users className="w-3.5 h-3.5 text-teal-300" />
                          <span>{product.capacity}</span>
                        </span>
                        {product.luggageCapacity && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs font-semibold">
                            <Briefcase className="w-3.5 h-3.5 text-sky-300" />
                            <span>{product.luggageCapacity}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Body Details */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between text-left">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400 block mb-1">
                          {product.category.replace("_", " ")}
                        </span>
                        <h3 className="text-lg font-bold text-white leading-tight">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Price & Action */}
                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">
                            Tarif Mulai Dari
                          </span>
                          <span className="text-base sm:text-lg font-black text-teal-300">
                            {formatRupiah(product.priceStartingFrom)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectService(product);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/30 transition-all active:scale-95"
                        >
                          <Zap className="w-3.5 h-3.5 fill-white" />
                          <span>Pesan Cepat</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE OF LENTICULAR CARD (Turned Over View) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-[#0f222b] via-[#132832] to-[#0b171c] border border-[#14b8a6]/40 p-6 flex flex-col justify-between shadow-2xl text-left"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div>
                      {/* Top flip header */}
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <span className="text-xs font-extrabold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-teal-400" />
                          <span>Paket All-Inclusive</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => toggleFlip(product.id, e)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="text-base font-extrabold text-white mt-3">
                        {product.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Fasilitas resmi yang otomatis sudah termasuk:
                      </p>

                      {/* Included Perks List */}
                      <ul className="mt-4 space-y-2.5">
                        {product.included?.map((inc: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-xs text-slate-200"
                          >
                            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                            <span className="leading-snug">{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-4 border-t border-white/10 space-y-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectService(product);
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        <Zap className="w-4 h-4 fill-white" />
                        <span>Pesan Armada Ini (WA)</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => toggleFlip(product.id, e)}
                        className="w-full py-2 text-center text-xs text-slate-400 hover:text-slate-200 font-semibold"
                      >
                        ← Kembali ke Tampilan Depan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-2 sm:left-6 z-40 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 backdrop-blur-md shadow-xl transition-all active:scale-90"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-2 sm:right-6 z-40 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 backdrop-blur-md shadow-xl transition-all active:scale-90"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
          {products.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === i
                  ? "w-8 bg-teal-400"
                  : "w-2 bg-slate-700 hover:bg-slate-500"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
