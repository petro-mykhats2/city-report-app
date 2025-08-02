"use client"
import { useTranslation } from "@/i18n"
import { ReportForm } from "@/components/report-form"

export default function ReportPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("reportPage.title")}</h1>
        <p className="text-muted-foreground">
          {t("reportPage.description")}
        </p>
      </div>
      <ReportForm />
    </div>
  )
}
