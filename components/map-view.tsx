"use client"

import React, { memo, useEffect, useMemo, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import pragueBoundary from "@/public/Praha.json"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useTranslation } from "@/i18n"
import type {
  MapFilterState,
  PriorityFilter,
  ReportTypeFilter,
  TimeRangeFilter,
} from "@/types/filters"

// 🛠️ Фікс іконок для Leaflet у Next.js
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"
import dynamic from "next/dynamic"
// Load marker clustering only on the client to avoid SSR issues
type MarkerClusterGroupProps = React.PropsWithChildren<Record<string, unknown>>
const MarkerClusterGroup = dynamic<MarkerClusterGroupProps>(
  () =>
    import("react-leaflet-markercluster") as unknown as Promise<
      React.ComponentType<MarkerClusterGroupProps>
    >,
  { ssr: false }
)
import Link from "next/link"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
})

type ReportMarker = {
  id: string
  title: string
  description: string
  coords: [number, number]
  location?: string
  type?: "issue" | "review" | string
  priority?: PriorityFilter | null
  createdAtMs?: number | null
}

// A memoized render-only layer for markers so map container doesn't remount
const MarkerLayer: React.FC<{ markers: ReportMarker[]; t: any }> = memo(
  function MarkerLayer({ markers, t }) {
    return (
      <MarkerClusterGroup>
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.coords}>
            <Popup>
              <div className="p-2 max-w-[200px]">
                <h3 className="font-bold text-lg text-gray-800">
                  {marker.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {marker.description}
                </p>
                <Link
                  href={`/reports/${marker.id}`}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {t("interactiveCityMap.moreDetails")}
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    )
  }
)

interface MapViewProps {
  filters: MapFilterState
}

export function MapView({ filters }: MapViewProps) {
  const [zoom, setZoom] = useState(11)
  const [isMobile, setIsMobile] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)
  const mapRef = useRef<L.Map | null>(null)
  const { t } = useTranslation()

  const [mapMarkers, setMapMarkers] = useState<ReportMarker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      try {
        const querySnapshot = await getDocs(collection(db, "reports"))
        const fetchedMarkers: ReportMarker[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          if (
            data.locationCoords &&
            typeof data.locationCoords.lat === "number" &&
            typeof data.locationCoords.lng === "number"
          ) {
            const createdAtMs =
              data.createdAt && typeof data.createdAt.toDate === "function"
                ? (data.createdAt.toDate() as Date).getTime()
                : null
            fetchedMarkers.push({
              id: doc.id,
              title: data.title || "No Title",
              description: data.description || "No Description",
              coords: [data.locationCoords.lat, data.locationCoords.lng],
              location: data.location || "",
              type: data.type,
              priority: data.priority ?? null,
              createdAtMs,
            })
          }
        })
        console.log(
          "DEBUG: fetchedMarkers",
          fetchedMarkers.map((m) => ({
            id: m.id,
            type: m.type,
            location: m.location,
            title: m.title,
            description: m.description,
          }))
        )
        setMapMarkers(fetchedMarkers)

        setMapMarkers(fetchedMarkers)
      } catch (error) {
        console.error("Error fetching map markers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  // ✅ Обробка розміру екрана
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (mapRef.current) {
      if (isMobile) {
        mapRef.current.scrollWheelZoom.disable()
        mapRef.current.dragging.enable()
        mapRef.current.touchZoom.enable()
      } else {
        mapRef.current.scrollWheelZoom.enable()
        mapRef.current.dragging.enable()
        mapRef.current.touchZoom.enable()
      }
    }
  }, [isMobile])

  const handleOverlayClick = () => {
    setShowOverlay(false)
  }

  const increaseZoom = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom()
      const newZoom = Math.min(currentZoom + 1, 18)
      mapRef.current.setZoom(newZoom)
      setZoom(newZoom)
    }
  }

  const decreaseZoom = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom()
      const newZoom = Math.max(currentZoom - 1, 1)
      mapRef.current.setZoom(newZoom)
      setZoom(newZoom)
    }
  }

  // ✅ Координати межі Праги (інверсія з GeoJSON)
  const pragueCoords: [number, number][] = useMemo(
    () =>
      pragueBoundary.features[0].geometry.coordinates[0].map(
        ([lng, lat]: number[]) => [lat, lng]
      ),
    []
  )

  // 🟥 Маска навколо Праги
  const outerBounds: [number, number][] = useMemo(
    () => [
      [90, -180],
      [90, 180],
      [-90, 180],
      [-90, -180],
    ],
    []
  )

  // Фільтрація маркерів
  const filteredMarkers = useMemo(() => {
    const { query, types, priorities, timeRanges } = filters

    const normalizeTypeToFilter = (
      t?: string
    ): ReportTypeFilter | undefined => {
      if (!t) return undefined
      if (t === "issue") return "issues"
      if (t === "review") return "reviews"
      if (t === "event" || t === "events") return "events"
      return undefined
    }

    const matchesQuery = (
      query: string,
      title?: string,
      description?: string,
      location?: string
    ): boolean => {
      if (!query) return true
      const q = query.toLowerCase()
      return [title, description, location]
        .filter(Boolean) // прибираємо undefined/null
        .some((field) => field!.toLowerCase().includes(q))
    }

    const withinTimeRanges = (
      createdAtMs: number | null | undefined
    ): boolean => {
      if (!timeRanges || timeRanges.length === 0) return true
      if (!createdAtMs) return false
      const now = Date.now()
      const startOfToday = new Date()
      startOfToday.setHours(0, 0, 0, 0)
      const msInDay = 24 * 60 * 60 * 1000
      const ranges = timeRanges.map((r) => {
        switch (r) {
          case "today":
            return createdAtMs >= startOfToday.getTime()
          case "week":
            return createdAtMs >= now - 7 * msInDay
          case "month":
            return createdAtMs >= now - 30 * msInDay
          default:
            return true
        }
      })
      return ranges.some(Boolean)
    }

    console.log(
      "DEBUG TYPES",
      mapMarkers.map((m) => ({ id: m.id, type: m.type }))
    )

    return mapMarkers.filter((m) => {
      if (!matchesQuery(query, m.title, m.description, m.location)) return false

      if (types && types.length > 0) {
        const mapped = normalizeTypeToFilter(m.type)
        if (!mapped || !types.includes(mapped)) return false
      }

      if (priorities && priorities.length > 0) {
        if (!m.priority || !priorities.includes(m.priority)) return false
      }

      if (!withinTimeRanges(m.createdAtMs)) return false

      return true
    })
  }, [filters, mapMarkers])

  return (
    <Card className="h-[600px] relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {t("interactiveCityMap.title")}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 h-[500px] relative z-0">
        <div className="relative h-full w-full">
          <MapContainer
            center={useMemo(() => [50.0755, 14.4378] as [number, number], [])}
            zoom={zoom}
            scrollWheelZoom={isMobile}
            dragging={!isMobile}
            touchZoom={!isMobile}
            ref={mapRef}
            className="h-full w-full"
            style={{ position: "relative", zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 🟥 Маска навколо Праги */}
            <Polygon
              positions={[[...outerBounds], pragueCoords]}
              pathOptions={{
                color: "black",
                fillColor: "black",
                fillOpacity: 0.5,
                weight: 0,
                interactive: false,
              }}
            />

            {/* 📍 Маркери */}
            <MarkerLayer markers={filteredMarkers} t={t} />
          </MapContainer>

          {/* 📱 Мобільна маска */}
          {isMobile && showOverlay && (
            <div
              onClick={handleOverlayClick}
              className="absolute inset-0 z-[10] bg-black bg-opacity-70 flex flex-col items-center justify-center text-white px-4 text-center"
            >
              <div className="animate-bounce text-3xl mb-2">⬆️⬇️</div>
              <p className="text-sm">{t("interactiveCityMap.scrollToView")}</p>
              <p className="text-xs mt-1">
                {t("interactiveCityMap.tapToActivate")}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
