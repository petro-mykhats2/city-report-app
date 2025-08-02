"use client"

import { MapFilters } from "@/components/map-filters"
import { RecentReports } from "@/components/recent-reports"
import { useTranslation } from "@/i18n"
import dynamic from "next/dynamic"

export default function MapPage() {
  const { t } = useTranslation()

  const MapView = dynamic(
    () => import("@/components/map-view").then((mod) => mod.MapView),
    {
      ssr: false,
    }
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{t("mapPage.title")}</h1>
        <p className="text-muted-foreground">{t("mapPage.description")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <MapFilters />
        </div>
        <div className="lg:col-span-2 order-1 lg:order-2">
          <MapView />
        </div>
        <div className="lg:col-span-1 order-3">
          <RecentReports />
        </div>
      </div>
    </div>
  )
}
