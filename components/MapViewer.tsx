// components/MapViewer.tsx
"use client"

import { useRef, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Polygon } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import pragueBoundary from "@/public/Praha.json"
import { Card, CardContent } from "./ui/card"

// 🛠️ Іконки для Leaflet (копія з MapPicker)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
})

interface MapViewerProps {
  coords: { lat: number; lng: number }
}

export function MapViewer({ coords }: MapViewerProps) {
  const mapRef = useRef<L.Map | null>(null)

  // Перетворюємо GeoJSON кордони Праги для Leaflet
  const pragueCoords: [number, number][] =
    pragueBoundary.features[0].geometry.coordinates[0].map(
      ([lng, lat]: number[]) => [lat, lng]
    )

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([coords.lat, coords.lng], 15)
    }
  }, [coords])

  // Зовнішні межі для затемнення поза Прагою
  const outerBounds: [number, number][] = [
    [90, -180],
    [90, 180],
    [-90, 180],
    [-90, -180],
  ]

  return (
    <Card className="h-[300px] relative overflow-hidden">
      <CardContent className="p-0 h-full relative z-0">
        <MapContainer
          center={[coords.lat, coords.lng]}
          zoom={15}
          scrollWheelZoom={true}
          ref={mapRef}
          className="h-full w-full"
          dragging={true} // заборона перетягування карти
          zoomControl={true} // прибрати контрол зуму
          doubleClickZoom={false}
          //   scrollWheelZoom={false}
          touchZoom={true}
          keyboard={false}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Фіксований маркер */}
          <Marker position={[coords.lat, coords.lng]} />

          {/* Маска затемнення */}
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

          {/* Контур Праги */}
          <Polygon
            positions={[pragueCoords]}
            pathOptions={{
              color: "blue",
              weight: 2,
              fillOpacity: 0,
            }}
          />
        </MapContainer>
      </CardContent>
    </Card>
  )
}
