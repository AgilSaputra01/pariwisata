# Image Management, SEO URL, Sitemap, dan Robots

_(Bagian dari PRD — mencakup section asli #35, #36, #37, #38. Lihat [00-INDEX.md](./00-INDEX.md) untuk daftar lengkap dan aturan membaca dokumen ini.)_

---

# 35. Image Management

Admin dapat:

- upload;
- crop;
- compress;
- set alt text;
- set caption;
- set featured image.

File harus dioptimalkan untuk:

```text
WebP
AVIF
```

jika kompatibel dengan pipeline.

---

# 36. SEO URL Convention

Gunakan URL pendek dan deskriptif.

Benar:

```text
/fastboat/sanur-nusa-penida
/rental-mobil/bali
/destination/nusa-penida
/blog/cara-ke-nusa-penida
```

Hindari:

```text
/page?id=123
/service?product=456
```

---

# 37. Sitemap

Sitemap harus dibuat otomatis berdasarkan database.

Contoh:

```text
/services
/routes
/destinations
/blog
```

Hanya halaman:

```text
published
indexable
canonical
```

yang masuk sitemap.

---

# 38. Robots

Robots harus mencegah indexing area:

```text
/admin
/api
/private
```

Tetapi mengizinkan:

```text
/services
/routes
/destinations
/blog
```


---


**Navigasi:** [← 11-booking-tanpa-akun-dan-review.md](./11-booking-tanpa-akun-dan-review.md) | [Index](./00-INDEX.md) | [13-error-handling-deployment-caching-logging.md →](./13-error-handling-deployment-caching-logging.md)
