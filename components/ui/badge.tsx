import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-stroke/80 bg-white/65 px-3 py-1 text-xs font-medium text-muted-foreground shadow-[0_12px_24px_-20px_rgba(44,63,90,0.45)] backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}
