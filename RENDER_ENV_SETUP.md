# 🚀 Render Production Environment Variables

Gunakan list di bawah ini untuk mengisi bagian **Environment Variables** pada dashboard Render saat melakukan deployment.

### 1. App Configuration
| Key | Value | Note |
|-----|-------|------|
| `APP_NAME` | `Pustaka SMP 1 Montasik` | Nama aplikasi |
| `APP_ENV` | `production` | Wajib set ke production |
| `APP_KEY` | `base64:JcLZPHZ1Zhsioz78MgLOfSryO36asxKd/oyIGo5mu9g=` | Dari file .env lokal |
| `APP_DEBUG` | `false` | Matikan debug di production |
| `APP_URL` | `https://nama-aplikasi-anda.onrender.com` | Ganti dengan URL dari Render nanti |
| `LOG_CHANNEL` | `stderr` | Agar log muncul di dashboard Render |

### 2. Database (Supabase)
| Key | Value |
|-----|-------|
| `DB_CONNECTION` | `pgsql` |
| `DB_HOST` | `db.wtmeaejoqrecxrowmycx.supabase.co` |
| `DB_PORT` | `5432` |
| `DB_DATABASE` | `postgres` |
| `DB_USERNAME` | `postgres` |
| `DB_PASSWORD` | `smp1montasik` |

### 3. Redis (Upstash)
| Key | Value |
|-----|-------|
| `SESSION_DRIVER` | `redis` |
| `CACHE_STORE` | `redis` |
| `QUEUE_CONNECTION` | `redis` |
| `REDIS_CLIENT` | `predis` |
| `REDIS_HOST` | `trusting-kid-121085.upstash.io` |
| `REDIS_PORT` | `6379` |
| `REDIS_PASSWORD` | `gQAAAAAAAdJ9AAIgcDJiNTY3NzkzZTdiMDMBOGY3Yjg1ZjQ0MTI5MDUxNmRkNg` |
| `REDIS_SCHEME` | `tls` |

---

### Langkah Tambahan di Render:
1. Pastikan **Runtime** dipilih sebagai **Docker**.
2. Masukkan semua variabel di atas di menu **Environment**.
3. Klik **Deploy** dan tunggu proses build selesai.
