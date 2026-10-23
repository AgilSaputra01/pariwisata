# INDEX — PRD Platform Layanan Transportasi Pariwisata (Pecahan Dokumen)

> **CATATAN UNTUK CODING AGENT / AI YANG MENGERJAKAN PROJECT INI**
>
> Dokumen PRD asli (satu file panjang) telah dipecah menjadi beberapa file markdown
> agar tidak ada requirement yang terlewat atau salah tafsir hanya karena membaca judul saja.
>
> **ATURAN WAJIB:**
> 1. **Baca SELURUH ISI setiap file**, bukan hanya judul/heading-nya. Banyak requirement
>    detail (format data, status enum, struktur folder, contoh pesan WhatsApp, dll)
>    berada di DALAM isi section, bukan di judul.
> 2. **Jangan mengubah, menyingkat, atau menafsirkan ulang** poin-poin requirement di
>    file-file ini. Isi setiap file adalah kutipan LANGSUNG dan UTUH dari PRD asli
>    (hanya dipecah per topik, tidak ada kata yang diubah).
> 3. **Baca file sesuai urutan nomor** di bawah ini sebelum mulai coding, agar konteks
>    antar bagian (mis. Booking System ↔ WhatsApp Gateway ↔ Admin Dashboard) tersambung.
> 4. Jika ada requirement yang tampak bertentangan atau kurang jelas, **jangan menebak**
>    — tandai sebagai pertanyaan terbuka, jangan diam-diam mengambil interpretasi sendiri.
> 5. File ini (INDEX) hanya berfungsi sebagai peta navigasi. Requirement yang mengikat
>    ada di masing-masing file bernomor di bawah.
>
> Total dokumen asli: 52 section, dipecah menjadi 19 file topik di bawah ini.

## Daftar File (baca berurutan)


01. [`00-ringkasan-dan-tujuan.md`](./00-ringkasan-dan-tujuan.md) — **Ringkasan Proyek, Tujuan, dan Target Pengguna** _(mencakup section asli #1, 2, 3)_
02. [`01-konsep-produk-dan-user-journey.md`](./01-konsep-produk-dan-user-journey.md) — **Konsep Produk dan User Journey** _(mencakup section asli #4, 5)_
03. [`02-whatsapp-booking-gateway.md`](./02-whatsapp-booking-gateway.md) — **WhatsApp Booking Gateway** _(mencakup section asli #6)_
04. [`03-booking-system.md`](./03-booking-system.md) — **Booking System** _(mencakup section asli #7)_
05. [`04-admin-dashboard-dan-cms.md`](./04-admin-dashboard-dan-cms.md) — **Admin Dashboard dan CMS** _(mencakup section asli #8, 9)_
06. [`05-seo-strategy-dan-arsitektur.md`](./05-seo-strategy-dan-arsitektur.md) — **SEO Strategy dan Arsitektur Teknis SEO** _(mencakup section asli #10, 11, 12, 13, 14, 15, 16, 17)_
07. [`06-nextjs-architecture-dan-struktur-project.md`](./06-nextjs-architecture-dan-struktur-project.md) — **Next.js Architecture dan Struktur Project** _(mencakup section asli #18, 19)_
08. [`07-database.md`](./07-database.md) — **Database** _(mencakup section asli #20, 21)_
09. [`08-ui-ux-dan-homepage.md`](./08-ui-ux-dan-homepage.md) — **UI/UX, Homepage, dan Search** _(mencakup section asli #22, 23, 24, 25)_
10. [`09-performance-accessibility-security.md`](./09-performance-accessibility-security.md) — **Performance, Accessibility, Security, dan Admin Authentication** _(mencakup section asli #26, 27, 28, 29)_
11. [`10-notifikasi-analytics-conversion.md`](./10-notifikasi-analytics-conversion.md) — **Notification, Analytics, dan Conversion Optimization** _(mencakup section asli #30, 31, 32)_
12. [`11-booking-tanpa-akun-dan-review.md`](./11-booking-tanpa-akun-dan-review.md) — **Booking Without Account dan Review System** _(mencakup section asli #33, 34)_
13. [`12-image-url-sitemap-robots.md`](./12-image-url-sitemap-robots.md) — **Image Management, SEO URL, Sitemap, dan Robots** _(mencakup section asli #35, 36, 37, 38)_
14. [`13-error-handling-deployment-caching-logging.md`](./13-error-handling-deployment-caching-logging.md) — **Error Handling, Deployment, Caching, dan Logging** _(mencakup section asli #39, 40, 41, 42)_
15. [`14-seo-automation-dan-ai-content.md`](./14-seo-automation-dan-ai-content.md) — **SEO Automation dan AI-Assisted Content** _(mencakup section asli #43, 44)_
16. [`15-recommended-stack.md`](./15-recommended-stack.md) — **Recommended Stack** _(mencakup section asli #45)_
17. [`16-development-phases-dan-mvp.md`](./16-development-phases-dan-mvp.md) — **Development Phases dan MVP** _(mencakup section asli #46, 47)_
18. [`17-kpi-dan-acceptance-criteria.md`](./17-kpi-dan-acceptance-criteria.md) — **KPI dan Acceptance Criteria** _(mencakup section asli #48, 49)_
19. [`18-prinsip-utama-dan-arsitektur-akhir.md`](./18-prinsip-utama-dan-arsitektur-akhir.md) — **Prinsip Utama Project dan Target Arsitektur Akhir** _(mencakup section asli #50, 51, 52)_


---

# PROJECT REQUIREMENTS DOCUMENT

## Platform Layanan Transportasi Pariwisata

### Mobil Rental & Fastboat Booking Berbasis Next.js + TypeScript + WhatsApp

**Versi:** 1.0
**Tanggal:** September 2026
**Status:** Draft / Development Specification

---
