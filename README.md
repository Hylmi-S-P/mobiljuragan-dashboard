# MobilJuragan Web Dashboard

Aplikasi web dashboard admin dan staf operasional untuk **CV. Mobil Juragan Express Transport** di Merauke, Papua Selatan. Dashboard ini dirancang untuk monitoring armada kendaraan, pemrosesan antrean pemesanan (*booking queue*), konfirmasi tarif resmi, dan penanganan tiket Customer Care.

---

## 1. Arsitektur & Tech Stack

Dashboard dibangun dengan arsitektur frontend modern berbasis Server Components dan Client Components:

```text
┌───────────────────────────────────────────────────┐
│         Admin & Staff Web Dashboard               │
│     (Next.js 16 App Router + Tailwind CSS 4)      │
└─────────────────────────┬─────────────────────────┘
                          │
             HTTP REST API │ (NEXT_PUBLIC_API_URL)
                          ▼
┌───────────────────────────────────────────────────┐
│             MobilJuragan Backend API              │
│               (Express.js :4000)                  │
└───────────────────────────────────────────────────┘
```

### Spesifikasi Teknologi:
- **Framework Web**: Next.js 16 (App Router)
- **Library UI**: React 19
- **Bahasa Pemrograman**: TypeScript 5
- **Styling**: Tailwind CSS 4 (via `@tailwindcss/postcss`)
- **Linting & Code Quality**: ESLint 9

---

## 2. Struktur Direktori Kunci

Berikut adalah struktur file penting dalam aplikasi dashboard:

```text
mobiljuragan-dashboard/
├── app/
│   ├── layout.tsx           # Root layout, konfigurasi metadata, & font antarmuka
│   ├── page.tsx             # Halaman antarmuka beranda dashboard admin
│   └── globals.css          # Import Tailwind CSS 4 & styling global
├── public/
│   ├── next.svg             # Aset ikon dan logo Next.js
│   └── vercel.svg           # Aset visual pendukung
├── .env.example             # Template konfigurasi environment variable
├── next.config.ts           # Konfigurasi runtime Next.js
├── postcss.config.mjs       # Konfigurasi plugin PostCSS Tailwind 4
├── package.json             # Manifest dependency & skrip npm
└── tsconfig.json            # Konfigurasi compiler TypeScript
```

---

## 3. Prasyarat Sistem

- **Node.js**: Versi $\ge$ 20.x LTS
- **npm**: Versi $\ge$ 10.x
- **Backend API**: Layanan backend MobilJuragan aktif di port 4000 (lihat repositori `mobiljuragan-backend`).

---

## 4. Panduan Menjalankan

### Langkah 1: Install Dependencies
```bash
npm install
```

### Langkah 2: Konfigurasi Environment Variable
Salin template konfigurasi `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```
Pastikan variabel `NEXT_PUBLIC_API_URL` mengarah ke alamat backend:
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
```

### Langkah 3: Menjalankan Server Development
```bash
npm run dev
```
Dashboard akan aktif pada: `http://localhost:3000`.

### Langkah 4: Perintah Build & Quality Check
```bash
# Typecheck TypeScript
npm run typecheck

# Production build
npm run build

# Menjalankan hasil build production
npm run start

# Linter kode
npm run lint
```
