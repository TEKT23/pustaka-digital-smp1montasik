# Frontend Development Plan: Pustaka Digital SMP 1 Montasik

Dokumen ini berisi panduan UI/UX dan arsitektur frontend untuk memandu proses pengembangan menggunakan Laravel Breeze (React + Inertia.js).

## 📌 1. Konsep Utama & Arsitektur UX
- **Target Pengguna Utama:** Operator Perpustakaan (Bukan siswa langsung).
- **Pendekatan UX:** Menggunakan sistem **"1 Komputer, 2 Tab"**. 
  - **Tab 1:** Selalu standby di Halaman Scanner (Kiosk Mode).
  - **Tab 2:** Halaman Admin Dashboard untuk memantau data.
- **Teknologi Frontend:** React.js, Inertia.js, Tailwind CSS (Bawaan Laravel Breeze).

---

## 🎨 2. Rincian Halaman & Komponen

### A. Halaman Scanner (Kiosk Mode)
**Route:** `/scanner`
**Fungsi:** Halaman khusus untuk menangkap input dari alat *barcode scanner*.
- **UI/UX:**
  - Tampilan *full-screen*, sangat bersih tanpa sidebar/navbar admin.
  - Terdapat logo sekolah dan jam digital berukuran besar.
  - Terdapat form input (bisa disembunyikan / dibuat transparan) yang memiliki atribut `autoFocus`. Jika fokus hilang (misal operator tidak sengaja klik bagian lain), buat fitur auto-focus kembali (bisa menggunakan *event listener* `click` pada document).
- **Alur Kerja (Flow):**
  1. Alat scan membaca barcode dan mengetik NIS + menekan *Enter* otomatis.
  2. Frontend menembak endpoint backend (misal: `POST /attendances`).
  3. **Jika Sukses:** Layar berkedip hijau, memutar suara `success.mp3`, menampilkan pop-up/kartu besar berisi Foto Siswa, Nama, dan Kelas, dengan teks "Selamat Datang!".
  4. **Jika Gagal (NIS tidak ditemukan):** Layar memunculkan warna merah, memutar suara `error.mp3`, dan menampilkan peringatan "Siswa tidak ditemukan".
  5. Setelah 3 detik, layar otomatis di-reset kembali ke state "Menunggu Scan...".

### B. Halaman Admin Dashboard
**Route:** `/dashboard`
**Fungsi:** Pusat informasi dan analitik ringkas.
- **Komponen UI:**
  - **Statistik Cepat (Top Cards):** Total Pengunjung Hari Ini, Total Pengunjung Minggu Ini.
  - **Grafik Kehadiran:** Menggunakan *library* seperti `recharts` atau `chart.js` untuk menampilkan grafik batang/garis pengunjung dalam sebulan.
  - **Leaderboard (Siswa Terajin):** Tabel kecil yang menampilkan Top 5 atau Top 10 siswa dengan kunjungan terbanyak bulan ini (Bisa menampilkan Avatar/Foto mini dan Nama).

### C. Halaman Manajemen Siswa
**Route:** `/students`
**Fungsi:** CRUD data siswa.
- **Komponen UI:**
  - **Action Bar:** Input pencarian (bisa mencari berdasarkan Nama atau NIS sekaligus), Dropdown Filter Kelas (misal: Kelas 7, 8, 9), dan Tombol "Tambah Siswa".
  - **Data Table:** Menampilkan kolom (Foto, NIS, Nama Lengkap, Kelas, Aksi).
  - **Modal Form:** Form pop-up (menggunakan Inertia Form helper) untuk Tambah/Edit siswa. Termasuk input file untuk upload foto siswa.

### D. Halaman Log Kehadiran
**Route:** `/attendances`
**Fungsi:** Memeriksa riwayat absen secara manual.
- **Komponen UI:**
  - **Data Table:** Menampilkan daftar log absen per hari ini secara default. (Kolom: Waktu Scan, NIS, Nama, Kelas).
  - Berguna jika admin perlu mengkonfirmasi jam masuk atau jika ingin melakukan *export* data ke depannya.

---

## 🛠️ 3. Aset yang Perlu Disiapkan (Tugas Developer)
1. **File Audio:** Cari/buat file `success.mp3` (bunyi 'ting' atau 'beep' konfirmasi) dan `error.mp3` (bunyi 'bip bip' cepat peringatan).
2. **Placeholder Image:** Siapkan gambar *avatar default* jika siswa belum memiliki foto di database.
3. **Komponen Reusable:**
   - Buat komponen `Card` untuk membungkus statistik.
   - Buat komponen `Modal` yang bisa dipanggil dari mana saja.
   - Buat komponen `Alert/Toast` untuk notifikasi sukses CRUD data.

---

## 🚀 4. Instruksi untuk AI Developer Selanjutnya
Jika Anda adalah AI yang diminta melanjutkan *task* ini:
1. Pastikan Anda mengatur *layout* utama terlebih dahulu (pisahkan layout untuk `/scanner` yang polos, dan layout `/dashboard` yang menggunakan Authenticated Layout bawaan Breeze).
2. Fokus kerjakan **Halaman Scanner** terlebih dahulu karena ini adalah inti utama (MVP) aplikasi sesuai tenggat waktu.
3. Jangan lupa sertakan properti `preserveScroll` dan `preserveState` pada Inertia saat melakukan pencarian di tabel data agar UX terasa interaktif seperti *Single Page Application* murni.
