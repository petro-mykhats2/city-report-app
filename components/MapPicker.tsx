// components/MapPicker.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Polygon,
} from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import pragueBoundary from "@/public/Praha.json"

// 🛠️ Іконки для Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"
import { Card, CardContent } from "./ui/card"

// Фікс іконок для Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
})

interface MapPickerProps {
  defaultCoords?: [number, number]
  onSelect: (coords: { lat: number; lng: number }) => void
}

export function MapPicker({
  markerCoords,
  onCoordsChange,
}: {
  markerCoords: { lat: number; lng: number }
  onCoordsChange: (coords: { lat: number; lng: number }) => void
}) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([markerCoords.lat, markerCoords.lng], 15)
    }
  }, [markerCoords])

  return (
    <Card className="h-[300px] relative overflow-hidden">
      <CardContent className="p-0 h-full relative z-0">
        <MapContainer
          center={[markerCoords.lat, markerCoords.lng]}
          zoom={15}
          scrollWheelZoom
          ref={mapRef}
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={[markerCoords.lat, markerCoords.lng]}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const latlng = (e.target as L.Marker).getLatLng()
                onCoordsChange({ lat: latlng.lat, lng: latlng.lng })
              },
            }}
            ref={markerRef}
          />
        </MapContainer>
      </CardContent>
    </Card>
  )
}
