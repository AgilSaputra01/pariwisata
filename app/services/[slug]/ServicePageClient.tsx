"use client";

import React from "react";
import { TransportService } from "@/types";
import { WHATSAPP_OPERATOR_PHONE } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";
import BookingForm from "@/components/BookingForm";

interface Props {
  service: TransportService;
}

export default function ServicePageClient({ service }: Props) {
  const handleWaClick = () => {
    trackWhatsAppClick(`consult-${service.id}`);
  };

  return (
    <div className="lg:sticky lg:top-24 space-y-4">
      {/* Booking Form (Pesan Cepat) */}
      <BookingForm
        serviceType="car"
        lockServiceSelection={true}
        initialData={{
          serviceType: "car",
          selectedItemId: service.id,
          selectedItemTitle: service.name,
          pickupLocation: "Bandara DPS Ngurah Rai / Hotel di Bali",
          dropoffLocation: "Destinasi Wisata / Hotel Tujuan",
        }}
        title={`Booking ${service.name}`}
        subtitle="Konfirmasi Langsung ke WhatsApp Operator • Tanpa Perlu Akun"
        lang="id"
      />

      {/* Direct WA Consult */}
      <a
        href={`https://wa.me/${WHATSAPP_OPERATOR_PHONE}?text=${encodeURIComponent(
          `Halo BaliRide! Saya ingin konsultasi tentang armada dan layanan: ${service.name}.`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleWaClick}
        className="block w-full py-3 rounded-xl border-2 border-emerald-300 text-emerald-700 font-bold text-sm text-center hover:bg-emerald-50 transition-colors"
      >
        💬 Tanya Dulu ke CS WhatsApp
      </a>
    </div>
  );
}
