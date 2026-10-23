"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  RefreshCw, 
  Send, 
  Phone, 
  Smartphone, 
  ShieldCheck, 
  Clock, 
  Radio,
  ExternalLink,
  MessageSquare
} from "lucide-react";

interface GatewayStatus {
  status: "INITIALIZING" | "QR_READY" | "AUTHENTICATED" | "READY" | "DISCONNECTED" | "ERROR";
  isReady: boolean;
  userInfo?: {
    wid?: string;
    pushname?: string;
    platform?: string;
  } | null;
  hasQr?: boolean;
  lastConnectedAt?: string | null;
  lastError?: string | null;
  timestamp?: string;
  version?: string;
}

export default function AdminWhatsAppPage() {
  const [statusData, setStatusData] = useState<GatewayStatus | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [testMessage, setTestMessage] = useState("Halo! Ini adalah pesan uji coba dari WhatsApp Gateway (whatsapp-web.js 1.34.7) Bali Transport Platform.");
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  const fetchStatusAndQR = async () => {
    try {
      // 1. Fetch status
      const statusRes = await fetch("/api/whatsapp/status", { cache: "no-store" });
      const statusJson = await statusRes.json();
      if (statusJson.data) {
        setStatusData(statusJson.data);
      }

      // 2. If QR ready or has QR, fetch QR
      if (statusJson.data?.status === "QR_READY" || statusJson.data?.hasQr) {
        const qrRes = await fetch("/api/whatsapp/qr", { cache: "no-store" });
        const qrJson = await qrRes.json();
        if (qrJson.data?.qrDataUrl) {
          setQrUrl(qrJson.data.qrDataUrl);
        }
      } else if (statusJson.data?.status === "READY") {
        setQrUrl(null);
      }

      // 3. Fetch recent bookings
      const bkRes = await fetch("/api/bookings", { cache: "no-store" });
      const bkJson = await bkRes.json();
      if (bkJson.data) {
        setBookings(bkJson.data);
      }
    } catch (err) {
      console.error("Failed fetching WhatsApp status:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatusAndQR();
    const interval = setInterval(fetchStatusAndQR, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchStatusAndQR();
  };

  const handleRestartClient = async () => {
    if (!confirm("Mulai ulang koneksi WhatsApp Gateway?")) return;
    setIsRefreshing(true);
    try {
      await fetch("/api/whatsapp/restart", { method: "POST" });
      setTimeout(fetchStatusAndQR, 2000);
    } catch (err: any) {
      alert("Gagal restart: " + err.message);
      setIsRefreshing(false);
    }
  };

  const handleSendTestMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone || !testMessage) return;
    setTestSending(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/whatsapp/test-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testPhone, message: testMessage }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({ success: true, message: `Pesan sukses terkirim ke ${data.data?.to || testPhone}!` });
      } else {
        setTestResult({ success: false, message: data.error || "Gagal mengirim pesan." });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err.message });
    } finally {
      setTestSending(false);
    }
  };

  const currentStatus = statusData?.status || "DISCONNECTED";

  return (
    <div className="min-w-0 min-h-screen bg-slate-900 text-slate-100 font-sans pb-16">
      {/* Top Banner */}
      <div className="bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-1">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>WhatsApp Booking Gateway (Mode 3)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              WhatsApp Gateway Control Panel
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Ditenagai oleh <span className="text-emerald-400 font-mono font-semibold">whatsapp-web.js v1.34.7</span> untuk pengiriman otomatis pemesanan tiket & sewa armada.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition flex items-center gap-2 border border-slate-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Segarkan
            </button>
            <button
              onClick={handleRestartClient}
              disabled={isRefreshing}
              className="px-4 py-2 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 rounded-xl text-sm font-medium transition border border-rose-800/50"
            >
              Restart Bot
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* Status Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Status Card */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status Koneksi</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                currentStatus === "READY"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : currentStatus === "QR_READY"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : currentStatus === "INITIALIZING"
                  ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
              }`}>
                <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                {currentStatus}
              </span>
            </div>

            <div className="text-xl font-bold text-white mb-1">
              {currentStatus === "READY" && "Gateway Siap & Terhubung"}
              {currentStatus === "QR_READY" && "Menunggu Scan QR Code"}
              {currentStatus === "INITIALIZING" && "Memulai Chromium / WhatsApp"}
              {currentStatus === "DISCONNECTED" && "Gateway Belum Dijalankan"}
              {currentStatus === "ERROR" && "Terjadi Kendala Koneksi"}
            </div>

            <p className="text-slate-400 text-xs mt-2">
              {currentStatus === "READY" && "Setiap pesanan dari website akan otomatis terkirim ke WhatsApp customer & operator."}
              {currentStatus === "QR_READY" && "Buka WhatsApp di HP Anda > Perangkat Tertaut > Tautkan Perangkat lalu scan QR Code."}
              {currentStatus === "DISCONNECTED" && "Jalankan perintah 'npm run whatsapp:bot' di terminal untuk mengaktifkan service."}
              {currentStatus === "INITIALIZING" && "Sedang memuat browser Puppeteer dan mengecek sesi login lokal."}
            </p>
          </div>

          {/* Account Info Card */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nomor WhatsApp Terhubung</span>
              <Smartphone className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="text-lg font-bold text-white mb-1">
              {statusData?.userInfo?.pushname || (currentStatus === "READY" ? "Operator Terhubung" : "Belum Tertaut")}
            </div>

            <div className="text-sm font-mono text-emerald-400">
              {statusData?.userInfo?.wid?.split("@")[0] || "-"}
            </div>

            <div className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Sesi tersimpan otomatis via LocalAuth</span>
            </div>
          </div>

          {/* Library & Engine Card */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Spesifikasi Gateway</span>
              <span className="text-xs font-mono bg-slate-700 px-2 py-0.5 rounded text-slate-300">v1.34.7</span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Library:</span>
                <span className="font-mono text-white">whatsapp-web.js@1.34.7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Browser Engine:</span>
                <span className="font-mono text-white">Puppeteer Headless</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Port Gateway:</span>
                <span className="font-mono text-white">3001 (Internal REST)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fallback Mode:</span>
                <span className="text-emerald-400 font-semibold">wa.me Deep Link (Active)</span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code and Test Message Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* QR Code Section */}
          <div className="lg:col-span-6 bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Scan QR Code WhatsApp</h2>
                <p className="text-xs text-slate-400">Tautkan akun WhatsApp Operator untuk memulai pengiriman otomatis</p>
              </div>
            </div>

            {currentStatus === "READY" ? (
              <div className="p-8 text-center bg-emerald-950/30 border border-emerald-800/40 rounded-2xl">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-emerald-300 mb-1">WhatsApp Telah Terhubung</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Gateway aktif dan siap mengirim notifikasi pesanan ke pelanggan dan admin. Tidak perlu scan ulang.
                </p>
              </div>
            ) : qrUrl ? (
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-inner">
                {/* QR Code Image */}
                <Image
                  src={qrUrl}
                  alt="WhatsApp Web QR Code"
                  width={280}
                  height={280}
                  className="rounded-xl border border-slate-200"
                  unoptimized
                />
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    QR Code Diperbarui Otomatis
                  </span>
                  <p className="text-xs text-slate-600 max-w-xs">
                    Buka WhatsApp di ponsel &gt; Ketuk Menu / Pengaturan &gt; Perangkat Tertaut &gt; Arahkan kamera ke layar ini.
                  </p>
                </div>
              </div>
            ) : currentStatus === "DISCONNECTED" ? (
              <div className="p-8 text-center bg-slate-900/60 border border-slate-700/80 rounded-2xl">
                <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-2">WhatsApp Service Belum Aktif</h3>
                <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
                  Untuk mengaktifkan gateway whatsapp-web.js 1.34.7, jalankan service di terminal project:
                </p>
                <div className="bg-slate-950 px-4 py-3 rounded-xl font-mono text-xs text-emerald-400 border border-slate-800 select-all mb-4">
                  npm run dev:all
                </div>
                <p className="text-[11px] text-slate-500">
                  (atau <code>npm run whatsapp:bot</code> di jendela terminal baru)
                </p>
              </div>
            ) : (
              <div className="p-12 text-center">
                <RefreshCw className="w-8 h-8 text-sky-400 animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-300">Sedang memuat QR code dari WhatsApp Web...</p>
              </div>
            )}
          </div>

          {/* Test Sender Section */}
          <div className="lg:col-span-6 bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Uji Coba Pengiriman Pesan</h2>
                  <p className="text-xs text-slate-400">Test pengiriman pesan teks langsung melalui gateway</p>
                </div>
              </div>

              <form onSubmit={handleSendTestMessage} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nomor WhatsApp Tujuan (contoh: 08123456789 atau 628123456789)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="08xxxxxxxxxx"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-hidden focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Isi Pesan WhatsApp
                  </label>
                  <textarea
                    rows={4}
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-hidden focus:border-emerald-500 resize-none font-sans"
                    required
                  />
                </div>

                {testResult && (
                  <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                    testResult.success ? "bg-emerald-950/50 border border-emerald-800 text-emerald-300" : "bg-rose-950/50 border border-rose-800 text-rose-300"
                  }`}>
                    {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                    <span>{testResult.message}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={testSending || currentStatus !== "READY"}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {testSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Pesan WhatsApp Test</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/60 text-xs text-slate-400 flex items-center justify-between">
              <span>Status Pengiriman: {currentStatus === "READY" ? "Tersambung (Online)" : "Offline / Butuh Scan"}</span>
              <a href="/" target="_blank" className="text-emerald-400 hover:underline flex items-center gap-1">
                <span>Buka Website Booking</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Recent Bookings & Dispatch Table */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>Riwayat Pemesanan & Status Dispatch WhatsApp</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Daftar transaksi pemesanan terkini dan status pengiriman via whatsapp-web.js 1.34.7
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-slate-700 rounded-full text-slate-300">
              Total: {bookings.length} Booking
            </span>
          </div>

          {bookings.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              Belum ada data pemesanan baru. Silakan lakukan booking di halaman utama untuk menguji coba.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Pelanggan</th>
                    <th className="py-3 px-4">Layanan / Rute</th>
                    <th className="py-3 px-4">Tanggal & Pax</th>
                    <th className="py-3 px-4">Status Pemesanan</th>
                    <th className="py-3 px-4">WhatsApp Gateway Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {bookings.map((bk) => (
                    <tr key={bk.id || bk.bookingCode} className="hover:bg-slate-700/30 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        {bk.bookingCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{bk.customerName}</div>
                        <div className="text-slate-400 text-[11px]">{bk.customerPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-200">
                        {bk.selectedItemTitle}
                      </td>
                      <td className="py-3.5 px-4">
                        <div>{bk.bookingDate}</div>
                        <div className="text-slate-400 text-[11px]">{bk.passengerCount} Penumpang</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {bk.status || "PENDING"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {bk.whatsappDeliveryStatus?.dispatchedViaGateway ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Terkirim Otomatis
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            Manual wa.me Link
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
