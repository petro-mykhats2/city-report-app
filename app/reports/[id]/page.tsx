import { ReportDetailPage } from "@/components/report-detail-page"

export default async function ReportDetail({
  params,
}: {
  params: { id: string }
}) {
  return <ReportDetailPage reportId={params.id} />
}
