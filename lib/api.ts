import "server-only";
import { cookies } from "next/headers";
import type { AdminAccount, AdminRole } from "./types";

const API_BASE_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Mengembalikan undefined jika dipanggil di luar konteks request Next.js.
export async function getSessionToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("admin_token")?.value;
  } catch {
    return undefined;
  }
}

// Mendukung autentikasi via nomor telepon resmi maupun username.
export async function apiAdminLogin(usernameOrPhone: string, password: string, rememberMe = false) {
  const res = await fetch(`${API_BASE_URL}/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: usernameOrPhone,
      phoneNumber: usernameOrPhone,
      password,
      rememberMe,
    }),
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      json?.error?.code || "LOGIN_FAILED",
      json?.error?.message || "Nomor telepon/username atau kata sandi salah.",
      json?.error?.details,
    );
  }

  return json.data as {
    token: string;
    user: { id: string; fullName: string; phoneNumber: string; role: string };
  };
}

// Menyelaraskan enum role Prisma backend (ADMIN / STAFF) ke model peran dashboard.
function mapUserToAdminAccount(user: any): AdminAccount {
  const role: AdminRole = user.role === "ADMIN" ? "super_admin" : "staf_operasional";
  return {
    id: user.id,
    name: user.fullName,
    username: user.phoneNumber,
    role,
    active: Boolean(user.isActive),
  };
}

/*
 * Memuat daftar akun staf/admin dari Express.
 *
 * Sebelumnya fungsi ini diam-diam mengembalikan data contoh ketika backend tidak
 * terjangkau atau menolak permintaan. Cara itu menyembunyikan kegagalan: tabel tetap
 * terisi seolah semuanya normal, padahal datanya bukan dari database. Sekarang kegagalan
 * dilempar sebagai ApiError supaya halaman bisa menampilkan penyebabnya.
 */
export async function getAdminAccounts(): Promise<AdminAccount[]> {
  const token = await getSessionToken();

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/admin/users`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      json?.error?.code || "FETCH_ADMIN_ACCOUNTS_FAILED",
      json?.error?.message || "Gagal memuat daftar akun admin dari backend.",
    );
  }

  return Array.isArray(json?.data) ? json.data.map(mapUserToAdminAccount) : [];
}

export async function apiCreateAdminAccount(data: {
  fullName: string;
  phoneNumber: string;
  role: AdminRole;
  password: string;
}) {
  const token = await getSessionToken();
  const backendRole = data.role === "super_admin" ? "ADMIN" : "STAFF";

  const res = await fetch(`${API_BASE_URL}/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      role: backendRole,
      password: data.password,
    }),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      json?.error?.code || "CREATE_ADMIN_FAILED",
      json?.error?.message || "Gagal membuat akun admin.",
      json?.error?.details,
    );
  }

  return mapUserToAdminAccount(json.data);
}

export async function apiUpdateAdminAccount(
  id: string,
  data: {
    fullName?: string;
    phoneNumber?: string;
    role?: AdminRole;
    password?: string;
    isActive?: boolean;
  },
) {
  const token = await getSessionToken();
  const backendRole =
    data.role !== undefined ? (data.role === "super_admin" ? "ADMIN" : "STAFF") : undefined;

  const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      role: backendRole,
      password: data.password ? data.password : undefined,
      isActive: data.isActive,
    }),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      json?.error?.code || "UPDATE_ADMIN_FAILED",
      json?.error?.message || "Gagal memperbarui akun admin.",
      json?.error?.details,
    );
  }

  return mapUserToAdminAccount(json.data);
}
// Pesan dari backend sudah menjelaskan alasan penolakan (mis. akun masih terikat
// pemesanan atau merupakan admin aktif terakhir), jadi ApiError diteruskan apa adanya
// supaya Server Action bisa menampilkan sebabnya ke pengguna.
export async function apiDeleteAdminAccount(id: string) {
  const token = await getSessionToken();

  const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      json?.error?.code || "DELETE_ADMIN_FAILED",
      json?.error?.message || "Gagal menghapus akun admin.",
      json?.error?.details,
    );
  }

  return json.data as { id: string; fullName: string };
}
// Balasan tim pada tiket customer care. Endpoint mengubah status tiket menjadi
// menunggu pelanggan, jadi pemanggil perlu merevalidasi halaman terkait.
export async function apiReplyToTicket(ticketId: string, body: string) {
  const token = await getSessionToken();

  const res = await fetch(
    `${API_BASE_URL}/admin/tickets/${encodeURIComponent(ticketId)}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ body }),
    },
  );

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      json?.error?.code || "TICKET_REPLY_FAILED",
      json?.error?.message || "Gagal mengirim balasan tiket.",
      json?.error?.details,
    );
  }

  return json.data;
}
