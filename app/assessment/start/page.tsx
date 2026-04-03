import { IntakeForm } from "@/components/assessment/intake-form";
import { SectionHeading } from "@/components/site/section-heading";

export default function AssessmentStartPage() {
  return (
    <div className="section-space">
      <div className="container-shell space-y-8">
        <SectionHeading
          eyebrow="开始测试页"
          title="在进入故事前，再把边界说清楚一次。"
          description="如果你当前处在明显危机中，请先去更及时的支持资源。若只是希望更清楚地理解自己当前的倾向，可以从这里开始。"
        />
        <IntakeForm />
      </div>
    </div>
  );
}
