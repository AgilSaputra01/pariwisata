# Booking System

_(Bagian dari PRD — mencakup section asli #7. Lihat [00-INDEX.md](./00-INDEX.md) untuk daftar lengkap dan aturan membaca dokumen ini.)_

---

# 7. Booking System

## 7.1 Booking Status

Booking menggunakan status:

```text
PENDING
CONTACTED
CONFIRMED
WAITING_PAYMENT
PAID
COMPLETED
CANCELLED
EXPIRED
```

## 7.2 Booking ID

Format:

```text
BK-YYYYMMDD-XXXX
```

Contoh:

```text
BK-20260916-0001
```

## 7.3 Booking Data

Minimal:

```text
id
booking_code
customer_name
customer_phone
service_id
route_id
booking_date
passenger_count
pickup_location
dropoff_location
schedule
notes
price
payment_status
booking_status
created_at
updated_at
```


---


**Navigasi:** [← 02-whatsapp-booking-gateway.md](./02-whatsapp-booking-gateway.md) | [Index](./00-INDEX.md) | [04-admin-dashboard-dan-cms.md →](./04-admin-dashboard-dan-cms.md)
