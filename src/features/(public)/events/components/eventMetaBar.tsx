import { FiRotateCcw } from "react-icons/fi";
import { HiChevronUpDown } from "react-icons/hi2";
import { SORT_OPTIONS } from "../constants/eventListData";
import { EventFilters } from "../hooks/useEventFilters";

type Props = {
  filters: EventFilters;
  setFilters: (next: Partial<EventFilters>) => void;
  totalEvents?: number;
  hasActiveFilter: boolean;
  onReset: () => void;
};

export function EventMetaBar({
  filters,
  setFilters,
  totalEvents,
  hasActiveFilter,
  onReset,
}: Props) {
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-12">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold leading-[26px] text-[#1a1c1c]">
          {totalEvents === undefined
            ? "Memuat event..."
            : `Menampilkan ${totalEvents} Acara Pilihan`}
        </h2>
        {hasActiveFilter && (
          <>
            <span className="size-1.5 rounded-full bg-[#e2bfb2]" />
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 text-[13px] font-medium text-primary underline"
            >
              <FiRotateCcw size={11} />
              Hapus Filter
            </button>
          </>
        )}
      </div>

      <label className="flex items-center gap-2">
        <span className="text-[13px] font-medium text-[#5a4137]">Urutkan:</span>
        <span className="relative">
          <select
            value={`${filters.sortBy}:${filters.order}`}
            onChange={(e) => {
              const [sortBy, order] = e.target.value.split(":") as [
                EventFilters["sortBy"],
                EventFilters["order"],
              ];
              setFilters({ sortBy, order });
            }}
            className="h-10 w-48 appearance-none rounded-lg bg-white pl-3.5 pr-8 text-sm font-semibold text-[#1a1c1c] shadow-[0_1px_1px_rgba(0,0,0,0.05)] outline-none focus:ring-2 focus:ring-primary/40"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <HiChevronUpDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#1a1c1c]" />
        </span>
      </label>
    </section>
  );
}
