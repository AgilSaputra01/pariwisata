# Performance, Accessibility, Security, dan Admin Authentication

_(Bagian dari PRD — mencakup section asli #26, #27, #28, #29. Lihat [00-INDEX.md](./00-INDEX.md) untuk daftar lengkap dan aturan membaca dokumen ini.)_

---

# 26. Performance

Target:

```text
LCP < 2.5s
INP < 200ms
CLS < 0.1
```

Optimasi:

- Server Components;
- image optimization;
- responsive images;
- caching;
- static generation;
- ISR;
- database indexing;
- API caching;
- CDN.

---

# 27. Accessibility

Target minimal:

```text
WCAG 2.2 AA
```

Wajib:

- semantic HTML;
- keyboard navigation;
- focus states;
- accessible labels;
- alt text;
- sufficient contrast;
- screen reader support;
- form validation;
- error messaging.

---

# 28. Security

Wajib:

- environment variables;
- HTTPS;
- input validation;
- rate limiting;
- CSRF protection bila relevan;
- authentication;
- authorization;
- SQL injection protection;
- XSS protection;
- secure cookies;
- webhook verification;
- audit logs.

WhatsApp credentials:

```text
NEVER expose in frontend.
```

---

# 29. Admin Authentication

Admin menggunakan authentication terpisah.

Role:

```text
SUPER_ADMIN
ADMIN
OPERATOR
CONTENT_MANAGER
```

Permission harus berbasis role.

Contoh:

```text
SUPER_ADMIN
    ↓
All access

ADMIN
    ↓
Booking + Services

OPERATOR
    ↓
Booking

CONTENT_MANAGER
    ↓
Blog + SEO + Content
```


---


**Navigasi:** [← 08-ui-ux-dan-homepage.md](./08-ui-ux-dan-homepage.md) | [Index](./00-INDEX.md) | [10-notifikasi-analytics-conversion.md →](./10-notifikasi-analytics-conversion.md)
