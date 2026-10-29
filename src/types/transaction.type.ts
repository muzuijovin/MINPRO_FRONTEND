export type TransactionStatus =
  | "WAITING_FOR_PAYMENT"
  | "WAITING_FOR_CONFIRMATION"
  | "PAID"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELLED";

export type PaymentDecision = "ACCEPTED" | "REJECTED";

// rekening EO dari GET /bank-accounts/events/:eventId
export type BankAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
};

// data event yang ikut di list & detail transaksi (eventSelect di BE)
export type TransactionEvent = {
  id: string;
  title: string;
  slug: string;
  location: string;
  coverImageUrl: string;
  startsAt: string | null;
  endsAt: string | null;
};

// Prisma Decimal dikirim sebagai string di JSON
type Money = string | number;

export type Transaction = {
  id: string;
  customerId: string;
  eventId: string;
  bankAccountId: string;
  eventVoucherId: string | null;
  userCouponId: string | null;
  quantity: number;
  ticketPrice: Money;
  transactionCode: string;
  subtotal: Money;
  voucherDiscount: Money;
  couponDiscount: Money;
  pointUsed: number;
  pointDiscount: Money;
  finalAmount: Money;
  status: TransactionStatus;
  paymentDeadline: string | null;
  confirmationDeadline: string | null;
  submittedProofAt: string | null;
  confirmedAt: string | null;
  rejectedAt: string | null;
  expiredAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
};

// item GET /transactions (customer)
export type TransactionListItem = Transaction & {
  events: TransactionEvent;
  _count: { tickets: number };
};

// item GET /transactions/organizer (EO), ada data pembeli
export type OrganizerTransactionListItem = TransactionListItem & {
  users: {
    id: string;
    username: string;
    email: string;
    customerProfile: { fullname: string } | null;
  };
};

export type PaymentProof = {
  id: string;
  storagePath: string;
  uploadedAt: string;
  reviewedAt: string | null;
  decision: "PENDING" | PaymentDecision;
};

export type Ticket = {
  id: string;
  status: "VALID" | "VOID";
  issuedAt: string;
};

// GET /transactions/:id
export type TransactionDetail = Transaction & {
  events: TransactionEvent & {
    organizer: { userId: string; organizationName: string };
  };
  bankEo: Omit<BankAccount, "id">;
  eventVoucher: { code: string; discountPercentage: Money } | null;
  coupons: { code: string; discountPercentage: Money } | null;
  paymentProofs: PaymentProof[];
  tickets: Ticket[];
};

export type TransactionListMeta = {
  page: number;
  totalPage: number;
  limit: number;
  totalTransactions: number;
};
