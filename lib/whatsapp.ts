import { BookingFormData } from "@/types";

/**
 * Generate standard PRD-compliant Booking ID: BK-YYYYMMDD-XXXX
 */
export function generateBookingId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random or sequence
  
  return `BK-${year}${month}${day}-${randomSuffix}`;
}

/**
 * Format currency to IDR Rupiah
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const WHATSAPP_OPERATOR_PHONE = "6287761459651"; // WhatsApp Operator
export const WHATSAPP_OPERATOR_DISPLAY = "+62 877-6145-9651";


/**
 * Generate formatted WhatsApp message matching PRD Section 6.1
 */
export function createWhatsAppMessage(data: BookingFormData, bookingId: string): string {
  const lines = [
    "Halo, saya ingin melakukan booking layanan pariwisata.",
    "",
    `📋 *Booking ID:* ${bookingId}`,
    `👤 *Nama:* ${data.customerName}`,
    `📱 *WhatsApp:* ${data.customerPhone}`,
    `🚗 *Layanan / Rute:* ${data.selectedItemTitle}`,
    `📅 *Tanggal:* ${data.bookingDate}${data.bookingTime ? ` (Pukul ${data.bookingTime})` : ''}`,
    `👥 *Jumlah Penumpang:* ${data.passengerCount} orang`,
    `📍 *Lokasi Penjemputan:* ${data.pickupLocation || "-"}`,
    `🏁 *Tujuan / Drop-off:* ${data.dropoffLocation || "-"}`,
    `💰 *Estimasi Budget:* ${data.estimatedBudget ? data.estimatedBudget.trim() : "Fleksibel / Sesuai Penawaran"}`,
  ];

  if (data.notes && data.notes.trim()) {
    lines.push(`📝 *Catatan:* ${data.notes.trim()}`);
  } else {
    lines.push("📝 *Catatan:* Mohon informasi ketersediaan jadwal dan armada.");
  }

  lines.push("");
  lines.push("Terima kasih!");

  return lines.join("\n");
}

/**
 * Build direct WhatsApp Web / App URL
 */
export function buildWhatsAppLink(data: BookingFormData, bookingId: string, phone: string = WHATSAPP_OPERATOR_PHONE): string {
  const message = createWhatsAppMessage(data, bookingId);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedText}`;
}

/**
 * Build direct WhatsApp Web / App URL for Destination Transport Booking
 */
export function buildTransportBookingWhatsAppLink({
  destinationName,
  transportName,
  provider,
  price,
  schedule,
  phone = WHATSAPP_OPERATOR_PHONE,
}: {
  destinationName: string;
  transportName: string;
  provider: string;
  price?: string | number | null;
  schedule?: string;
  phone?: string;
}): string {
  const lines = [
    "Halo Dari Langit, saya ingin booking transportasi pariwisata:",
    "",
    `📍 *Destinasi:* ${destinationName}`,
    `⛵ *Layanan Transport:* ${transportName}`,
    `🏢 *Penyedia:* ${provider}`,
  ];

  if (schedule && schedule !== "Belum tersedia") {
    lines.push(`🕒 *Jadwal / Durasi:* ${schedule}`);
  }
  if (price && price !== "Belum tersedia") {
    lines.push(`💰 *Tarif:* ${typeof price === "number" ? formatRupiah(price) : price}`);
  }

  lines.push("", "Mohon info ketersediaan armada, jadwal, dan proses konfirmasi. Terima kasih!");
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
}

