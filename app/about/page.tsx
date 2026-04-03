import { AlertTriangle, BookOpenText, ShieldCheck } from "lucide-react";

import { SectionHeading } from "@/components/site/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const principles = [
  {
    title: "不是诊断",
    body: "本工具仅用于自我认知与心理教育，不构成医学诊断、心理治疗或专业意见。",
    icon: ShieldCheck,
  },
  {
    title: "反标签化",
    body: "我们不会输出“你就是某种人”之类的结论。结果描述的是当前倾向与组合模式，不是永久定义。",
    icon: BookOpenText,
  },
  {
    title: "危机优先",
    body: "如果检测到高风险表达，系统不会继续输出普通测试结论，而会优先展示关怀提示和求助建议。",
    icon: AlertTriangle,
  },
];

export default function AboutPage() {
  return (
    <div className="section-space">
      <div className="container-shell space-y-10">
        <SectionHeading
          eyebrow="Step 1 · 产品方案总览"
          title="研究导向、反标签化、重解释与重安全边界。"
          description="向度的目标，是帮助普通用户更立体地理解自己当前的心理倾向与行为模式，而不是被一个人格类型粗暴概括。"
        />

        <div className="grid gap-4 md:grid-cols-3">
          {principles.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title}>
                <CardHeader>
                  <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(111,143,183,0.12)] text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.body}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <Card>
            <CardHeader>
              <CardTitle>Step 2 · 信息架构与主流程</CardTitle>
              <CardDescription>
                手机版优先，所有核心路径都先围绕手机单手浏览与稳定阅读设计。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
              <p>首页：解释产品定位与边界，建立信任。</p>
              <p>测试介绍页：说明方法、时长、结果结构与适用边界。</p>
              <p>开始测试页：提示免责声明、收集可选状态描述、做危机词识别。</p>
              <p>测试进行页：单题聚焦、进度清晰、低干扰、高可读。</p>
              <p>结果页：给出整体摘要、维度概览、组合解读与温和提醒。</p>
              <p>报告详情页：给出完整维度解释、情境建议、方法说明。</p>
              <p>关于页：公开方法、伦理边界、风险逻辑与免责声明。</p>
            </CardContent>
          </Card>

          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem value="method">
              <AccordionTrigger>Step 3 · 测评维度与题库草案</AccordionTrigger>
              <AccordionContent>
                题库围绕情绪波动、压力反应、关系模式、自我评价、决策风格、边界表达、行动启动、自我觉察 8
                个维度，共 32 题，每个维度 4 题，使用 1-5 Likert
                量表，并混合正向题与反向题。
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="scoring">
              <AccordionTrigger>Step 4 · 评分与报告结构</AccordionTrigger>
              <AccordionContent>
                先按维度做结构化计分，再把结果映射到受控解释模板，输出总览摘要、维度结果、组合解读、情境建议与温和提醒。若触发高风险表达，则不进入普通报告流程。
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="tech">
              <AccordionTrigger>Step 5 · 技术与响应式策略</AccordionTrigger>
              <AccordionContent>
                项目基于 Next.js App Router、TypeScript、Tailwind CSS、Recharts
                和本地存储实现。移动端优先设计信息层级与交互，再扩展到桌面大屏。
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="boundary">
              <AccordionTrigger>免责声明与风险边界</AccordionTrigger>
              <AccordionContent>
                如果你正在经历明显情绪危机、自伤或自杀想法、伤害他人的冲动、严重功能受损等情况，请不要把这类测评当作主要帮助来源，应尽快联系当地紧急援助、最近的医疗机构、可信任的人或专业支持。
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
