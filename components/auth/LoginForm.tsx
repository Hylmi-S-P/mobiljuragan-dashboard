"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const fieldId = useId();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (username.trim().length === 0) nextErrors.username = "Username akun wajib diisi.";
    if (password.trim().length === 0) nextErrors.password = "Kata sandi wajib diisi.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex h-full flex-col">
      <h1 className="text-2xl font-bold text-ink">Masuk ke Akun Anda</h1>
      <p className="mt-3 max-w-md text-meta text-ink-soft">
        Gunakan kredensial resmi staf untuk mengakses seluruh modul operasional.
      </p>

      <div className="mt-8 space-y-5">
        <div>
          <label htmlFor={`${fieldId}-username`} className="block text-meta font-medium text-ink">
            Username akun
          </label>
          <input
            id={`${fieldId}-username`}
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? `${fieldId}-username-error` : undefined}
            className="mt-2 h-12 w-full rounded-md border border-rule-strong bg-canvas px-3 text-body text-ink"
            placeholder="username.staf"
          />
          {errors.username ? (
            <p id={`${fieldId}-username-error`} className="mt-1 text-meta text-danger">
              {errors.username}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${fieldId}-password`} className="block text-meta font-medium text-ink">
            Kata sandi
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id={`${fieldId}-password`}
              name="password"
              type={passwordVisible ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? `${fieldId}-password-error` : undefined}
              className="h-12 min-w-0 flex-1 rounded-md border border-rule-strong bg-canvas px-3 text-body text-ink"
            />
            <Button
              variant="outline"
              onClick={() => setPasswordVisible((value) => !value)}
              aria-pressed={passwordVisible}
            >
              {passwordVisible ? "Sembunyikan" : "Tampilkan"}
            </Button>
          </div>
          {errors.password ? (
            <p id={`${fieldId}-password-error`} className="mt-1 text-meta text-danger">
              {errors.password}
            </p>
          ) : null}
        </div>
      </div>

      <Button type="submit" variant="confirm" size="md" className="mt-8 w-full">
        Masuk ke Dashboard
      </Button>

      <p className="mt-3 text-meta text-ink-soft">
        Autentikasi belum tersambung ke backend. Form ini memvalidasi isian lalu membuka dashboard,
        belum memeriksa kredensial sungguhan.
      </p>

      <p className="mt-auto pt-8 text-meta text-ink-soft">
        Hak Cipta &copy; 2026 CV. Mobil Juragan Express Transport
      </p>
    </form>
  );
}
