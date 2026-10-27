'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { toast } from 'react-toastify';

type AccountType = 'CUSTOMER' | 'EO';

type ApiResponse = {
  message?: string;
  success?: boolean;
  errors?: Array<{ field?: string; message?: string }>;
  data?: unknown;
};

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<AccountType>('CUSTOMER');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!success) return;

    successTimer.current = setTimeout(() => {
      setSuccess('');
    }, 3000);

    return () => {
      if (successTimer.current) {
        clearTimeout(successTimer.current);
      }
    };
  }, [success]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const cleanUsername = username.trim();
    const cleanEmail = email.trim();
    const cleanReferralCode = referralCode.trim();

    if (cleanUsername.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (!/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      setError(
        'Password must include at least one number and one special character.',
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsSubmitting(true);

    try {
      const apiBaseUrl = (
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      ).replace(/\/$/, '');
      const payload: {
        username: string;
        email: string;
        password: string;
        role: AccountType;
        referralCode?: string;
      } = {
        username: cleanUsername,
        email: cleanEmail,
        password,
        role: accountType,
      };

      if (cleanReferralCode) {
        payload.referralCode = cleanReferralCode;
      }

      const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => ({}))) as ApiResponse;

      if (!response.ok) {
        const validationMessage = result.errors
          ?.map((item) => item.message)
          .filter(Boolean)
          .join(' ');

        const message =
          result.message ||
          validationMessage ||
          'Registration failed. Please try again.';
        setError(
          validationMessage && result.message === 'Validation failed'
            ? validationMessage
            : message,
        );
        return;
      }

      setSuccess(
        'Registration successful! Your Jovlen account has been created. You can now sign in.',
      );
      toast.success('Registrasi berhasil! Silakan masuk dengan akun barumu.');
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setReferralCode('');
      setAgreeTerms(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setAccountType('CUSTOMER');
    } catch {
      setError(
        'Could not connect to the server. Please make sure the backend is running and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    'h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm text-[#10213B] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#E85D2A] focus:ring-2 focus:ring-[#E85D2A]/10';

  const labelClass = 'mb-2 block text-xs font-medium leading-4 text-[#10213B]';

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col bg-[#FAFAFA]">
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-12">
        <section className="w-full max-w-[560px] rounded-xl border border-[#E5E7EB] bg-white px-6 py-8 shadow-[0_2px_12px_rgba(16,33,59,0.05)] sm:px-[49px] sm:py-10">
          <header className="mb-8 text-center">
            <h1 className="text-2xl font-semibold leading-8 tracking-tight text-[#10213B]">
              Join Jovlen
            </h1>
            <p className="mx-auto mt-2 max-w-[360px] text-sm leading-5 text-[#64748B]">
              Create your account to discover events and connect with event
              organizers.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset>
              <legend className={labelClass}>Account Type</legend>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border px-2 text-center text-xs transition ${accountType === 'CUSTOMER' ? 'border-[#E85D2A] bg-white text-[#10213B]' : 'border-[#E5E7EB] bg-white text-[#64748B] hover:border-[#CBD5E1]'}`}
                >
                  <input
                    type="radio"
                    name="accountType"
                    value="CUSTOMER"
                    checked={accountType === 'CUSTOMER'}
                    onChange={() => {
                      setAccountType('CUSTOMER');
                      setSuccess('');
                      setError('');

                      if (successTimer.current) {
                        clearTimeout(successTimer.current);
                        successTimer.current = null;
                      }
                    }}
                    className="h-3.5 w-3.5 accent-[#E85D2A]"
                  />
                  <span>Customer / Attendee</span>
                </label>
                <label
                  className={`flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border px-2 text-center text-xs transition ${accountType === 'EO' ? 'border-[#E85D2A] bg-white text-[#10213B]' : 'border-[#E5E7EB] bg-white text-[#64748B] hover:border-[#CBD5E1]'}`}
                >
                  <input
                    type="radio"
                    name="accountType"
                    value="EO"
                    checked={accountType === 'EO'}
                    onChange={() => {
                      setAccountType('EO');
                      setSuccess('');
                      setError('');

                      if (successTimer.current) {
                        clearTimeout(successTimer.current);
                        successTimer.current = null;
                      }
                    }}
                    className="h-3.5 w-3.5 accent-[#E85D2A]"
                  />
                  <span>Event Organizer (EO)</span>
                </label>
              </div>
            </fieldset>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="username" className={labelClass}>
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                minLength={3}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className={inputClass}
                required
              />
              <p className="mt-2 text-[11px] leading-4 text-[#94A3B8]">
                Username must be at least 3 characters.
              </p>
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={`${inputClass} pr-11`}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#94A3B8] hover:text-[#10213B]"
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
              <p className="mt-2 text-[11px] leading-4 text-[#94A3B8]">
                Must be at least 8 characters with 1 number and 1 special
                character.
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className={`${inputClass} pr-11`}
                  required
                />
                <button
                  type="button"
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                  aria-pressed={showConfirmPassword}
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#94A3B8] hover:text-[#10213B]"
                >
                  <EyeIcon visible={showConfirmPassword} />
                </button>
              </div>
            </div>

            {accountType === 'CUSTOMER' && (
              <div>
                <label htmlFor="referralCode" className={labelClass}>
                  Referral Code{' '}
                  <span className="font-normal text-[#94A3B8]">(Optional)</span>
                </label>
                <input
                  id="referralCode"
                  name="referralCode"
                  type="text"
                  autoComplete="off"
                  value={referralCode}
                  onChange={(event) => setReferralCode(event.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            <label className="flex cursor-pointer items-start gap-2 text-xs leading-5 text-[#64748B]">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={agreeTerms}
                onChange={(event) => setAgreeTerms(event.target.checked)}
                className="mt-1 h-3.5 w-3.5 shrink-0 accent-[#E85D2A]"
                required
              />
              <span>
                I agree to the{' '}
                <Link
                  href="/terms"
                  className="font-medium text-[#E85D2A] hover:underline"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="font-medium text-[#E85D2A] hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-xs leading-5 text-[#B91C1C]"
              >
                {error}
              </p>
            )}
            {success && (
              <div
                role="status"
                className="rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-3 text-xs leading-5 text-[#166534]"
              >
                <p>{success}</p>
                <p className="mt-1">
                  Continue to{' '}
                  <Link href="/login" className="font-semibold underline">
                    Sign In
                  </Link>
                  .
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center rounded-lg bg-[#E85D2A] px-4 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition hover:bg-[#D94F20] focus:outline-none focus:ring-2 focus:ring-[#E85D2A]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="pt-1 text-center text-xs leading-5 text-[#64748B]">
              Already have a Jovlen account?{' '}
              <Link
                href="/login"
                className="font-semibold text-[#E85D2A] hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}

function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-4 w-4"
    >
      {visible ? (
        <>
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M3 3l18 18" />
          <path d="M10.6 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a15.4 15.4 0 0 1-4.1 4.8" />
          <path d="M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7c1.5 0 2.8-.4 4-1" />
          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </>
      )}
    </svg>
  );
}
