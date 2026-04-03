import Link from "next/link";
import { ArrowLeft, HeartHandshake, PhoneCall } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SupportPage() {
  return (
    <div className="section-space">
      <div className="container-shell max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(216,121,121,0.14)] text-[rgb(168,83,83)]">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <CardTitle>先暂停测试，先把安全放在前面。</CardTitle>
            <CardDescription>
              我们检测到你填写的内容里可能包含明显风险信号，因此不会继续展示普通测试结论。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 text-sm leading-7 text-muted-foreground">
            <p>
              如果你正在想着伤害自己、伤害他人，或感觉已经无法保证自己的安全，请尽快联系当地紧急援助、危机干预热线、最近的医疗机构，或让可信任的人现在就陪在你身边。
            </p>
            <div className="rounded-[24px] border border-stroke bg-white/70 p-4">
              <p className="font-medium text-foreground">可以优先做这几件事：</p>
              <ul className="mt-3 space-y-2">
                <li>把自己带到更安全、有人在场的环境里。</li>
                <li>联系一位可信任的人，明确告诉对方你现在需要陪伴或帮助。</li>
                <li>如果风险正在升高，请直接联系当地紧急援助或前往最近的急诊/医院。</li>
              </ul>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/about">
                  查看产品边界说明
                  <PhoneCall className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  返回首页
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
