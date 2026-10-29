import { CategoryTree } from "@/types/category.type";

// warna per kategori induk supaya Running / Football / Esports gampang dibedakan
// semua warna solid lolos kontras 4.5:1 dengan teks putih
type CategoryColor = { solid: string; dot: string };

export const CATEGORY_COLORS: Record<string, CategoryColor> = {
  running: { solid: "bg-accent-text", dot: "bg-accent-text" },
  football: { solid: "bg-success-text", dot: "bg-success-text" },
  esports: { solid: "bg-indigo-700", dot: "bg-indigo-700" },
};

const DEFAULT_COLOR: CategoryColor = { solid: "bg-ink-muted", dot: "bg-ink-muted" };

// slug bisa parent ("running") atau sub category ("5k") -> cari parent nya
export function findParentCategory(slug: string | undefined, tree: CategoryTree[]) {
  if (!slug) return undefined;
  return tree.find(
    (p) => p.slug === slug || p.children.some((child) => child.slug === slug),
  );
}

export function getCategoryColor(slug: string | undefined, tree: CategoryTree[]) {
  const parent = findParentCategory(slug, tree);
  return CATEGORY_COLORS[parent?.slug ?? ""] ?? DEFAULT_COLOR;
}
