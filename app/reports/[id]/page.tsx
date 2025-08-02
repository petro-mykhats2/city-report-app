export const dynamic = "force-dynamic"

import { ReportDetailPage } from "@/components/report-detail-page"

export default async function ReportDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  return <ReportDetailPage reportId={resolvedParams.id} />
}
