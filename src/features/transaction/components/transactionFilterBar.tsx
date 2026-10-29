"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { FiSearch } from "react-icons/fi";
import { STATUS_FILTER_OPTIONS } from "../constants/transactionStatus";
import { TransactionListFilters } from "../hooks/useTransactions";
import { focusRing } from "./transactionUi";

type Props = {
  filters: TransactionListFilters;
  setFilters: (next: Partial<TransactionListFilters>) => void;
  placeholder: string;
};

// search (kode transaksi / judul event) + chip status, dipakai list customer & EO
export function TransactionFilterBar({ filters, setFilters, placeholder }: Props) {
  const [keyword, setKeyword] = useState(filters.search);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setFilters({ search: value.trim(), page: 1 });
  }, 500);

  return (
    <div className="flex flex-col gap-3">
      <label className="flex h-11 items-center gap-2 rounded-lg bg-white px-4 shadow-[0_1px_1px_rgba(0,0,0,0.05)] focus-within:ring-2 focus-within:ring-primary/40 md:max-w-md">
        <FiSearch aria-hidden className="shrink-0 text-ink-muted" size={16} />
        <input
          type="search"
          aria-label="Cari transaksi"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            debouncedSearch(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted/80"
        />
      </label>

      <div role="group" aria-label="Filter status" className="flex flex-wrap gap-2">
        {STATUS_FILTER_OPTIONS.map((option) => {
          const active = filters.status === option.value;
          return (
            <button
              key={option.value || "all"}
              type="button"
              aria-pressed={active}
              onClick={() => setFilters({ status: option.value, page: 1 })}
              className={`flex min-h-9 cursor-pointer items-center rounded-full px-3.5 text-[13px] font-medium transition-colors ${focusRing} ${
                active ? "bg-ink text-white shadow-sm" : "bg-white text-ink-muted hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
