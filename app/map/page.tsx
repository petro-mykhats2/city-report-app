import { MapView } from "@/components/map-view"
import { MapFilters } from "@/components/map-filters"
import { RecentReports } from "@/components/recent-reports"

export default function MapPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">City Map</h1>
        <p className="text-muted-foreground">Explore reports and reviews from your community</p>
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
