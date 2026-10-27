"use client";

import { axiosInstance } from "@/lib/axios-instance.lib";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ApiResponse } from "@/types/api-response.type";

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      // 1. Kirim email dan password ke backend
      const response = await axiosInstance.post<ApiResponse<{ username: string }>>("/auth/login", {
        email: email.trim(),
        password,
      });

      // 2. Cek ulang GET /auth/me supaya role di useAuthStore langsung terisi
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      // 3. Tampilkan pesan jika login berhasil
      toast.success(
        `Login berhasil! Selamat datang, ${response.data?.data?.username ?? ""}`.trim(),
      );

      // 4. Kembali ke halaman utama
      router.push("/");
      router.refresh();
    } catch (error: any) {
      // 5. Tampilkan pesan jika login gagal
      console.error("Login gagal:", error.response?.data || error.message);

      setError(
        error.response?.data?.message ||
          "Could not connect to the server. Please check your credentials.",
      );
    } finally {
      // 6. Aktifkan kembali tombol login
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col">
      {/* Login background */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#FAF8FF] px-5 py-10">
        {/* Ambient light effects */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-105 w-130 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F4DDF1]/40 blur-[100px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[15%] top-[20%] h-40 w-40 rounded-full bg-[#E8E3FF]/40 blur-[80px]"
        />

        {/* Login card */}
        <section className="relative z-10 w-full max-w-92 rounded-xl border border-[#EAE7F0] bg-white p-5 shadow-[0_4px_12px_-4px_rgba(16,33,59,0.16)]">
          {/* Header section */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold leading-7 tracking-[-0.4px] text-[#10213B]">
              Welcome Back
            </h1>

            <p className="mt-1 text-xs leading-5 text-[#796D69]">
              Sign in to your Jovlen account to continue.
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-medium text-[#10213B]"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-10 w-full rounded-md border border-[#F0EDEB] bg-white px-3 text-xs text-[#10213B] outline-none transition placeholder:text-[#D9B8AA] focus:border-[#E85D2A] focus:ring-2 focus:ring-[#E85D2A]/10"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-medium text-[#10213B]"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="h-10 w-full rounded-md border border-[#F0EDEB] bg-white px-3 pr-11 text-xs text-[#10213B] outline-none transition placeholder:text-[#D9B8AA] focus:border-[#E85D2A] focus:ring-2 focus:ring-[#E85D2A]/10"
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-[#8B817D] hover:text-[#10213B]"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 5.2A11 11 0 0 1 12 5c5 0 9 5 9 7a10 10 0 0 1-3.1 4.2" />
                      <path d="M6.2 6.2C3.9 7.7 3 10 3 12c0 2 4 7 9 7a10 10 0 0 0 3-.5" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Forgot password link */}
              <div className="mt-3 flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-medium text-[#59413A] transition-colors hover:text-[#E85D2A]"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
              >
                {error}
              </p>
            )}

            {/* Primary button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 w-full items-center justify-center rounded-md bg-[#E85D2A] text-sm font-semibold text-white transition-colors hover:bg-[#D94D1D] focus:outline-none focus:ring-2 focus:ring-[#E85D2A]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>

            {/* Create account link */}
            <p className="flex flex-wrap items-center justify-center gap-1 pt-1 text-center text-[11px] leading-5 text-[#59413A]">
              <span>Don't have a Jovlen account?</span>
              <Link
                href="/register"
                className="font-semibold text-[#A83300] transition-colors hover:text-[#E85D2A]"
              >
                Create Account
              </Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
