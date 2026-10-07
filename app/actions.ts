"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  apiAdminLogin,
  apiCreateAdminAccount,
  apiUpdateAdminAccount,
  apiDeleteAdminAccount,
  apiReplyToTicket,
  ApiError,
} from "@/lib/api";
import type { AdminRole } from "@/lib/types";

export type ActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string>;
};

/**
 * Server Action untuk proses Login Staf & Admin ke Dashboard.
 * Menggunakan kredensial Express API dan menyimpan token ke cookie sesi.
 */
export async function loginAction(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const username = (formData.get("username") as string)?.trim() || "";
  const password = (formData.get("password") as string)?.trim() || "";
  const rememberMe = formData.get("rememberMe") === "on";

  const errors: Record<string, string> = {};
  if (!username) errors.username = "Username atau nomor telepon wajib diisi.";
  if (!password) errors.password = "Kata sandi wajib diisi.";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  let token = "";
  try {
    const data = await apiAdminLogin(username, password, rememberMe);
    token = data.token;
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, message: err.message };
    }
    return {
      success: false,
      message: "Gagal terhubung ke server backend Express. Pastikan backend aktif.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // Tanpa pilihan ingat sesi, cookie dihapus saat browser ditutup.
    // JWT backend tetap kedaluwarsa setelah 1 jam meski cookie masih ada.
    ...(rememberMe ? { maxAge: 60 * 60 * 24 * 7 } : {}),
  });
  cookieStore.set("client_token", token, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    ...(rememberMe ? { maxAge: 60 * 60 * 24 * 7 } : {}),
  });

  redirect("/");
}

// Validasi minimal 8 karakter sandi disesuaikan dengan aturan bcrypt backend.
export async function createAdminAction(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const fullName = (formData.get("fullName") as string)?.trim() || "";
  const phoneNumber = (formData.get("phoneNumber") as string)?.trim() || "";
  const role = (formData.get("role") as AdminRole) || "staf_operasional";
  const password = (formData.get("password") as string)?.trim() || "";

  const errors: Record<string, string> = {};
  if (!fullName) errors.fullName = "Nama lengkap wajib diisi.";
  if (!phoneNumber) errors.phoneNumber = "Nomor telepon/kontak wajib diisi.";
  if (!password || password.length < 8) {
    errors.password = "Kata sandi minimal 8 karakter.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  try {
    await apiCreateAdminAccount({
      fullName,
      phoneNumber,
      role,
      password,
    });
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, message: err.message };
    }
    return { success: false, message: "Gagal membuat akun admin pada backend." };
  }

  revalidatePath("/admin");
  return { success: true, message: `Akun ${fullName} berhasil dibuat.` };
}

// Kata sandi bersifat opsional pada update; dikirim hanya jika staf memasukkan nilai baru.
export async function updateAdminAction(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("id") as string;
  const fullName = (formData.get("fullName") as string)?.trim();
  const phoneNumber = (formData.get("phoneNumber") as string)?.trim();
  const role = (formData.get("role") as AdminRole) || undefined;
  const password = (formData.get("password") as string)?.trim() || undefined;
  const activeVal = formData.get("active");
  const isActive = activeVal !== null ? activeVal === "true" : undefined;

  if (!id) {
    return { success: false, message: "ID akun tidak valid." };
  }

  try {
    await apiUpdateAdminAccount(id, {
      fullName,
      phoneNumber,
      role,
      password,
      isActive,
    });
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, message: err.message };
    }
    return { success: false, message: "Gagal memperbarui akun admin pada backend." };
  }

  revalidatePath("/admin");
  return { success: true, message: "Akun berhasil diperbarui." };
}

/**
 * Menghapus akun staf/admin.
 *
 * Dipakai langsung sebagai `action` pada form konfirmasi, sehingga menerima FormData
 * dan tidak memakai useActionState. Kegagalan dari backend (mis. akun masih terikat
 * pemesanan, atau merupakan admin aktif terakhir) dikembalikan sebagai pesan, bukan
 * dilempar, supaya halaman tetap bisa menampilkannya.
 */
export async function deleteAdminAction(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("id") as string;

  if (!id) {
    return { success: false, message: "ID akun tidak valid." };
  }

  let deletedName = "";
  try {
    const result = await apiDeleteAdminAccount(id);
    deletedName = result.fullName;
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, message: err.message };
    }
    return { success: false, message: "Gagal menghapus akun admin pada backend." };
  }

  revalidatePath("/admin");
  return { success: true, message: `Akun ${deletedName} berhasil dihapus.` };
}
/**
 * Mengirim balasan tim pada sebuah tiket customer care.
 *
 * Dipanggil dari Client Component lewat startTransition, bukan dari form, supaya UI bisa
 * menampilkan balasan lebih dulu lalu menariknya kembali kalau pengiriman gagal.
 * Kegagalan dikembalikan sebagai pesan, bukan dilempar.
 */
export async function replyToTicketAction(ticketId: string, body: string): Promise<ActionState> {
  if (!ticketId) {
    return { success: false, message: "Tiket tidak valid." };
  }
  if (!body.trim()) {
    return { success: false, message: "Balasan tidak boleh kosong." };
  }

  try {
    await apiReplyToTicket(ticketId, body.trim());
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, message: err.message };
    }
    return { success: false, message: "Balasan gagal dikirim ke backend." };
  }

  revalidatePath("/customer-care");
  return { success: true, message: "Balasan terkirim dan tersimpan pada tiket." };
}
// Menghapus cookie sesi staf/admin dan mengembalikan tampilan ke halaman masuk.
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  cookieStore.delete("client_token");
  redirect("/login");
}
