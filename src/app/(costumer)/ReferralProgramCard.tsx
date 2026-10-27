
'use client';

import { useState } from 'react';
import StatusBadge from './StatusBadge';


export default function ReferralProgramCard() {
  const [copied, setCopied] = useState(false);

  async function handleCopyReferralCode() {
    try {
      await navigator.clipboard.writeText('JVLN-ALEX99');
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="relative flex min-h-[320px] flex-col overflow-hidden rounded-2xl bg-white p-8 shadow-[0_8px_25px_rgba(25,49,89,0.035)] lg:col-span-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7B8CA5]">
            <span className="text-[#FF6B1A]">●</span>{' '}
            Referral Program
          </p>

          <h2 className="text-[24px] font-extrabold tracking-tight">
            Invite Friends &amp; Earn Points
          </h2>

          <p className="mt-2 max-w-[610px] text-[13px] leading-relaxed text-[#71819A]">
            Earn 10,000 points for every successful referral.
            Your friend gets a discount coupon when registering
            with your code.
          </p>
        </div>

        <StatusBadge className="bg-[#E0FBEA] text-[#218C53]">
          Program Active
        </StatusBadge>
      </div>

      {/* Referral Code */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#EEF3FF] px-6 py-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7C8BA5]">
            Your Exclusive Code
          </p>

          <p className="mt-1 text-[19px] font-extrabold tracking-[0.04em]">
            JVLN-ALEX99
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyReferralCode}
          className="rounded-full bg-[#FF6B1A] px-5 py-2.5 text-[12px] font-bold text-white shadow-[0_5px_12px_rgba(255,107,26,0.18)] hover:bg-[#EB5C0A]"
        >
          {copied ? '✓ Copied!' : '▣ Copy Referral Code'}
        </button>
      </div>
    </div>
  );
}
