
import StatusBadge from './StatusBadge';

export default function PointsOverviewCard() {
  return (
    <div className="relative min-h-[320px] overflow-hidden rounded-2xl bg-white p-7 shadow-[0_8px_25px_rgba(25,49,89,0.035)] lg:col-span-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7B8CA5]">
          <span className="text-[#FF6B1A]">●</span>{' '}
          Points Overview
        </p>

        <StatusBadge className="bg-[#E0FBEA] text-[#218C53]">
          Active Balance
        </StatusBadge>
      </div>

      <p className="mt-2 text-[35px] font-extrabold leading-none tracking-tight">
        30,000
        <span className="ml-1 text-[19px] text-[#FF6B1A]">
          pts
        </span>
      </p>

      <p className="mt-2 text-[12px] text-[#71819A]">
        From active, non-expired point lots.
      </p>

      {/* Earliest Expiry */}
      <div className="mt-6 rounded-xl bg-[#EEF3FF] p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#71819A]">
            <span className="text-[#FF6B1A]">◷</span>{' '}
            Earliest Expiry
          </p>

          <span className="rounded-full bg-[#FFF0E7] px-2 py-1 text-[9px] font-bold text-[#B65320]">
            EXPIRES SOON
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[19px] font-extrabold">
              Nov 12, 2026
            </p>

            <p className="mt-1 text-[11px] text-[#697A96]">
              17 days remaining
            </p>
          </div>

          <div className="text-right">
            <p className="text-[13px] font-bold text-[#FF6B1A]">
              10,000 pts at risk
            </p>

            <p className="text-[10px] text-[#697A96]">
              Lot #PL-8831
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-[7px] overflow-hidden rounded-full bg-[#D8E0EF]">
          <div className="h-full w-[82%] rounded-full bg-[#FF6B1A]" />
        </div>

        <div className="mt-2 flex justify-between gap-2 text-[9px] text-[#697A96]">
          <span>
            Aug 12, 2026 – Nov 12, 2026 (92 days)
          </span>

          <span className="font-bold text-[#12294B]">
            82% elapsed
          </span>
        </div>
      </div>
    </div>
  );
}
