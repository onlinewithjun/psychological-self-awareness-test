import { cn } from "@/lib/utils";

type ProgressProps = {
  value: number;
  className?: string;
};

export function Progress({ value, className }: ProgressProps) {
  return (
    <div
      className={cn(
        "h-2.5 w-full overflow-hidden rounded-full bg-[rgba(134,149,173,0.15)]",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent to-accent-soft transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
