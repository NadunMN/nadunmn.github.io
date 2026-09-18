import { cn } from "@/lib/utils";

export function StatusDot({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("relative inline-flex h-2 w-2", className)}>
      <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-signal" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
    </span>
  );
}
