# SEO Strategy dan Arsitektur Teknis SEO

_(Bagian dari PRD — mencakup section asli #10, #11, #12, #13, #14, #15, #16, #17. Lihat [00-INDEX.md](./00-INDEX.md) untuk daftar lengkap dan aturan membaca dokumen ini.)_

---

# 10. SEO Strategy

SEO merupakan salah satu komponen utama proyek.

Website tidak boleh hanya mengandalkan:

```html
<title>...</title>
<meta name="description">
```

SEO harus dibangun dari arsitektur website.

---

# 11. SEO Technical Architecture

Next.js harus memanfaatkan:

- Metadata API;
- Dynamic Metadata;
- `generateMetadata()`;
- Sitemap;
- Robots;
- Canonical URL;
- Open Graph;
- Twitter Card;
- JSON-LD;
- Breadcrumb Schema;
- FAQ Schema;
- LocalBusiness Schema;
- Product/Service Schema;
- Article Schema;
- Organization Schema.

---

# 12. Programmatic SEO

Website harus dapat menghasilkan halaman SEO berdasarkan database.

Contoh:

```text
/rental-mobil-bali
/rental-mobil-bali-dengan-driver
/airport-transfer-bali
/fastboat-sanur-nusa-penida
/fastboat-sanur-nusa-lembongan
/fastboat-padang-bai-gili-trawangan
```

Struktur:

```text
/services/[slug]
/routes/[slug]
/destinations/[slug]
/blog/[slug]
```

Halaman harus memiliki konten unik.

Jangan membuat ribuan halaman dengan konten identik hanya mengganti nama lokasi. Google juga sudah cukup banyak melihat trik murahan umat manusia.

---

# 13. SEO Content Engine

Setiap layanan memiliki:

```text
SEO Title
SEO Description
H1
Intro
Content
FAQ
Related Services
Related Routes
Related Destinations
Image Alt
Canonical
Schema
```

Admin dapat mengatur SEO secara manual.

Jika kosong:

```text
System generates SEO metadata automatically.
```

Contoh:

```text
Service:
Fastboat Sanur Nusa Penida

Generated title:
Fastboat Sanur ke Nusa Penida | Jadwal & Booking

Generated description:
Temukan jadwal fastboat Sanur ke Nusa Penida...
```

Admin tetap dapat override hasil otomatis.

---

# 14. Internal Linking

Setiap halaman harus memiliki hubungan dengan halaman lain.

Contoh:

```text
Fastboat Sanur
      ↓
Nusa Penida
      ↓
Hotel Nusa Penida
      ↓
Transport Nusa Penida
      ↓
Fastboat Nusa Penida
```

Related content otomatis dibuat berdasarkan:

- destination;
- service category;
- route;
- tags.

---

# 15. Blog / Travel Guide

Blog bukan sekadar tempat menaruh artikel supaya kelihatan rajin.

Blog harus menjadi **SEO acquisition channel**.

Kategori:

```text
Bali Travel Guide
Nusa Penida Guide
Nusa Lembongan Guide
Lombok Guide
Transportation
Fastboat Guide
Car Rental Guide
Travel Tips
```

Contoh artikel:

```text
Cara Memilih Fastboat dari Sanur ke Nusa Penida
Berapa Lama Perjalanan Sanur ke Nusa Penida?
Cara Sewa Mobil di Bali dengan Driver
Transportasi dari Bandara Ngurah Rai ke Ubud
```

Artikel harus terhubung ke layanan yang relevan.

---

# 16. Local SEO

Website harus memiliki informasi bisnis:

```text
Business Name
Address
Phone
WhatsApp
Email
Opening Hours
Service Area
Google Maps
Social Media
```

Gunakan:

```text
Organization
LocalBusiness
Service
FAQPage
BreadcrumbList
```

sesuai konteks halaman dan data yang benar-benar tersedia.

Jangan memasukkan schema palsu hanya karena SEO guru TikTok bilang "JSON-LD = ranking". Schema membantu mesin memahami konten, bukan mesin slot SEO.

---

# 17. Technical SEO

Wajib:

- HTTPS;
- canonical URL;
- sitemap.xml;
- robots.txt;
- clean URL;
- 301 redirect;
- 404 page;
- 410 handling bila diperlukan;
- optimized images;
- lazy loading;
- responsive design;
- Core Web Vitals;
- semantic HTML;
- accessible navigation;
- optimized fonts;
- minimized JavaScript;
- caching;
- compression.


---


**Navigasi:** [← 04-admin-dashboard-dan-cms.md](./04-admin-dashboard-dan-cms.md) | [Index](./00-INDEX.md) | [06-nextjs-architecture-dan-struktur-project.md →](./06-nextjs-architecture-dan-struktur-project.md)
