# Next.js Architecture dan Struktur Project

_(Bagian dari PRD — mencakup section asli #18, #19. Lihat [00-INDEX.md](./00-INDEX.md) untuk daftar lengkap dan aturan membaca dokumen ini.)_

---

# 18. Next.js Architecture

Teknologi utama:

```text
Next.js
TypeScript
Tailwind CSS
```

Gunakan:

```text
App Router
Server Components
Server Actions
Route Handlers
generateMetadata
next/image
next/font
```

Gunakan Client Components hanya ketika memang diperlukan.

---

# 19. Recommended Project Structure

```text
project/
│
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── services/
│   │   ├── routes/
│   │   ├── destinations/
│   │   ├── blog/
│   │   ├── booking/
│   │   └── contact/
│   │
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── bookings/
│   │   ├── content/
│   │   └── seo/
│   │
│   ├── api/
│   │   ├── bookings/
│   │   ├── whatsapp/
│   │   └── seo/
│   │
│   ├── sitemap.ts
│   ├── robots.ts
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   ├── booking/
│   ├── services/
│   ├── routes/
│   ├── seo/
│   └── navigation/
│
├── lib/
│   ├── db/
│   ├── whatsapp/
│   ├── seo/
│   ├── validation/
│   └── utils/
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   ├── images/
│   └── icons/
│
├── types/
│
├── hooks/
│
└── config/
```


---


**Navigasi:** [← 05-seo-strategy-dan-arsitektur.md](./05-seo-strategy-dan-arsitektur.md) | [Index](./00-INDEX.md) | [07-database.md →](./07-database.md)
