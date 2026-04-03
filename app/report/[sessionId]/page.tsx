import { ReportDetails } from "@/components/assessment/report-details";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  return <ReportDetails sessionId={sessionId} />;
}
