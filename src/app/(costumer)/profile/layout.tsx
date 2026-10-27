import type { ReactNode } from 'react';
import CustomerNavbar from '../CustomerNavbar';
import ProfileTabs from '../ProfileTabs';

export default function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#F6F8FF] text-[#102544]">
      {/* Hapus baris berikut jika navbar sudah
          dipasang pada (customer)/layout.tsx */}
      <CustomerNavbar />

      {/* My Account Content */}
      <div className="mx-auto max-w-[1280px] px-5 py-6 md:px-6">
        <div className="mb-2 text-[11px] text-[#52688C]">
          Home <span className="mx-1">›</span>{' '}
          <span className="font-semibold text-[#102544]">
            My Account
          </span>
        </div>

        <div className="mb-5">
          <h1 className="flex flex-wrap items-center gap-2 text-2xl font-bold tracking-tight">
            My Account
            <span className="rounded bg-[#102544] px-2 py-1 text-[9px] font-semibold text-white">
              CUSTOMER
            </span>
          </h1>

          <p className="mt-1 text-xs text-[#52688C]">
            Manage your profile, referral points, coupons, and security
            settings.
          </p>
        </div>

        {/* Profile Tabs */}
        <ProfileTabs />

        {/* Isi halaman sesuai tab aktif */}
        {children}
      </div>
    </main>
  );
}
