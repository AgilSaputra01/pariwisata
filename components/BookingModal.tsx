"use client";

import React from "react";
import { BookingFormData } from "@/types";
import BookingForm from "./BookingForm";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<BookingFormData> | null;
  lang: "id" | "en";
}

export default function BookingModal({ isOpen, onClose, initialData, lang }: BookingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b171c]/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl my-8 animate-in zoom-in-95 duration-200">
        <BookingForm
          isModal
          onClose={onClose}
          initialData={initialData}
          lang={lang}
          title={lang === "id" ? "Formulir Booking WhatsApp" : "WhatsApp Booking Form"}
          subtitle={lang === "id" ? "Konfirmasi Langsung ke WhatsApp Operator • Tanpa Perlu Akun" : "Direct WhatsApp Confirmation • No Account Needed"}
        />
      </div>
    </div>
  );
}
