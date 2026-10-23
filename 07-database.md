# Database

_(Bagian dari PRD — mencakup section asli #20, #21. Lihat [00-INDEX.md](./00-INDEX.md) untuk daftar lengkap dan aturan membaca dokumen ini.)_

---

# 20. Database

Recommended:

```text
PostgreSQL
```

ORM:

```text
Prisma
```

Core tables:

```text
users
admins
services
service_categories
routes
destinations
operators
schedules
bookings
booking_items
customers
payments
reviews
faqs
blog_posts
blog_categories
pages
media
seo_metadata
settings
whatsapp_logs
notifications
```

---

# 21. Relationship

Basic relationship:

```text
Category
   ↓
Service
   ↓
Route
   ↓
Schedule
   ↓
Booking
   ↓
Customer
```

Destination:

```text
Destination
   ↓
Services
   ↓
Routes
   ↓
Blog
```


---


**Navigasi:** [← 06-nextjs-architecture-dan-struktur-project.md](./06-nextjs-architecture-dan-struktur-project.md) | [Index](./00-INDEX.md) | [08-ui-ux-dan-homepage.md →](./08-ui-ux-dan-homepage.md)
