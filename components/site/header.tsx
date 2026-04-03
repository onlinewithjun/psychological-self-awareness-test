import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/assessment", label: "开始测试" },
  { href: "/about", label: "方法与边界" },
  { href: "/history", label: "本机记录" },
];

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-white/60 bg-[rgba(244,247,250,0.84)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white/80 text-sm font-semibold text-foreground shadow-[0_18px_30px_-24px_rgba(33,53,84,0.48)]">
              向
            </span>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold tracking-[0.16em] text-foreground/90">
                向度
              </p>
              <p className="text-xs text-muted-foreground">Self-Insight Lab</p>
            </div>
          </Link>
          <Badge className="hidden sm:inline-flex">研究导向 · 非诊断工具</Badge>
        </div>

        <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 transition-colors hover:bg-white/80 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
