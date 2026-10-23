"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Calendar,
  Clock,
  Users,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Ship,
  Car,
  Zap,
} from "lucide-react";
import { BookingFormData } from "@/types";
import { generateBookingId, buildWhatsAppLink, WHATSAPP_OPERATOR_PHONE } from "@/lib/whatsapp";
import { trackSubmitBooking, trackWhatsAppClick } from "@/lib/analytics";
import { POPULAR_ROUTES } from "@/lib/data/routes";
import { useLanguage } from "@/components/LanguageProvider";

export interface BookingFormProps {
  initialData?: Partial<BookingFormData> | null;
  lockServiceSelection?: boolean;
  serviceType?: "car" | "fastboat";
  availableSchedules?: string[];
  title?: string;
  subtitle?: string;
  isModal?: boolean;
  onClose?: () => void;
  lang?: "id" | "en";
  className?: string;
}

export default function BookingForm({
  initialData,
  lockServiceSelection = false,
  serviceType: initialServiceType,
  availableSchedules,
  title,
  subtitle,
  isModal = false,
  onClose,
  lang = "id",
  className = "",
}: BookingFormProps) {
  const { products: POPULAR_SERVICES } = useLanguage();

  const [formData, setFormData] = useState<BookingFormData>({
    customerName: "",
    customerPhone: "",
    serviceType: initialServiceType || initialData?.serviceType || "fastboat",
    selectedItemId: initialData?.selectedItemId || (initialServiceType === "car" ? POPULAR_SERVICES[0]?.id || "airport-transfer-kuta" : POPULAR_ROUTES[0]?.id || "sanur-nusa-penida"),
    selectedItemTitle: initialData?.selectedItemTitle || (initialServiceType === "car" ? POPULAR_SERVICES[0]?.name || "Airport Transfer Kuta" : `Fastboat Sanur → Nusa Penida`),
    bookingDate: initialData?.bookingDate || new Date(Date.now() + 86400000).toISOString().split("T")[0],
    bookingTime: initialData?.bookingTime || (availableSchedules && availableSchedules.length > 0 ? `${availableSchedules[0]} WITA` : "08:30 WITA"),
    passengerCount: initialData?.passengerCount || 2,
    pickupLocation: initialData?.pickupLocation || "",
    dropoffLocation: initialData?.dropoffLocation || "",
    notes: initialData?.notes || "",
    estimatedBudget: initialData?.estimatedBudget || "",
  });

  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [waUrl, setWaUrl] = useState<string>("");

  // Sync initialData when passed or updated
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        serviceType: initialServiceType || initialData.serviceType || prev.serviceType,
      }));
    }
  }, [initialData, initialServiceType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBookingId = generateBookingId();
    setCreatedBookingId(newBookingId);

    // Track analytics
    trackSubmitBooking(newBookingId, formData.selectedItemTitle);
    trackWhatsAppClick(`booking-${formData.selectedItemId}`);

    // Build direct pure wa.me link
    const targetWaUrl = buildWhatsAppLink(formData, newBookingId, WHATSAPP_OPERATOR_PHONE);
    setWaUrl(targetWaUrl);

    // Save to store / background API if reachable (fire-and-forget)
    try {
      fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).catch(() => {});
    } catch {}

    // Immediately open WhatsApp in new tab
    window.open(targetWaUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyBookingId = () => {
    if (createdBookingId) {
      navigator.clipboard.writeText(createdBookingId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setCreatedBookingId(null);
    if (isModal && onClose) {
      onClose();
    }
  };

  return (
    <div className={`bg-[rgba(15,34,43,0.95)] text-[#f3efe6] rounded-3xl border border-[#f3efe6]/15 shadow-2xl shadow-black/80 backdrop-blur-xl overflow-hidden ${className}`}>
      {/* Form Header */}
      <div className="p-5 sm:p-6 bg-[#0b171c] border-b border-[#f3efe6]/10 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#14b8a6]/15 text-[#14b8a6] flex items-center justify-center border border-[#14b8a6]/30 shrink-0">
            <Zap className="w-5 h-5 fill-[#14b8a6] text-[#14b8a6]" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#14b8a6] block">
              {lang === "id" ? "Pesan Cepat (WhatsApp)" : "Quick Booking (WhatsApp)"}
            </span>
            <h3 className="text-base sm:text-lg font-bold font-display leading-tight text-[#f3efe6]">
              {title || (lang === "id" ? "Formulir Booking WhatsApp" : "WhatsApp Booking Form")}
            </h3>
            <p className="text-xs text-[#93a39e] mt-0.5">
              {subtitle || (lang === "id" ? "Konfirmasi Langsung ke WhatsApp Operator • Tanpa Perlu Akun" : "Direct WhatsApp Confirmation • No Account Needed")}
            </p>
          </div>
        </div>

        {isModal && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#93a39e] hover:text-[#f3efe6] hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Success Screen after submission */}
      {createdBookingId ? (
        <div className="p-6 sm:p-8 text-center space-y-5 animate-in fade-in">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-inner bg-[#14b8a6]/20 text-[#14b8a6]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold mb-2 bg-[#14b8a6]/10 text-[#14b8a6] border border-[#14b8a6]/30">
              <span className="w-2 h-2 rounded-full bg-[#14b8a6] animate-ping" />
              WhatsApp Link Siap
            </div>
            <h4 className="text-xl font-bold font-display text-[#f3efe6]">
              {lang === "id" ? "Pemesanan Sedang Diteruskan ke WhatsApp!" : "Booking Initiated on WhatsApp!"}
            </h4>
            <p className="text-xs sm:text-sm text-[#93a39e] mt-1 max-w-md mx-auto leading-relaxed">
              {lang === "id"
                ? "Sistem telah menyiapkan rincian pesanan Anda. Jika aplikasi WhatsApp belum terbuka otomatis, silakan klik tombol hijau di bawah ini."
                : "WhatsApp has been opened with your pre-formatted order details. If not opened, click the green button below."}
            </p>
          </div>

          {/* Booking ID Box */}
          <div className="p-4 rounded-2xl bg-[#0b171c] border border-[#f3efe6]/15 max-w-sm mx-auto text-left">
            <span className="text-[11px] font-bold text-[#93a39e] uppercase tracking-wider block">
              Booking ID Anda:
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-lg font-black text-[#14b8a6] tracking-wider">
                {createdBookingId}
              </span>
              <button
                type="button"
                onClick={handleCopyBookingId}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[rgba(15,34,43,0.8)] border border-[#f3efe6]/15 hover:bg-[#132534] text-[#f3efe6] transition-colors"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#14b8a6]" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#93a39e]" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={waUrl || buildWhatsAppLink(formData, createdBookingId, WHATSAPP_OPERATOR_PHONE)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-white/20" />
              <span>Buka WhatsApp Sekarang</span>
            </a>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3.5 rounded-xl bg-[#0b171c] border border-[#f3efe6]/15 hover:bg-[#132534] text-[#f3efe6] font-semibold text-sm transition-colors active:scale-95"
            >
              {isModal ? "Selesai & Tutup" : "Pesan Lagi"}
            </button>
          </div>
        </div>
      ) : (
        /* Form Inputs */
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4">
          {/* Service Toggle & Selection (only if not locked) */}
          {!lockServiceSelection ? (
            <>
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#0b171c] border border-[#f3efe6]/10 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      serviceType: "fastboat",
                      selectedItemId: POPULAR_ROUTES[0].id,
                      selectedItemTitle: `Fastboat: ${POPULAR_ROUTES[0].departurePort.split(" ")[1] || POPULAR_ROUTES[0].departurePort} → ${POPULAR_ROUTES[0].destinationName}`,
                      dropoffLocation: POPULAR_ROUTES[0].arrivalPort,
                    }));
                  }}
                  className={`py-2 text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    formData.serviceType === "fastboat"
                      ? "bg-[rgba(15,34,43,0.9)] text-[#14b8a6] border border-[#14b8a6]/40 shadow-xs"
                      : "text-[#93a39e] hover:text-[#f3efe6]"
                  }`}
                >
                  <Ship className="w-4 h-4 text-[#14b8a6]" />
                  <span>Tiket Fastboat</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      serviceType: "car",
                      selectedItemId: POPULAR_SERVICES[0].id,
                      selectedItemTitle: POPULAR_SERVICES[0].name,
                      dropoffLocation: "Sesuai Rute / Destinasi Wisata",
                    }));
                  }}
                  className={`py-2 text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    formData.serviceType === "car"
                      ? "bg-[rgba(15,34,43,0.9)] text-[#14b8a6] border border-[#14b8a6]/40 shadow-xs"
                      : "text-[#93a39e] hover:text-[#f3efe6]"
                  }`}
                >
                  <Car className="w-4 h-4 text-[#14b8a6]" />
                  <span>Rental Mobil & Driver</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#93a39e] uppercase tracking-wider mb-1">
                  {formData.serviceType === "fastboat" ? "Pilih Rute Penyeberangan" : "Pilih Layanan / Jenis Armada"}
                </label>
                <select
                  value={formData.selectedItemId}
                  onChange={(e) => {
                    const id = e.target.value;
                    if (formData.serviceType === "fastboat") {
                      const r = POPULAR_ROUTES.find((item) => item.id === id);
                      if (r) {
                        setFormData((prev) => ({
                          ...prev,
                          selectedItemId: id,
                          selectedItemTitle: `Fastboat ${r.departurePort.split("(")[0].trim()} → ${r.destinationName}`,
                          dropoffLocation: r.arrivalPort,
                        }));
                      }
                    } else {
                      const s = POPULAR_SERVICES.find((item) => item.id === id);
                      if (s) {
                        setFormData((prev) => ({
                          ...prev,
                          selectedItemId: id,
                          selectedItemTitle: s.name,
                        }));
                      }
                    }
                  }}
                  className="w-full h-11 px-3.5 bg-[#0b171c] border border-[#f3efe6]/15 rounded-xl text-[#f3efe6] text-sm focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] font-medium cursor-pointer"
                >
                  {formData.serviceType === "fastboat"
                    ? POPULAR_ROUTES.map((r) => (
                        <option key={r.id} value={r.id} className="bg-[#0b171c] text-[#f3efe6]">
                          {r.departurePort.split("(")[0].trim()} → {r.destinationName} ({r.durationMinutes} mnt)
                        </option>
                      ))
                    : POPULAR_SERVICES.map((s) => (
                        <option key={s.id} value={s.id} className="bg-[#0b171c] text-[#f3efe6]">
                          {s.name} ({s.capacity})
                        </option>
                      ))}
                </select>
              </div>
            </>
          ) : (
            /* Locked Item Summary Banner */
            <div className="p-3.5 rounded-2xl bg-[#0b171c] border border-[#f3efe6]/15 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#14b8a6]/15 text-[#14b8a6] flex items-center justify-center font-bold text-xs border border-[#14b8a6]/30">
                  {formData.serviceType === "fastboat" ? <Ship className="w-4 h-4 text-[#14b8a6]" /> : <Car className="w-4 h-4 text-[#14b8a6]" />}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#93a39e] uppercase tracking-wider block">
                    {formData.serviceType === "fastboat" ? "Rute Terpilih" : "Armada Terpilih"}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#f3efe6]">
                    {formData.selectedItemTitle}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#14b8a6] bg-[#14b8a6]/10 px-2.5 py-1 rounded-full border border-[#14b8a6]/30">
                Ready
              </span>
            </div>
          )}

          {/* 1. Customer Name & WhatsApp Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#93a39e] uppercase tracking-wider mb-1">
                Nama Lengkap *
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Contoh: Budi Santoso"
                className="w-full h-11 px-3.5 bg-[#0b171c] border border-[#f3efe6]/15 rounded-xl text-[#f3efe6] placeholder-[#93a39e]/40 text-sm focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] font-medium transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#93a39e] uppercase tracking-wider mb-1">
                Nomor WhatsApp Aktif *
              </label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                placeholder="Contoh: 08123456789"
                className="w-full h-11 px-3.5 bg-[#0b171c] border border-[#f3efe6]/15 rounded-xl text-[#f3efe6] placeholder-[#93a39e]/40 text-sm focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] font-medium transition-all"
                required
              />
            </div>
          </div>

          {/* 2. Date, Time & Pax */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#93a39e] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#14b8a6]" />
                <span>Tanggal *</span>
              </label>
              <input
                type="date"
                value={formData.bookingDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                className="w-full h-11 px-3 bg-[#0b171c] border border-[#f3efe6]/15 rounded-xl text-[#f3efe6] text-sm focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] font-medium transition-all scheme-dark"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#93a39e] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#14b8a6]" />
                <span>Jam / Sesi</span>
              </label>
              {availableSchedules && availableSchedules.length > 0 ? (
                <select
                  value={formData.bookingTime || `${availableSchedules[0]} WITA`}
                  onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                  className="w-full h-11 px-3 bg-[#0b171c] border border-[#f3efe6]/15 rounded-xl text-[#f3efe6] text-sm focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] font-medium cursor-pointer"
                >
                  {availableSchedules.map((s) => (
                    <option key={s} value={`${s} WITA`} className="bg-[#0b171c] text-[#f3efe6]">
                      {s} WITA
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.bookingTime || ""}
                  onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                  placeholder="08:30 / 10:00"
                  className="w-full h-11 px-3 bg-[#0b171c] border border-[#f3efe6]/15 rounded-xl text-[#f3efe6] placeholder-[#93a39e]/40 text-sm focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] font-medium transition-all"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#93a39e] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#14b8a6]" />
                <span>Jumlah Pax *</span>
              </label>
              <select
                value={formData.passengerCount}
                onChange={(e) => setFormData({ ...formData, passengerCount: Number(e.target.value) })}
                className="w-full h-11 px-3 bg-[#0b171c] border border-[#f3efe6]/15 rounded-xl text-[#f3efe6] text-sm focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] font-medium cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((n) => (
                  <option key={n} value={n} className="bg-[#0b171c] text-[#f3efe6]">
                    {n} Orang
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Pickup Location & Dropoff Location */}
          <div className="space-y-3.5 p-4 rounded-xl bg-[#0b171c]/60 border border-[#f3efe6]/10">
            <div>
              <label className="block text-xs font-bold text-[#93a39e] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#14b8a6]/20 text-[#14b8a6] flex items-center justify-center shrink-0">
                  <MapPin className="w-3 h-3 text-[#14b8a6]" />
                </div>
                <span>Titik Penjemputan *</span>
              </label>
              <input
                type="text"
                value={formData.pickupLocation}
                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                placeholder="Contoh: Bandara Ngurah Rai, Pelabuhan Sanur, atau Nama Hotel"
                className="w-full h-11 px-3.5 bg-[#0b171c] border border-[#f3efe6]/15 rounded-xl text-[#f3efe6] placeholder-[#93a39e]/40 text-sm focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#93a39e] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#14b8a6]/20 text-[#14b8a6] flex items-center justify-center shrink-0">
                  <MapPin className="w-3 h-3 text-[#14b8a6]" />
                </div>
                <span>Tujuan / Drop-off *</span>
              </label>
              <input
                type="text"
                value={formData.dropoffLocation}
                onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                placeholder="Tujuan Wisata / Pelabuhan / Hotel"
                className="w-full h-11 px-3.5 bg-[#0b171c] border border-[#f3efe6]/15 rounded-xl text-[#f3efe6] placeholder-[#93a39e]/40 text-sm focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] font-medium"
                required
              />
            </div>
          </div>

          {/* 4. Estimasi Budget & Catatan Tambahan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#93a39e] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <span className="text-[#14b8a6] font-bold text-base">💰</span>
                <span>Estimasi Budget</span>
              </label>
              <input
                type="text"
                value={formData.estimatedBudget || ""}
                onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                placeholder="Rp 500.000 / Sesuai Penawaran"
                className="w-full h-11 px-3.5 bg-[#0b171c] border border-[#f3efe6]/15 rounded-xl text-[#14b8a6] placeholder-[#93a39e]/40 text-sm focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] font-medium"
              />
              <span className="text-[10px] text-[#93a39e] block mt-1 leading-tight">
                Opsional: Perkiraan dana untuk menyesuaikan paket armada terbaik.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#93a39e] uppercase tracking-wider mb-1.5">
                Catatan Tambahan
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Bawa koper besar, butuh baby seat..."
                rows={2}
                className="w-full p-3 bg-[#0b171c] border border-[#f3efe6]/15 rounded-xl text-[#f3efe6] placeholder-[#93a39e]/40 text-xs sm:text-sm focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] font-medium resize-none"
              />
            </div>
          </div>

          {/* 5. Trust Badges & Submit */}
          <div className="pt-3 border-t border-[#f3efe6]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#93a39e] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#14b8a6] shrink-0" />
              <span>Tanpa pembayaran di muka • Konfirmasi langsung via WhatsApp</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#14b8a6] hover:bg-[#0d9488] text-[#0b171c] font-black text-sm shadow-md shadow-[#14b8a6]/25 transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 fill-[#0b171c]/20 text-[#0b171c]" />
              <span>Kirim Pemesanan ke WhatsApp</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
