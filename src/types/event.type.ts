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
