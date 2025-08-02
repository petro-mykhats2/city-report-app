// components/MapPicker.tsx
"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Polygon } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import pragueBoundary from "@/public/Praha.json"
import { Card, CardContent } from "./ui/card"
import { booleanPointInPolygon, point, polygon } from "@turf/turf"

// 🛠️ Іконки для Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

// 🛠️ Фікс для Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
})

interface MapPickerProps {
  markerCoords: { lat: number; lng: number }
  onCoordsChange: (coords: { lat: number; lng: number }) => void
}

export function MapPicker({ markerCoords, onCoordsChange }: MapPickerProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  const pragueCoords: [number, number][] =
    pragueBoundary.features[0].geometry.coordinates[0].map(
      ([lng, lat]: number[]) => [lat, lng]
    )

  // 🔵 Перевірка входження в межі міста
  const isWithinCity = (lat: number, lng: number): boolean => {
    const pt = point([lng, lat])
    const cityPolygon = polygon([pragueCoords.map(([lat, lng]) => [lng, lat])])
    return booleanPointInPolygon(pt, cityPolygon)
  }

  // ⬛ Для затемнення області за межами
  const outerBounds: [number, number][] = [
    [90, -180],
    [90, 180],
    [-90, 180],
    [-90, -180],
  ]

  useEffect(() => {
    if (mapRef.current && markerCoords.lat !== 0 && markerCoords.lng !== 0) {
      mapRef.current.setView([markerCoords.lat, markerCoords.lng], 15)
    }
  }, [markerCoords])

  return (
    <Card className="h-[300px] relative overflow-hidden">
      <CardContent className="p-0 h-full relative z-0">
        <MapContainer
          center={
            markerCoords.lat !== 0 && markerCoords.lng !== 0
              ? [markerCoords.lat, markerCoords.lng]
              : [50.0755, 14.4378] // 🟢 fallback на центр Праги
          }
          zoom={15}
          scrollWheelZoom
          ref={mapRef}
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 📍 Маркер з перевіркою меж */}
          <Marker
            position={[markerCoords.lat, markerCoords.lng]}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const latlng = (e.target as L.Marker).getLatLng()
                const newLat = latlng.lat
                const newLng = latlng.lng

                if (isWithinCity(newLat, newLng)) {
                  onCoordsChange({ lat: newLat, lng: newLng })
                } else {
                  alert("⚠️ Ця точка за межами міста.")
                  // або додай toast тут
                }
              },
            }}
            ref={markerRef}
          />

          {/* 🔲 Маска навколо меж */}
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
          {/* 🔵 Синій контур Праги */}
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
