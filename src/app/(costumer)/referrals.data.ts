
export type LotStatus =
  | 'AVAILABLE'
  | 'PARTIALLY_USED'
  | 'FULLY_USED'
  | 'EXPIRED';

export interface PointLot {
  id: string;
  points: number;
  description: string;
  creditedAt: string;
  expiresAt: string;
  expiryNote: string;
  status: LotStatus;
  expiresSoon?: boolean;
}

export interface Referral {
  initials: string;
  name: string;
  registeredAt: string;
  reward: string;
  credited: boolean;
}

export const pointLots: PointLot[] = [
  {
    id: 'PL-8831',
    points: 10000,
    description: 'Full balance active',
    creditedAt: 'Aug 12, 2026',
    expiresAt: 'Nov 12, 2026',
    expiryNote: '17 days remaining (3 months cycle)',
    status: 'AVAILABLE',
    expiresSoon: true,
  },
  {
    id: 'PL-8742',
    points: 6000,
    description: '4,000 pts used of 10,000',
    creditedAt: 'Sep 03, 2026',
    expiresAt: 'Dec 03, 2026',
    expiryNote: '3 months cycle',
    status: 'PARTIALLY_USED',
  },
  {
    id: 'PL-8420',
    points: 14000,
    description: 'Full balance active',
    creditedAt: 'Oct 18, 2026',
    expiresAt: 'Jan 18, 2027',
    expiryNote: '3 months cycle',
    status: 'AVAILABLE',
  },
  {
    id: 'PL-8105',
    points: 0,
    description: 'Balance consumed',
    creditedAt: 'Jul 01, 2026',
    expiresAt: 'Oct 01, 2026',
    expiryNote: 'Fully redeemed Sep 14, 2026',
    status: 'FULLY_USED',
  },
  {
    id: 'PL-7910',
    points: 0,
    description: 'Balance expired',
    creditedAt: 'May 05, 2026',
    expiresAt: 'Aug 05, 2026',
    expiryNote: 'Expired',
    status: 'EXPIRED',
  },
];

export const referrals: Referral[] = [
  {
    initials: 'DS',
    name: 'Dimas Satrio',
    registeredAt: 'Aug 12, 2026',
    reward: '+10,000 pts',
    credited: true,
  },
  {
    initials: 'SJ',
    name: 'Sarah Jenkins',
    registeredAt: 'Sep 03, 2026',
    reward: '+10,000 pts',
    credited: true,
  },
  {
    initials: 'BU',
    name: 'Budi Utomo',
    registeredAt: 'Oct 18, 2026',
    reward: '+10,000 pts',
    credited: true,
  },
  {
    initials: 'MP',
    name: 'Maya Putri',
    registeredAt: 'Oct 22, 2026',
    reward: '— (Pending)',
    credited: false,
  },
];

export const statusStyles: Record<LotStatus, string> = {
  AVAILABLE: 'bg-[#DCFCEB] text-[#16864D]',
  PARTIALLY_USED: 'bg-[#E0E9FF] text-[#365A9E]',
  FULLY_USED: 'bg-[#E8EDF7] text-[#60708C]',
  EXPIRED: 'bg-[#E8EDF7] text-[#60708C]',
};
