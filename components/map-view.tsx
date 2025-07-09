import "leaflet/dist/leaflet.css"
import { useEffect, useState, useRef } from "react"
import { MapContainer, TileLayer } from "react-leaflet"
import L from "leaflet"

export function MapView() {
  const [zoom, setZoom] = useState(13)
  const mapRef = useRef<L.Map | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize() // initial check
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (mapRef.current) {
      if (isMobile) {
        mapRef.current.scrollWheelZoom.disable()
        mapRef.current.dragging.disable()
        mapRef.current.touchZoom.disable()
      } else {
        mapRef.current.scrollWheelZoom.enable()
        mapRef.current.dragging.enable()
        mapRef.current.touchZoom.enable()
      }
    }
  }, [isMobile])

  // ... твої функції zoom in/out ...

  return (
    <MapContainer
      center={[50.0755, 14.4378]}
      zoom={zoom}
      scrollWheelZoom={!isMobile}
      dragging={!isMobile}
      touchZoom={!isMobile}
      ref={mapRef}
      style={{
        height: isMobile ? "300px" : "500px",
        width: "100%",
        position: "relative",
        zIndex: 0,
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Твої маркери */}
    </MapContainer>
  )
}
