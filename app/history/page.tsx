import { HistoryView } from "@/components/assessment/history-view";
import { SectionHeading } from "@/components/site/section-heading";

export default function HistoryPage() {
  return (
    <div className="section-space">
      <div className="container-shell space-y-8">
        <SectionHeading
          eyebrow="可选增强 · 本机历史"
          title="同一个人，也会在不同阶段呈现不同的自己。"
          description="这里展示的是保存在当前浏览器中的匿名结果记录。它更适合帮助你看变化，而不是寻找某种固定人格。"
        />
        <HistoryView />
      </div>
    </div>
  );
}
