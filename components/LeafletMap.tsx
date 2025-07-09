"use client"

import { MapContainer, TileLayer, useMap } from "react-leaflet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

function EnableScrollWheelZoom() {
  const map = useMap()
  map.scrollWheelZoom.enable()
  return null
}

export function MapView() {
  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Interactive City Map
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative h-[500px]">
          <MapContainer
            center={[50.0755, 14.4378]} // Координати, наприклад Прага
            zoom={13}
            scrollWheelZoom={false}
            className="h-full w-full z-0"
          >
            <EnableScrollWheelZoom />
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Тут додай маркери, якщо потрібно */}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}
