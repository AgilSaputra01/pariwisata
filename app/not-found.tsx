import Link from "next/link";
import { ArrowLeft, Compass, PhoneCall } from "lucide-react";
import { WHATSAPP_OPERATOR_PHONE } from "@/lib/whatsapp";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-soft">
        <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Error 404</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Rute atau halaman yang Anda cari mungkin telah dipindahkan atau belum tersedia. Silakan kembali ke beranda untuk melihat jadwal transportasi wisata.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm inline-flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_OPERATOR_PHONE}?text=${encodeURIComponent(
              "Halo BaliRide, saya butuh bantuan mencari informasi rute di website."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors"
          >
            <PhoneCall className="w-4 h-4 text-emerald-600" />
            Tanya CS
          </a>
        </div>
      </div>
    </div>
  );
}
