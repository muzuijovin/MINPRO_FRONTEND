'use client';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { ComponentType, useEffect } from 'react';

// Jeda sebelum user dialihkan ke landing page (ms)
const REDIRECT_DELAY = 3000;

export default function withAuthGuard<P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: string[],
) {
  return function AuthGuardComponent(props: P) {
    const router = useRouter();
    const { role } = useAuthStore();
    const isAuthorized = allowedRoles.includes(role);

    useEffect(() => {
      if (isAuthorized) return;

      const timer = setTimeout(() => router.replace('/'), REDIRECT_DELAY);
      return () => clearTimeout(timer);
    }, [isAuthorized, router]);

    if (!isAuthorized) {
      return (
        <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#FAF8FF] px-5 py-10">
          {/* Ambient light effects */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-105 w-130 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F4DDF1]/40 blur-[100px]"
          />

          <section className="relative z-10 w-full max-w-92 rounded-xl border border-[#EAE7F0] bg-white p-6 text-center shadow-[0_4px_12px_-4px_rgba(16,33,59,0.16)]">
            {/* Lock icon */}
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E85D2A]/10">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#E85D2A"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </div>

            <h1 className="text-xl font-semibold leading-7 tracking-[-0.4px] text-[#10213B]">
              Access Denied
            </h1>

            <p className="mt-2 text-xs leading-5 text-[#796D69]">
              You don&apos;t have permission to open this page. Redirecting you
              to the home page...
            </p>

            <button
              type="button"
              onClick={() => router.replace('/')}
              className="mt-6 h-11 w-full rounded-lg bg-[#E85D2A] text-sm font-semibold text-white transition-colors hover:bg-[#D94D1D] focus:outline-none focus:ring-2 focus:ring-[#E85D2A]/30 focus:ring-offset-2"
            >
              Back to Home
            </button>
          </section>
        </main>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
