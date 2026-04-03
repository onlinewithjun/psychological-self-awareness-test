import { ResultsSummary } from "@/components/assessment/results-summary";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  return <ResultsSummary sessionId={sessionId} />;
}
