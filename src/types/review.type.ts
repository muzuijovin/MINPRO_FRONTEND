// satu item dari GET /reviews (include users & events)
export type EventReview = {
  id: string;
  customerId: string;
  eventId: string;
  rating: number;
  comment: string;
  createdAt: string;
  users?: {
    username: string;
    customerProfile: { fullname: string | null; avatarUrl: string | null } | null;
  };
  events?: { id: string; title: string; slug: string };
};

export type ReviewListMeta = {
  page: number;
  totalPage: number;
  limit: number;
  totalReviews: number;
  averageRating: number;
};
