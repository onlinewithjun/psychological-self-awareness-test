import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";

export const metadata: Metadata = {
  title: "向度 | 研究导向的心理自我认知平台",
  description:
    "一个研究导向、反标签化、强调解释与安全边界的心理自我认知平台。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full scroll-smooth antialiased"
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full bg-background text-foreground">
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-[-8rem] h-[24rem] bg-[radial-gradient(circle_at_top,rgba(185,203,227,0.32),transparent_60%)]" />
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
