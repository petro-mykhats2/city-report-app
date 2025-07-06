import { ReportForm } from "@/components/report-form"

export default function ReportPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Submit a Report</h1>
        <p className="text-muted-foreground">
          Help improve your city by reporting issues or sharing positive experiences
        </p>
      </div>
      <ReportForm />
    </div>
  )
}
