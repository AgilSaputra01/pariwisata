"use client";

import React from "react";
import { FastboatRoute } from "@/types";
import { WHATSAPP_OPERATOR_PHONE } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";
import BookingForm from "@/components/BookingForm";

interface Props {
  route: FastboatRoute;
}

export default function RoutePageClient({ route }: Props) {
  const routeLabel = `Fastboat ${route.departurePort.split("(")[0].trim()} → ${route.destinationName}`;

  return (
    <div className="lg:sticky lg:top-24 space-y-4">
      {/* Booking Form (Pesan Cepat) */}
      <BookingForm
        serviceType="fastboat"
        lockServiceSelection={true}
        availableSchedules={route.schedules}
        initialData={{
          serviceType: "fastboat",
          selectedItemId: route.id,
          selectedItemTitle: routeLabel,
          pickupLocation: route.departurePort,
          dropoffLocation: route.arrivalPort,
          bookingTime: route.schedules[0] ? `${route.schedules[0]} WITA` : "08:30 WITA",
        }}
        title={`Tiket ${routeLabel}`}
        subtitle="Konfirmasi Langsung ke WhatsApp Operator • Tanpa Perlu Akun"
        lang="id"
      />

      {/* Consult Direct WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP_OPERATOR_PHONE}?text=${encodeURIComponent(
          `Halo BaliRide! Saya ingin tanya ketersediaan dan jadwal fastboat ke ${route.destinationName}.`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick(`consult-${route.id}`)}
        className="block w-full py-3 rounded-xl border-2 border-teal-300 text-teal-700 font-bold text-sm text-center hover:bg-teal-50 transition-colors"
      >
        💬 Tanya Jadwal & Ketersediaan via WhatsApp
      </a>
    </div>
  );
}
