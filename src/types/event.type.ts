export type TypePrice = "FREE" | "PAID";

// bentuk satu item dari GET /events (include organizer & categories)
export type EventItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  format: string;
  typePrice: TypePrice;
  // Prisma Decimal dikirim sebagai string di JSON
  price: string | number;
  coverImageUrl: string;
  quota: number;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  organizer: {
    id: string;
    organizationName: string;
  };
  categories: {
    id: string;
    name: string;
    slug: string;
  };
};

// voucher yang masih berlaku, ikut di response GET /events/:slug
export type EventVoucher = {
  id: string;
  code: string;
  // Prisma Decimal dikirim sebagai string di JSON
  discountPercentage: string | number;
  quota: number;
  startAt: string;
  endAt: string;
};

// GET /events/:slug = EventItem + voucher aktif + ringkasan rating
export type EventDetail = EventItem & {
  eventVoucher: EventVoucher[];
  averageRating: number;
  totalReviews: number;
};

// meta pagination dari GET /events (beda dengan PaginationMeta umum: pakai totalEvents)
export type EventListMeta = {
  page: number;
  totalPage: number;
  limit: number;
  totalEvents: number;
};

export type EventSortBy = "startsAt" | "createdAt" | "price";
export type SortOrder = "asc" | "desc";
