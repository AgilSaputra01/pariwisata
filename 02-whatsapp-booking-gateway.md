# WhatsApp Booking Gateway

_(Bagian dari PRD — mencakup section asli #6. Lihat [00-INDEX.md](./00-INDEX.md) untuk daftar lengkap dan aturan membaca dokumen ini.)_

---

# 6. WhatsApp Booking Gateway

WhatsApp menjadi salah satu channel utama booking.

## 6.1 Konsep

Website tidak memaksa user membuat akun hanya untuk melakukan booking.

Flow:

```text
Website
   ↓
Pilih layanan
   ↓
Isi booking
   ↓
Backend membuat booking
   ↓
Generate Booking ID
   ↓
Generate pesan WhatsApp
   ↓
WhatsApp
   ↓
Admin / Operator
```

Contoh pesan:

```text
Halo, saya ingin melakukan booking.

Booking ID:
BK-20260916-001

Nama:
John Doe

Layanan:
Fastboat Sanur → Nusa Penida

Tanggal:
20 September 2026

Jumlah Penumpang:
2

Pickup:
pelabuhan bangsal

Estimasi Budget:
Rp 500.000

Catatan:
Mohon informasi ketersediaan jadwal.
```

## 6.2 WhatsApp Integration

Sistem menggunakan alur pemesanan langsung:

### Mode 1 – WhatsApp Deep Link (Aktif & Utama)

Sistem menggunakan direct WhatsApp deep link murni:

```text
https://wa.me/6287761459651?text=...
```

Keuntungan:
- 100% stabil di semua perangkat (Android, iOS, Desktop) tanpa memerlukan server browser Puppeteer;
- Tidak ada biaya komputasi atau risiko sesi expired/LID WhatsApp Web;
- Konfirmasi langsung satu pintu ke WhatsApp Operator resmi.

### Catatan Arsitektur

Library WhatsApp JS (`whatsapp-web.js`) tidak digunakan dalam alur booking aktif; seluruh pemesanan dialihkan langsung melalui deep link `wa.me` resmi. Tanpa daftar harga tetap di website, pelanggan memasukkan Estimasi Budget dan Lokasi Penjemputan (form custom).


---


**Navigasi:** [← 01-konsep-produk-dan-user-journey.md](./01-konsep-produk-dan-user-journey.md) | [Index](./00-INDEX.md) | [03-booking-system.md →](./03-booking-system.md)
