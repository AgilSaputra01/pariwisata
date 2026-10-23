import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck, HelpCircle } from "lucide-react";
import { WHATSAPP_OPERATOR_PHONE, WHATSAPP_OPERATOR_DISPLAY } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Hubungi Kami | Layanan Pelanggan & Pemesanan 24 Jam | BaliRide",
  description: "Hubungi tim customer support BaliRide 24/7 untuk konsultasi rute, pemesanan rental mobil, tiket fastboat Nusa Penida & Gili. Respon instan via WhatsApp 087761459651.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Hubungi BaliRide Transport",
    "description": "Layanan pelanggan 24/7 BaliRide untuk rental mobil dan tiket fastboat di Bali.",
    "mainEntity": {
      "@type": "TravelAgency",
      "name": "BaliRide Transport",
      "telephone": `+62${WHATSAPP_OPERATOR_PHONE.substring(1)}`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Jl. Bypass Ngurah Rai No. 88, Sanur",
        "addressLocality": "Denpasar Selatan",
        "addressRegion": "Bali",
        "postalCode": "80228",
        "addressCountry": "ID",
      },
      "openingHours": "Mo-Su 00:00-23:59",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <div className="min-h-screen bg-slate-50">
        {/* Navigation Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-700 hover:text-brand-600 font-semibold text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pusat Bantuan & Kontak</span>
          </div>
        </header>

        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
              <Clock className="w-3.5 h-3.5" /> CS Aktif 24 Jam Setiap Hari
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ada Pertanyaan atau Butuh Bantuan Booking?
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
              Tim support kami siap membantu rencana liburan Anda di Bali, Nusa Penida, Nusa Lembongan, dan Kepulauan Gili dengan respon cepat.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Card 1: WhatsApp */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">WhatsApp Resmi (CS)</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Respon instan dalam 2-5 menit untuk ketersediaan unit mobil, tiket fastboat, dan penjemputan bandara.
                </p>
                <div className="text-base font-extrabold text-slate-800 font-mono">
                  {WHATSAPP_OPERATOR_DISPLAY}
                </div>
              </div>
              <div className="pt-5 mt-4 border-t border-slate-100">
                <a
                  href={`https://wa.me/${WHATSAPP_OPERATOR_PHONE}?text=${encodeURIComponent(
                    "Halo BaliRide! Saya ingin bertanya tentang layanan transportasi pariwisata."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat Sekarang
                </a>
              </div>
            </div>

            {/* Card 2: Office & Base */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Lokasi & Pool Operasional</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Jl. Bypass Ngurah Rai No. 88, Sanur, Denpasar Selatan, Bali 80228 (Dekat Pelabuhan Sanur).
                </p>
                <div className="text-xs text-slate-600 font-medium">
                  Area Operasional: Seluruh Bali, Nusa Penida, Lembongan, Gili Trawangan, Senggigi.
                </div>
              </div>
              <div className="pt-5 mt-4 border-t border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg w-full justify-center">
                  <ShieldCheck className="w-4 h-4" /> Legalitas PT Terdaftar Resmi
                </span>
              </div>
            </div>

            {/* Card 3: Email & Kerjasama */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Email & Kemitraan</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Untuk kerjasama agen travel, paket rombongan besar (MICE), atau invoice perusahaan resmi.
                </p>
                <div className="text-sm font-bold text-slate-800 font-mono">
                  support@baliride-trans.com
                </div>
              </div>
              <div className="pt-5 mt-4 border-t border-slate-100">
                <a
                  href="mailto:support@baliride-trans.com"
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Kirim Email
                </a>
              </div>
            </div>
          </div>

          {/* Quick FAQ info */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-soft">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-600" />
              Pertanyaan yang Sering Diajukan Seputar Pemesanan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800 mb-1">Apakah bisa booking mendadak (hari H)?</p>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Bisa, selama armada atau tiket kapal masih tersedia. Silakan hubungi WhatsApp kami langsung untuk konfirmasi instan ketersediaan slot.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800 mb-1">Apakah perlu bayar lunas di awal?</p>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Tidak harus. Anda bisa membayar DP terlebih dahulu, dan sisa pelunasan bisa dilakukan langsung ke driver atau saat boarding di pelabuhan.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800 mb-1">Bagaimana cara reschedule tiket kapal jika cuaca buruk?</p>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Jika ada peringatan cuaca dari BMKG/Syahbandar, kami akan bantu reschedule ke jadwal kapal berikutnya tanpa biaya tambahan, atau opsi refund.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800 mb-1">Apakah supir bisa menjemput langsung di lobi kedatangan bandara?</p>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Ya! Supir kami akan menunggu di gate kedatangan dengan memegang sign board nama Anda sehingga tidak perlu khawatir tersesat.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
