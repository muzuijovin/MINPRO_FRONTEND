export type SubCategory = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
};

// bentuk data dari GET /categories/tree -> parent beserta children nya
// contoh: { id, name: "Running", children: [{ name: "5K" }, { name: "10K" }] }
export type CategoryTree = SubCategory & {
  children: SubCategory[];
};
