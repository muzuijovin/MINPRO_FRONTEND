
import { referrals } from './referrals.data';
import StatusBadge from './StatusBadge';
import PaginationFooter from './PaginationFooter';

export default function ReferralHistoryTable() {
  return (
    <section className="rounded-2xl bg-white p-8 shadow-[0_8px_25px_rgba(25,49,89,0.035)]">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-[21px] font-extrabold">
            Referral History
          </h2>

          <span className="rounded-md bg-[#EAF0FC] px-2 py-1 text-[10px] font-bold text-[#425B86]">
            4 Friends Invited
          </span>
        </div>

        <p className="mt-1 text-[12px] text-[#71819A]">
          View referral-related point credits.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead className="bg-[#EEF3FF] text-[10px] font-bold uppercase tracking-[0.035em] text-[#71819A]">
            <tr>
              <th className="px-4 py-4">Referred Friend</th>
              <th className="px-4 py-4">Registration Date</th>
              <th className="px-4 py-4">Reward Earned</th>
              <th className="px-4 py-4 text-right">Reward Status</th>
            </tr>
          </thead>

          <tbody>
            {referrals.map((person) => (
              <tr
                key={person.name}
                className="border-b border-[#EDF1F8] last:border-0"
              >
                <td className="px-4 py-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E9F0FD] text-[10px] font-bold text-[#4E6690]">
                      {person.initials}
                    </span>

                    <span className="text-[12px] font-bold">
                      {person.name}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-5 text-[12px] text-[#71819A]">
                  {person.registeredAt}
                </td>

                <td
                  className={`px-4 py-5 text-[12px] font-bold ${
                    person.credited
                      ? 'text-[#169454]'
                      : 'text-[#8A99AE]'
                  }`}
                >
                  {person.reward}
                </td>

                <td className="px-4 py-5 text-right">
                  <StatusBadge
                    className={
                      person.credited
                        ? 'bg-[#DCFCEB] text-[#16864D]'
                        : 'bg-[#E8EDF7] text-[#60708C]'
                    }
                  >
                    {person.credited
                      ? 'REWARD CREDITED'
                      : 'PENDING'}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationFooter label="Showing 1–4 of 4 referrals" />
    </section>
  );
}
