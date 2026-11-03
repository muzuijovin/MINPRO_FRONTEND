import { EventItem, EventVoucher } from "./event.type";

// voucher di halaman Event Saya: semua voucher event (termasuk yang sudah tidak aktif)
export type OrganizerEventVoucher = EventVoucher & {
  isActive: boolean;
};

// satu item dari GET /events/organizer/me (event milik EO yang login)
export type OrganizerEvent = Omit<EventItem, "organizer" | "categories"> & {
  categoryId: string;
  categories: {
    id: string;
    name: string;
    slug: string;
    // parentId dipakai form edit untuk memilih kategori utama
    parentId: string | null;
  };
  eventVoucher: OrganizerEventVoucher[];
};

export type OrganizerEventTime = "all" | "upcoming" | "past";

// body PUT /events/:id (JSON, cover image belum bisa diganti dari BE)
export type UpdateEventBody = {
  categoryId: string;
  title: string;
  description: string;
  location: string;
  format: string;
  typePrice: string;
  price: number;
  quota: number;
  startsAt: string;
  endsAt: string;
};
