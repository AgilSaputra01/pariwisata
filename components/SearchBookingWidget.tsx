"use client";

import React, { useState } from "react";
import { Car, Ship, Calendar, Users, MapPin, Search, ArrowRightLeft, Sparkles, CheckCircle2, Zap } from "lucide-react";
import { POPULAR_ROUTES } from "@/lib/data/routes";
import { useLanguage } from "@/components/LanguageProvider";

interface SearchBookingWidgetProps {
  onSelectBooking: (item: {
    type: "car" | "fastboat";
    id: string;
    title: string;
    pickup: string;
    dropoff: string;
    passengerCount: number;
    date: string;
  }) => void;
  lang: "id" | "en";
}

export default function SearchBookingWidget({ onSelectBooking, lang }: SearchBookingWidgetProps) {
  const { products: POPULAR_SERVICES } = useLanguage();
  const [activeTab, setActiveTab] = useState<"fastboat" | "car">("fastboat");
  
  // Fastboat state
  const [boatRoute, setBoatRoute] = useState("sanur-nusa-penida");
  const [boatDate, setBoatDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [boatPax, setBoatPax] = useState(2);

  // Car state
  const [carService, setCarService] = useState("airport-transfer-kuta");
  const [carPickup, setCarPickup] = useState("Bandara Ngurah Rai (DPS)");
  const [carDropoff, setCarDropoff] = useState("Kuta / Seminyak / Legian");
  const [carDate, setCarDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [carPax, setCarPax] = useState(2);

  const selectedRouteObj = POPULAR_ROUTES.find((r) => r.id === boatRoute) || POPULAR_ROUTES[0];
  const selectedCarObj = POPULAR_SERVICES.find((s) => s.id === carService) || POPULAR_SERVICES[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "fastboat") {
      onSelectBooking({
        type: "fastboat",
        id: selectedRouteObj.id,
        title: `Fastboat: ${selectedRouteObj.departurePort.split(" ")[1] || "Sanur"} → ${selectedRouteObj.destinationName}`,
        pickup: selectedRouteObj.departurePort,
        dropoff: selectedRouteObj.arrivalPort,
        passengerCount: boatPax,
        date: boatDate,
      });
    } else {
      onSelectBooking({
        type: "car",
        id: selectedCarObj.id,
        title: selectedCarObj.name,
        pickup: carPickup,
        dropoff: carDropoff,
        passengerCount: carPax,
        date: carDate,
      });
    }
  };

  return (
    <div id="search-widget" className="relative -mt-10 sm:-mt-14 z-30 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="bg-[rgba(15,34,43,0.92)] rounded-2xl shadow-2xl shadow-black/60 border border-[#f3efe6]/15 backdrop-blur-xl overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#f3efe6]/10 bg-[#0b171c]/60">
          <button
            type="button"
            onClick={() => setActiveTab("fastboat")}
            className={`flex-1 py-4 px-6 text-sm sm:text-base font-bold flex items-center justify-center gap-2.5 transition-all border-b-2 ${
              activeTab === "fastboat"
                ? "border-[#14b8a6] text-[#14b8a6] bg-[rgba(15,34,43,0.85)] shadow-xs"
                : "border-transparent text-[#93a39e] hover:text-[#f3efe6] hover:bg-[#132534]/50"
            }`}
          >
            <Ship className={`w-5 h-5 ${activeTab === "fastboat" ? "text-[#14b8a6]" : "text-[#93a39e]"}`} />
            <span>{lang === "id" ? "Tiket Fastboat" : "Fastboat Ferry"}</span>
            <span className="hidden md:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-[#14b8a6]/15 text-[#14b8a6] border border-[#14b8a6]/30">
              Sanur • Penida • Gili
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("car")}
            className={`flex-1 py-4 px-6 text-sm sm:text-base font-bold flex items-center justify-center gap-2.5 transition-all border-b-2 ${
              activeTab === "car"
                ? "border-[#14b8a6] text-[#14b8a6] bg-[rgba(15,34,43,0.85)] shadow-xs"
                : "border-transparent text-[#93a39e] hover:text-[#f3efe6] hover:bg-[#132534]/50"
            }`}
          >
            <Car className={`w-5 h-5 ${activeTab === "car" ? "text-[#14b8a6]" : "text-[#93a39e]"}`} />
            <span>{lang === "id" ? "Rental Mobil & Transfer" : "Car Rental & Airport"}</span>
            <span className="hidden md:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-950/60 text-teal-300 border border-teal-500/30">
              + Supir / Lepas Kunci
            </span>
          </button>
        </div>

        {/* Search Fields Form */}
        <form onSubmit={handleSearchSubmit} className="p-5 sm:p-7">
          {activeTab === "fastboat" ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Route Selector */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#93a39e] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#14b8a6]" />
                  <span>{lang === "id" ? "Pilih Rute Penyeberangan" : "Select Route"}</span>
                </label>
                <div className="relative">
                  <select
                    value={boatRoute}
                    onChange={(e) => setBoatRoute(e.target.value)}
                    className="w-full h-12 px-3.5 bg-[#0b171c] border border-[#f3efe6]/15 rounded-xl text-[#f3efe6] font-medium text-sm focus:outline-hidden focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] transition-all cursor-pointer"
                  >
                    {POPULAR_ROUTES.map((route) => (
                      <option key={route.id} value={route.id} className="bg-[#0b171c] text-[#f3efe6]">
                        {route.departurePort.split("(")[0].trim()} ➔ {route.destinationName} ({route.durationMinutes} mnt)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-[#93a39e] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#14b8a6]" />
                  <span>{lang === "id" ? "Tanggal Berangkat" : "Departure Date"}</span>
                </label>
                <input
                  type="date"
                  value={boatDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setBoatDate(e.target.value)}
                  className="w-full h-12 px-3 bg-[#0b171c] border border-[#f3efe6]/15 rounded-xl text-[#f3efe6] font-medium text-sm focus:outline-hidden focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] transition-all scheme-dark"
                  required
                />
              </div>

              {/* Passengers */}
              <div>
                <label className="block text-xs font-semibold text-[#93a39e] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#14b8a6]" />
                  <span>{lang === "id" ? "Penumpang" : "Passengers"}</span>
                </label>
                <select
                  value={boatPax}
                  onChange={(e) => setBoatPax(Number(e.target.value))}
                  className="w-full h-12 px-3 bg-[#0b171c] border border-[#f3efe6]/15 rounded-xl text-[#f3efe6] font-medium text-sm focus:outline-hidden focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] transition-all cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 15].map((num) => (
                    <option key={num} value={num} className="bg-[#0b171c] text-[#f3efe6]">
                      {num} {lang === "id" ? "Orang / Pax" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Car Service Type */}
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-[#93a39e] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-[#14b8a6]" />
                  <span>{lang === "id" ? "Jenis Layanan Mobil" : "Car Service"}</span>
                </label>
                <select
                  value={carService}
                  onChange={(e) => setCarService(e.target.value)}
                  className="w-full h-12 px-3 bg-[#0b171c] border border-[#f3efe6]/15 rounded-xl text-[#f3efe6] font-medium text-sm focus:outline-hidden focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] transition-all cursor-pointer"
                >
                  {POPULAR_SERVICES.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#0b171c] text-[#f3efe6]">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pickup / Dropoff */}
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-[#93a39e] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#14b8a6]" />
                  <span>{lang === "id" ? "Lokasi Jemput" : "Pick-up Location"}</span>
                </label>
                <input
                  type="text"
                  value={carPickup}
                  onChange={(e) => setCarPickup(e.target.value)}
                  placeholder="Bandara DPS / Hotel Kuta / Sanur"
                  className="w-full h-12 px-3 bg-[#0b171c] border border-[#f3efe6]/15 rounded-xl text-[#f3efe6] font-medium text-sm placeholder-[#93a39e]/50 focus:outline-hidden focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] transition-all"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-[#93a39e] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#14b8a6]" />
                  <span>{lang === "id" ? "Tanggal Layanan" : "Service Date"}</span>
                </label>
                <input
                  type="date"
                  value={carDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCarDate(e.target.value)}
                  className="w-full h-12 px-3 bg-[#0b171c] border border-[#f3efe6]/15 rounded-xl text-[#f3efe6] font-medium text-sm focus:outline-hidden focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] transition-all scheme-dark"
                  required
                />
              </div>

              {/* Pax */}
              <div>
                <label className="block text-xs font-semibold text-[#93a39e] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#14b8a6]" />
                  <span>{lang === "id" ? "Kapasitas Pax" : "Guests"}</span>
                </label>
                <select
                  value={carPax}
                  onChange={(e) => setCarPax(Number(e.target.value))}
                  className="w-full h-12 px-3 bg-[#0b171c] border border-[#f3efe6]/15 rounded-xl text-[#f3efe6] font-medium text-sm focus:outline-hidden focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] transition-all cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 14].map((num) => (
                    <option key={num} value={num} className="bg-[#0b171c] text-[#f3efe6]">
                      {num} {lang === "id" ? "Penumpang" : "Passengers"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Quick Result Summary Bar & CTA button */}
          <div className="mt-5 pt-4 border-t border-[#f3efe6]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-[#93a39e]">
              <span className="w-2 h-2 rounded-full bg-[#14b8a6] animate-ping" />
              <span>
                {activeTab === "fastboat" ? (
                  <>
                    Tersedia <strong className="text-[#f3efe6]">{selectedRouteObj.schedules.length} Jadwal</strong> per hari • {selectedRouteObj.operators[0]} & Rekanan Resmi
                  </>
                ) : (
                  <>
                    Unit siap jalan • <strong className="text-[#f3efe6]">{selectedCarObj.capacity}</strong> • Free Cancellation H-1
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="text-right hidden sm:block">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14b8a6] bg-[#14b8a6]/10 px-3 py-1.5 rounded-full border border-[#14b8a6]/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#14b8a6]" />
                  <span>{lang === "id" ? "Konfirmasi Langsung WA" : "Direct WhatsApp"}</span>
                </span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#14b8a6] hover:bg-[#0d9488] text-[#0b171c] font-black text-sm shadow-md shadow-[#14b8a6]/25 transition-all active:scale-95"
              >
                <Zap className="w-4 h-4 fill-[#0b171c]" />
                <span>{lang === "id" ? "Pesan Cepat via WhatsApp" : "Quick Book via WhatsApp"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
