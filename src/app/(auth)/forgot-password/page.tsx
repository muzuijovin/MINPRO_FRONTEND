
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Connect this request to your password-reset API.
      // Do not display a success message until the backend responds.
      setError(
        "Password reset is not connected to the backend yet."
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-5rem)] flex-col bg-[#F7F9FC]">
      <section className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[378px] rounded-xl border border-[#E5EAF1] bg-white px-7 py-8 shadow-[0_4px_12px_rgba(16,33,59,0.06)]">
          <header className="mb-6 text-center">
            <h1 className="text-[18px] font-bold leading-7 tracking-tight text-[#172554]">
              Forgot Password?
            </h1>

            <p className="mt-1 text-[11px] leading-[17px] text-[#718096]">
              Enter your email address and we&apos;ll send you a link to
              <br className="hidden sm:block" /> reset your password.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[11px] font-semibold leading-4 text-[#172554]"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your registered email address"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={isLoading}
                className="h-9 w-full rounded-lg border border-[#E5EAF1] bg-white px-3 text-[11px] text-[#172554] outline-none transition placeholder:text-[#94A3B8] focus:border-[#E85D2A] focus:ring-2 focus:ring-[#E85D2A]/10 disabled:opacity-60"
              />
            </div>

            {error && (
              <p role="alert" className="text-xs text-red-600">
                {error}
              </p>
            )}

            {message && (
              <p
                role="status"
                className="text-xs text-green-700"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="h-[34px] w-full rounded-lg bg-[#E85D2A] text-[11px] font-semibold text-white transition-colors hover:bg-[#D94E20] focus:outline-none focus:ring-2 focus:ring-[#E85D2A]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

            <Link
              href="/login"
              className="flex min-h-7 items-center justify-center gap-1 text-[11px] font-medium text-[#475569] transition-colors hover:text-[#E85D2A]"
            >
              <span aria-hidden="true">←</span>
              <span>Back to Sign In</span>
            </Link>
          </form>
        </div>
      </section>
    </main>
  );
}
