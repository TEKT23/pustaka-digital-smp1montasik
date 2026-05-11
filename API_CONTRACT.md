# Spesifikasi Kontrak Data (API & Inertia Props)

Dokumen ini adalah referensi bagi Frontend Developer untuk mengetahui secara spesifik bentuk data (JSON) yang dikirimkan oleh Backend. 
Backend telah dioptimalkan agar **tidak mengirimkan data berlebih** (seperti `created_at`, `updated_at`, atau field sensitif lainnya), melainkan hanya data yang benar-benar dibutuhkan oleh UI.

---

## 1. API Endpoint: Scanner Kiosk
Digunakan untuk memproses scan barcode secara *real-time* menggunakan Axios/Fetch.

**Endpoint:** `POST /api/scan`
**Content-Type:** `application/json`

### Request Payload:
```json
{
    "nis": "1234567890" // String, required
}
```

### Response (Success - 200 OK):
Hanya mengirimkan id, nis, name, class, dan photo_url.
```json
{
    "success": true,
    "student": {
        "id": 1,
        "name": "Budi Santoso",
        "class": "8A",
        "address": "Jl. Raya Montasik No. 12",
        "photo_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=budi"
    },
    "message": "Selamat Datang, Budi Santoso!"
}
```

### Response (Error - 404 Not Found):
```json
{
    "success": false,
    "message": "Siswa tidak ditemukan!"
}
```

---

## 2. Inertia Page Props: Dashboard (`/dashboard`)
Data yang disuntikkan langsung sebagai *Props* ke komponen `Dashboard.jsx`.

**Props Structure:**
```typescript
interface DashboardProps {
    todayCount: number; // Total absen hari ini
    weekCount: number;  // Total absen minggu ini (ter-cache 10 menit)
    
    // Data untuk Chart (ter-cache 10 menit)
    chartData: Array<{
        date: string;   // Format YYYY-MM-DD
        count: number;  // Jumlah pengunjung di hari tersebut
    }>;

    // Leaderboard Top 5 (ter-cache 10 menit)
    leaderboard: Array<{
        id: number;
        name: string;
        class: string;
        attendances_count: number;
    }>;
}
```

---

## 3. Inertia Page Props: Manajemen Siswa (`/students`)
Data yang disuntikkan ke komponen `Students/Index.jsx`. Data dipaginasi (15 per halaman).

**Props Structure:**
```typescript
interface StudentsPageProps {
    filters: {
        search?: string; // Query pencarian aktif
        class?: string;  // Filter kelas aktif
    };
    students: {
        current_page: number;
        data: Array<{
            id: number;
            nis: string;
            name: string;
            class: string;
            address: string | null;
            photo_url: string | null;
        }>;
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
}
```

---

## 4. Inertia Page Props: Riwayat Kehadiran (`/attendances`)
Data yang disuntikkan ke komponen `Attendances/Index.jsx`. Data dipaginasi (15 per halaman).

**Props Structure:**
```typescript
interface AttendancesPageProps {
    attendances: {
        current_page: number;
        data: Array<{
            id: number;
            student_id: number;
            scanned_at: string; // Format Timestamp ISO
            student: {
                id: number;
                nis: string;
                name: string;
                class: string;
            }
        }>;
        // ... (metadata pagination standar Laravel/Inertia seperti di atas)
        total: number;
    };
}
```
