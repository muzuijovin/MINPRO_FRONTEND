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

// meta pagination dari GET /events (beda dengan PaginationMeta umum: pakai totalEvents)
export type EventListMeta = {
  page: number;
  totalPage: number;
  limit: number;
  totalEvents: number;
};

export type EventSortBy = "startsAt" | "createdAt" | "price";
export type SortOrder = "asc" | "desc";
