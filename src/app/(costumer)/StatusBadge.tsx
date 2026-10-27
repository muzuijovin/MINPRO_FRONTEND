
import type { ReactNode } from 'react';

interface StatusBadgeProps {
  children: ReactNode;
  className?: string;
}

export default function StatusBadge({
  children,
  className = '',
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-bold ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
