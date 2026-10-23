# Error Handling, Deployment, Caching, dan Logging

_(Bagian dari PRD — mencakup section asli #39, #40, #41, #42. Lihat [00-INDEX.md](./00-INDEX.md) untuk daftar lengkap dan aturan membaca dokumen ini.)_

---

# 39. Error Handling

Implementasikan:

```text
404
500
Network Error
Booking Error
WhatsApp Error
Payment Error
```

User harus mendapatkan pesan yang jelas.

Jangan:

```text
Something went wrong.
```

lalu manusia disuruh menebak apa yang salah.

Gunakan:

```text
Booking belum dapat diproses.
Data Anda tetap tersimpan. Silakan hubungi kami melalui WhatsApp.
```

---

# 40. Deployment

Recommended architecture:

```text
User
 ↓
CDN
 ↓
Next.js
 ↓
API
 ↓
PostgreSQL
 ↓
Redis
```

Jika menggunakan VPS:

```text
Nginx
 ↓
Next.js
 ↓
PostgreSQL
Redis
WhatsApp Service
```

Gunakan Docker untuk service yang memungkinkan.

---

# 41. Caching

Gunakan caching untuk:

- services;
- routes;
- destinations;
- blog;
- FAQ;
- settings.

Data booking harus menggunakan database transaction dan tidak boleh bergantung pada stale cache.

---

# 42. Logging

Log:

```text
HTTP requests
Booking
WhatsApp
Errors
Authentication
Admin activity
Webhook
```

Admin dapat melihat:

```text
timestamp
event
user
IP
status
metadata
```

Data sensitif tidak boleh dicatat secara sembarangan.


---


**Navigasi:** [← 12-image-url-sitemap-robots.md](./12-image-url-sitemap-robots.md) | [Index](./00-INDEX.md) | [14-seo-automation-dan-ai-content.md →](./14-seo-automation-dan-ai-content.md)
