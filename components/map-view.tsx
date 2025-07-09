"use client"

import "leaflet/dist/leaflet.css"
import { useState, useRef, useEffect } from "react"
import { MapContainer, TileLayer } from "react-leaflet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import L from "leaflet"

export function MapView() {
  const [zoom, setZoom] = useState(13)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (mapRef.current) {
      // Вимикаємо скрол-зум, щоб не заважав
      mapRef.current.scrollWheelZoom.disable()
    }
  }, [])

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

  return (
    <Card className="h-[600px] relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Interactive City Map
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 h-[500px] relative z-0">
        <MapContainer
          center={[50.0755, 14.4378]}
          zoom={zoom}
          scrollWheelZoom={false}
          ref={mapRef}
          style={{
            height: "500px",
            width: "100%",
            position: "relative",
            zIndex: 0,
          }}
          whenReady={() => {
            if (mapRef.current) {
              mapRef.current.scrollWheelZoom.disable()
            }
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Твої маркери сюди */}
        </MapContainer>
      </CardContent>
    </Card>
  )
}
