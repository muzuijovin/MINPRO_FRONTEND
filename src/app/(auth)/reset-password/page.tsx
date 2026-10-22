
"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialCharacter = /[^A-Za-z0-9]/.test(newPassword);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!hasMinLength || !hasNumber || !hasSpecialCharacter) {
      setError(
        "Password must be at least 8 characters and include a number and a special character."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Reset password harus menggunakan token dari proses Forgot Password.
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setError(
        "Reset token is missing. Please request a new password reset link."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Ganti URL ini sesuai endpoint backend yang sebenarnya.
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to reset password. Please try again."
        );
      }

      window.location.href = "/login?reset=success";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-9rem)] items-center justify-center bg-[#F7F9FC] px-4 py-10 sm:px-6">
      <section className="w-full max-w-[420px] rounded-xl border border-[#E5EAF0] bg-white p-6 shadow-[0_4px_20px_-4px_rgba(16,33,59,0.10)] sm:p-7">
        {/* Card Header */}
        <header className="mb-6">
          <h1 className="text-[20px] font-bold leading-7 tracking-[-0.4px] text-[#172554]">
            Reset Your Password
          </h1>

          <p className="mt-1 text-[11px] leading-[17px] text-[#718096]">
            Create a new password to regain access to your Jovlen account.
          </p>
        </header>

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password Field */}
          <div>
            <label
              htmlFor="newPassword"
              className="mb-1.5 block text-[11px] font-semibold text-[#172554]"
            >
              New Password
            </label>

            <div className="flex h-9 items-center rounded-md border border-[#D7DFEA] bg-white px-2.5 transition-colors focus-within:border-[#E85D2A]">
              <input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Enter your new password"
                autoComplete="new-password"
                required
                className="h-full min-w-0 flex-1 bg-transparent text-xs text-[#172554] outline-none placeholder:text-[#9AABC2]"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((current) => !current)}
                aria-label={
                  showNewPassword ? "Hide new password" : "Show new password"
                }
                className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center text-[#8A9AB0] hover:text-[#172554]"
              >
                {showNewPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                    <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 9 7 9 7a15 15 0 01-3.1 3.8" />
                    <path d="M6.2 6.2C3.9 7.7 2 12 2 12s4 7 10 7a9.7 9.7 0 004.1-.9" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <p className="mt-1.5 text-[9px] leading-[13px] text-[#718096]">
              Use at least 8 characters, including a number and a special
              character.
            </p>
          </div>

          {/* Confirm New Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-[11px] font-semibold text-[#172554]"
            >
              Confirm New Password
            </label>

            <div className="flex h-9 items-center rounded-md border border-[#D7DFEA] bg-white px-2.5 transition-colors focus-within:border-[#E85D2A]">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm your new password"
                autoComplete="new-password"
                required
                className="h-full min-w-0 flex-1 bg-transparent text-xs text-[#172554] outline-none placeholder:text-[#9AABC2]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((current) => !current)
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center text-[#8A9AB0] hover:text-[#172554]"
              >
                {showConfirmPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                    <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 9 7 9 7a15 15 0 01-3.1 3.8" />
                    <path d="M6.2 6.2C3.9 7.7 2 12 2 12s4 7 10 7a9.7 9.7 0 004.1-.9" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600"
            >
              {error}
            </p>
          )}

          {/* Reset Password Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-[31px] w-full items-center justify-center rounded-md bg-[#E85D2A] px-4 text-[11px] font-semibold text-white transition-colors hover:bg-[#D94F20] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Resetting Password..." : "Reset Password"}
          </button>

          {/* Back to Sign In Link */}
          <div className="flex justify-center pt-1">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#475569] transition-colors hover:text-[#E85D2A]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-3 w-3"
                aria-hidden="true"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
