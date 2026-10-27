
interface PaginationFooterProps {
  label: string;
}

export default function PaginationFooter({
  label,
}: PaginationFooterProps) {
  return (
    <div className="flex min-h-[49px] items-center justify-between border-t border-[#DEE9FC]/60 pt-3 text-[11px] text-[#667895]">
      <span>{label}</span>

      <span
        aria-label="Page 1 of 1"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FF6B1A] bg-white text-xs font-semibold text-[#16304F]"
      >
        1
      </span>
    </div>
  );
}
