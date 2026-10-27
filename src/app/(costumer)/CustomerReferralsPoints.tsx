
import ReferralProgramCard from './ReferralProgramCard';
import PointsOverviewCard from './PointsOverviewCard';
import PointLotsTable from './PointLotsTable';
import ReferralHistoryTable from './ReferralHistoryTable';

export default function CustomerReferralsPoints() {
  return (
    <div className="mx-auto max-w-[1136px] space-y-9 py-6 font-sans text-[#12294B]">
      {/* Top Section */}
      <section className="grid gap-5 lg:grid-cols-12">
        <ReferralProgramCard />
        <PointsOverviewCard />
      </section>

      {/* My Point Lots */}
      <PointLotsTable />

      {/* Referral History */}
      <ReferralHistoryTable />
    </div>
  );
}
