"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer } from "react-leaflet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export function MapView() {
  const [zoom, setZoom] = useState(13)
  const [isMobile, setIsMobile] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)
  const mapRef = useRef<L.Map | null>(null)

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

  const handleOverlayClick = () => {
    setShowOverlay(false)
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
        <div className="relative h-full w-full">
          <MapContainer
            center={[50.0755, 14.4378]}
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
          </MapContainer>

          {/* Маска тільки на мобільних */}
          {isMobile && showOverlay && (
            <div
              onClick={handleOverlayClick}
              className="absolute inset-0 z-[10] bg-black bg-opacity-70 flex flex-col items-center justify-center text-white px-4 text-center"
            >
              <div className="animate-bounce text-3xl mb-2">⬆️⬇️</div>
              <p className="text-sm">Гортайте для перегляду</p>
              <p className="text-xs mt-1">(Торкніться, щоб активувати карту)</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
