import type {
  AdminAccount,
  Booking,
  Driver,
  SupportTicket,
  TicketMessage,
  Vehicle,
} from "./types";

/* Seluruh nilai di berkas ini adalah data contoh untuk mengembangkan antarmuka.
   Nominal tarif sengaja dibiarkan null supaya tidak ada harga karangan di kode.
   Nama pelanggan mengikuti layar Hi-Fi; NIK, nomor telepon, dan alamat diganti
   placeholder karena datanya belum bisa diverifikasi (lihat DESIGN-NOTES.md). */

export const SAMPLE_DATA_LABEL = "Data contoh";
export const TARIFF_PENDING_NOTE = "Tarif dikonfirmasi tim MobilJuragan";
export const AMOUNT_PLACEHOLDER = "[nominal]";
export const PRIVATE_FIELD_PLACEHOLDER = "[data belum diverifikasi]";

/* Spesifikasi 9 unit diambil dari dokumen MASTER-SYSTEM-CONTEXT-AND-ARCHITECTURE bagian 1.C.
   Karena itu kolom kategori, transmisi, dan kursi di katalog kini berisi data asli, bukan penanda. */
export const VEHICLES: Vehicle[] = [
  { id: "v-01", name: "AVANZA G PUTIH", plate: "PS1692B", status: "tersedia", category: "MPV", transmission: "Manual", seats: 7, usage: "Keluarga, efisien BBM, mobilitas dalam kota", allowedModes: ["lepas_kunci", "dengan_supir"] },
  { id: "v-02", name: "FORTUNER VRZ TRD HITAM", plate: "B8833AKU", status: "disewa", category: "SUV Premium", transmission: "Automatic", seats: 7, usage: "Protokoler pejabat, tamu VIP Pemda", allowedModes: ["lepas_kunci", "dengan_supir"] },
  { id: "v-03", name: "HILUX G HITAM", plate: "PA8593GZ", status: "tersedia", category: "Pickup 4x4", transmission: "Manual", seats: 5, usage: "Rute berat, jalan lumpur, proyek Trans Papua", allowedModes: ["dengan_supir"] },
  { id: "v-04", name: "INNOVA REBORN G HITAM", plate: "PA1504G", status: "disewa", category: "Medium MPV", transmission: "Automatic", seats: 7, usage: "Perjalanan dinas luar kota, kenyamanan tinggi", allowedModes: ["lepas_kunci", "dengan_supir"] },
  { id: "v-05", name: "PICKUP SUZUKI CARRY HITAM", plate: "B9762BAY", status: "servis", category: "Commercial", transmission: "Manual", seats: 3, usage: "Angkutan logistik pool, pindahan, barang", allowedModes: ["lepas_kunci"] },
  { id: "v-06", name: "RUSH G ALL NEW COKLAT", plate: "PA1696GG", status: "tersedia", category: "Compact SUV", transmission: "Manual", seats: 7, usage: "Perjalanan semi off-road, ground clearance tinggi", allowedModes: ["lepas_kunci", "dengan_supir"] },
  { id: "v-07", name: "TERIOS X HIJAU MATIC", plate: "B2534KRB", status: "tersedia", category: "Compact SUV", transmission: "Automatic", seats: 7, usage: "City tour lincah, santai matic", allowedModes: ["lepas_kunci", "dengan_supir"] },
  { id: "v-08", name: "VELOZ MERAH", plate: "PS1693B", status: "disewa", category: "MPV Modern", transmission: "Automatic", seats: 7, usage: "Modern styling, perjalanan keluarga", allowedModes: ["lepas_kunci", "dengan_supir"] },
  { id: "v-09", name: "XPANDER EXCEED HITAM", plate: "PS1691B", status: "tersedia", category: "MPV Nyaman", transmission: "Automatic", seats: 7, usage: "Suspensi empuk, perjalanan antar distrik", allowedModes: ["lepas_kunci", "dengan_supir"] },
];

export const BOOKINGS: Booking[] = [
  {
    id: "b-01",
    code: "BK-MRK-2609-00142",
    customerName: "Fransiskus Xaverius",
    customerContext: null,
    vehicleId: "v-01",
    mode: "lepas_kunci",
    startDate: "2026-09-19",
    endDate: "2026-09-21",
    dayCount: 3,
    status: "perlu_konfirmasi_tarif",
    serviceType: "Lepas Kunci Mandiri (Fisik di Pool)",
    pickupRoute: null,
    driverName: null,
    driverStatus: null,
    lineItems: [
      { id: "li-1", label: "Sewa lepas kunci (3 hari)", amount: null },
      { id: "li-2", label: "Layanan luar jam operasional (malam)", amount: null },
      { id: "li-3", label: "Deposit jaminan unit (dapat dikembalikan)", amount: null },
      { id: "li-4", label: "Diskon promo pelanggan baru", amount: null },
    ],
  },
  {
    id: "b-02",
    code: "BK-MRK-2609-00143",
    customerName: "Maria Kaize",
    customerContext: "PT Papua Agro",
    vehicleId: "v-03",
    mode: "dengan_supir",
    startDate: "2026-09-20",
    endDate: "2026-09-22",
    dayCount: 2,
    status: "perlu_alokasi_sopir",
    serviceType: "Dengan Supir (10 Jam/Hari)",
    pickupRoute: "Bandara Mopah - Muting",
    driverName: "Markus Gebze",
    driverStatus: "siaga",
    lineItems: [
      { id: "li-1", label: "Sewa Hilux G Hitam (2 hari)", amount: null },
      { id: "li-2", label: "Jasa supir Markus Gebze (2 hari)", amount: null },
      { id: "li-3", label: "Surcharge Trans Papua (Zona 2 Muting)", amount: null },
      { id: "li-4", label: "Uang makan & akomodasi supir", amount: null },
    ],
  },
  {
    id: "b-03",
    code: "BK-MRK-2609-00144",
    customerName: "Yohanes Mahuze",
    customerContext: null,
    vehicleId: "v-04",
    mode: "lepas_kunci",
    startDate: "2026-09-22",
    endDate: "2026-09-25",
    dayCount: 4,
    status: "tarif_terkonfirmasi",
    serviceType: "Lepas Kunci Mandiri (Fisik di Pool)",
    pickupRoute: null,
    driverName: null,
    driverStatus: null,
    lineItems: [
      { id: "li-1", label: "Sewa lepas kunci (4 hari)", amount: null },
      { id: "li-2", label: "Deposit jaminan unit (dapat dikembalikan)", amount: null },
    ],
  },
];

/* Nama supir mengikuti layar Hi-Fi; nomor kontak dan nomor SIM diganti placeholder
   karena belum bisa diverifikasi. Rute dan status adalah keadaan penugasan sementara. */
export const DRIVERS: Driver[] = [
  { id: "d-01", label: "Markus Gebze", route: "dalam_kota", contact: null, licenseNumber: null, status: "sedang_tugas" },
  { id: "d-02", label: "Yohanes Mahuze", route: "luar_kota", contact: null, licenseNumber: null, status: "siaga" },
  { id: "d-03", label: "Agustinus Balagaise", route: "dalam_kota", contact: null, licenseNumber: null, status: "siaga" },
  { id: "d-04", label: "Bartho Kaize", route: "luar_kota", contact: null, licenseNumber: null, status: "libur" },
];

/* Nama staf mengikuti layar Hi-Fi. Username "AhmadAhmad" di Figma adalah salah ketik
   yang terduplikasi, jadi ditulis ulang sebagai "ahmad.rizky". */
export const ADMIN_ACCOUNTS: AdminAccount[] = [
  { id: "a-01", name: "Markus (Staf Pool)", username: "markus_pool", role: "staf_operasional", active: true },
  { id: "a-02", name: "Ahmad Rizky (Staf Pool)", username: "ahmad.rizky", role: "staf_operasional", active: true },
];

/* Tiket pertama memakai kata placeholder dari layar Hi-Fi. Tiket kedua memakai contoh
   skenario dari dokumen master bagian 6.B untuk memperlihatkan status eskalasi. */
export const SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "t-01",
    customerLabel: "Pelanggan",
    title: "Judul ticket customer",
    category: "Pertanyaan",
    status: "baru",
  },
  {
    id: "t-02",
    customerLabel: "Pelanggan",
    title: "Laporan ban bocor Trans Papua KM 12",
    category: "Kendala teknis lapangan",
    status: "eskalasi",
  },
];

export const TICKET_MESSAGES: TicketMessage[] = [];

/* Kategori penyesuaian biaya mengikuti rute nyata pada dokumen master bagian 1.B. */
export const SURCHARGE_CATEGORIES = [
  "Surcharge rute Sota (batas RI-PNG, sekitar 80 km)",
  "Surcharge rute Tanah Merah, Boven Digoel (Trans Papua, sekitar 450 km)",
  "Surcharge rute Kurik / Semangga (jalan tanah dan berbatu)",
  "Layanan luar jam operasional",
  "Denda keterlambatan pengembalian unit",
  "Kerusakan atau kehilangan perlengkapan",
];

export function vehicleById(id: string): Vehicle | undefined {
  return VEHICLES.find((vehicle) => vehicle.id === id);
}

export function bookingById(id: string): Booking | undefined {
  return BOOKINGS.find((booking) => booking.id === id);
}
