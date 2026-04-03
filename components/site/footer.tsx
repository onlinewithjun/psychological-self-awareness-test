import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/60 bg-[rgba(244,247,250,0.85)]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
          <div className="space-y-2">
            <p className="font-medium text-foreground">向度</p>
            <p className="max-w-2xl leading-7">
              一个研究导向、反标签化、强调解释与安全边界的心理自我认知
              MVP。结果仅用于自我认知与心理教育，不构成诊断、治疗或专业意见。
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-foreground">若你正处在明显危机中</p>
            <p className="leading-7">
              请暂停测试，尽快联系当地紧急援助、危机干预热线、可信任的人，或专业机构。
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/about" className="hover:text-foreground">
            关于与免责声明
          </Link>
          <Link href="/assessment" className="hover:text-foreground">
            测试说明
          </Link>
          <Link href="/history" className="hover:text-foreground">
            本机历史
          </Link>
        </div>
      </div>
    </footer>
  );
}
