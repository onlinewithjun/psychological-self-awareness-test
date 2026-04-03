import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {eyebrow ? <Badge>{eyebrow}</Badge> : null}
      <div className="space-y-3">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
