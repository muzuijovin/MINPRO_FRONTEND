
import {
  pointLots,
  statusStyles,
} from './referrals.data';
import StatusBadge from './StatusBadge';
import PaginationFooter from './PaginationFooter';

export default function PointLotsTable() {
  return (
    <section className="rounded-2xl bg-white p-8 shadow-[0_8px_25px_rgba(25,49,89,0.035)]">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-[21px] font-extrabold">
            My Point Lots
          </h2>

          <span className="rounded-md bg-[#EAF0FC] px-2 py-1 text-[10px] font-bold text-[#425B86]">
            5 Records
          </span>
        </div>

        <p className="mt-1 text-[12px] text-[#71819A]">
          Each point credit expires 3 months after it is credited.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="bg-[#EEF3FF] text-[10px] font-bold uppercase tracking-[0.035em] text-[#71819A]">
            <tr>
              <th className="px-4 py-4">Lot Reference</th>
              <th className="px-4 py-4">Points Remaining</th>
              <th className="px-4 py-4">Credited Date</th>
              <th className="px-4 py-4">Expiration Date</th>
              <th className="px-4 py-4 text-right">Status</th>
            </tr>
          </thead>

          <tbody>
            {pointLots.map((lot) => (
              <tr
                key={lot.id}
                className="border-b border-[#EDF1F8] last:border-0"
              >
                <td className="px-4 py-5 text-[12px] font-bold">
                  ▧ Lot #{lot.id}
                </td>

                <td className="px-4 py-5">
                  <p className="text-[13px] font-bold">
                    {lot.points.toLocaleString('en-US')} pts
                  </p>

                  <p className="mt-1 text-[11px] text-[#71819A]">
                    {lot.description}
                  </p>
                </td>

                <td className="px-4 py-5 text-[12px] text-[#71819A]">
                  {lot.creditedAt}
                </td>

                <td className="px-4 py-5">
                  <div className="flex flex-wrap items-center gap-1">
                    <span
                      className={`text-[12px] font-bold ${
                        lot.expiresSoon
                          ? 'text-[#B75D35]'
                          : 'text-[#223654]'
                      }`}
                    >
                      {lot.expiresAt}
                    </span>

                    {lot.expiresSoon && (
                      <span className="rounded-full bg-[#FFF0E7] px-1.5 py-0.5 text-[9px] font-bold text-[#B65320]">
                        EXPIRES SOON
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-[11px] text-[#71819A]">
                    {lot.expiryNote}
                  </p>
                </td>

                <td className="px-4 py-5 text-right">
                  <StatusBadge className={statusStyles[lot.status]}>
                    {lot.status.replaceAll('_', ' ')}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationFooter label="Showing 1–5 of 5 point lots" />
    </section>
  );
}
