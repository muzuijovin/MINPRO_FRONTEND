import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance.lib";
import { ApiResponse } from "@/types/api-response.type";
import { CategoryTree } from "@/types/category.type";

// GET /categories/tree -> parent beserta children nya
// queryKey sama di semua tempat supaya cache nya dipakai bersama (navbar, form create event, dll)
export function useCategoryTree() {
  return useQuery({
    queryKey: ["categories", "tree"],
    queryFn: async () => {
      const res =
        await axiosInstance.get<ApiResponse<CategoryTree[]>>("/categories/tree");
      return res?.data?.data;
    },
    // category jarang berubah, tidak perlu refetch tiap pindah halaman
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
