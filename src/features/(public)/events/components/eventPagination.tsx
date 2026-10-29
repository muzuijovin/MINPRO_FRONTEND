import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { EventListMeta } from "@/types/event.type";

type Props = {
  meta: EventListMeta;
  onPageChange: (page: number) => void;
  // dipakai ulang di list transaksi -> "transaksi yang cocok"
  itemLabel?: string;
};

// pointer, fokus keyboard, dan state disabled yang sama untuk semua tombol pagination
const PAGE_BTN_STATE =
  "cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text disabled:cursor-not-allowed disabled:opacity-40";

// 1 2 3 ... 16  -> halaman pertama, terakhir, dan 1 halaman di kiri-kanan halaman aktif
function getPageItems(current: number, total: number): (number | "...")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 3) [2, 3].forEach((p) => pages.add(p));
  if (current >= total - 2) [total - 2, total - 1].forEach((p) => pages.add(p));

  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  return sorted.flatMap((page, i) =>
    i > 0 && page - sorted[i - 1] > 1 ? (["...", page] as const) : [page],
  );
}

export function EventPagination({ meta, onPageChange, itemLabel = "event" }: Props) {
  const { page, totalPage, limit, totalEvents } = meta;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalEvents);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-12">
      <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-4 shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:flex-row sm:justify-between">
        <p className="text-sm tabular-nums text-ink-muted">
          Menampilkan{" "}
          <strong className="font-bold text-ink">
            {from} - {to}
          </strong>{" "}
          dari <strong className="font-bold text-ink">{totalEvents}</strong>{" "}
          {itemLabel} yang cocok
        </p>

        {totalPage > 1 && (
          <nav aria-label="Pagination" className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Halaman sebelumnya"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className={`flex size-10 items-center justify-center rounded-lg bg-surface-muted text-ink ${PAGE_BTN_STATE}`}
            >
              <FiChevronLeft aria-hidden size={14} />
            </button>

            {getPageItems(page, totalPage).map((item, i) =>
              item === "..." ? (
                <span
                  key={`dots-${i}`}
                  aria-hidden
                  className="flex h-10 w-6 items-center justify-center text-sm text-ink-muted"
                >
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  aria-current={item === page ? "page" : undefined}
                  onClick={() => onPageChange(item)}
                  className={`flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm tabular-nums ${PAGE_BTN_STATE} ${
                    item === page
                      ? "bg-accent-text font-bold text-white shadow-sm"
                      : "font-medium text-ink hover:bg-surface-muted"
                  }`}
                >
                  {item}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={page >= totalPage}
              onClick={() => onPageChange(page + 1)}
              className={`flex h-10 items-center gap-1 rounded-lg bg-surface-muted px-3 text-sm font-semibold text-ink ${PAGE_BTN_STATE}`}
            >
              Selanjutnya
              <FiChevronRight aria-hidden size={14} />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
