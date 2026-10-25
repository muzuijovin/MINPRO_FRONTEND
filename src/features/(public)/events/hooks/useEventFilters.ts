import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EventSortBy, SortOrder, TypePrice } from "@/types/event.type";

export type EventFilters = {
  search: string;
  location: string;
  category: string;
  typePrice: TypePrice | "";
  sortBy: EventSortBy;
  order: SortOrder;
  page: number;
};

const SORT_BY_VALUES: EventSortBy[] = ["startsAt", "createdAt", "price"];

// filter disimpan di URL (?search=&location=&category=...) supaya bisa di-share
// dan link dari navbar / search bar hero langsung kepake di halaman ini
export function useEventFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortBy = searchParams.get("sortBy") as EventSortBy;
  const typePrice = searchParams.get("typePrice");
  const page = Number(searchParams.get("page"));

  const filters: EventFilters = {
    search: searchParams.get("search") ?? "",
    location: searchParams.get("location") ?? "",
    category: searchParams.get("category") ?? "",
    typePrice: typePrice === "FREE" || typePrice === "PAID" ? typePrice : "",
    sortBy: SORT_BY_VALUES.includes(sortBy) ? sortBy : "startsAt",
    order: searchParams.get("order") === "desc" ? "desc" : "asc",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };

  // ganti filter apa pun -> balik ke page 1, kecuali yang diganti memang page nya
  const setFilters = (next: Partial<EventFilters>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(next).forEach(([key, value]) => {
      if (value === "" || value === undefined || value === null) params.delete(key);
      else params.set(key, String(value));
    });

    if (!("page" in next)) params.delete("page");
    if (params.get("page") === "1") params.delete("page");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const resetFilters = () => router.replace(pathname, { scroll: false });

  const hasActiveFilter = Boolean(
    filters.search || filters.location || filters.category || filters.typePrice,
  );

  return { filters, setFilters, resetFilters, hasActiveFilter };
}
