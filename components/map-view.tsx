"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import pragueBoundary from "@/public/Praha.json"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

// 🛠️ Фікс іконок для Leaflet у Next.js
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
})

export function MapView() {
  const [zoom, setZoom] = useState(11)
  const [isMobile, setIsMobile] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)
  const mapRef = useRef<L.Map | null>(null)

  const [mapMarkers, setMapMarkers] = useState<
    { id: string; title: string; description: string; coords: [number, number] }[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "reports"));
        const fetchedMarkers: { id: string; title: string; description: string; coords: [number, number] }[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.locationCoords && typeof data.locationCoords.lat === 'number' && typeof data.locationCoords.lng === 'number') {
            fetchedMarkers.push({
              id: doc.id,
              title: data.title || 'No Title',
              description: data.description || 'No Description',
              coords: [data.locationCoords.lat, data.locationCoords.lng],
            });
          }
        });
        setMapMarkers(fetchedMarkers);
      } catch (error) {
        console.error("Error fetching map markers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

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
  const pragueCoords: [number, number][] =
    pragueBoundary.features[0].geometry.coordinates[0].map(
      ([lng, lat]: number[]) => [lat, lng]
    )

  // 🟥 Маска навколо Праги
  const outerBounds: [number, number][] = [
    [90, -180],
    [90, 180],
    [-90, 180],
    [-90, -180],
  ]

  // 📍 Маркери в межах Праги
  const markers = [
    { position: [50.087, 14.4208], label: "Староміська площа" },
    { position: [50.0755, 14.4378], label: "Вацлавська площа" },
    { position: [50.0909, 14.3983], label: "Петршинський пагорб" },
  ]

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
            {/* {markers.map((marker, idx) => (
              <Marker key={idx} position={marker.position as [number, number]}>
                <Popup>{marker.label}</Popup>
              </Marker>
            ))} */}
            {mapMarkers.map((marker, idx) => (
              <Marker key={`saved-${idx}`} position={marker.coords}>
                <Popup>
                  <strong>{marker.title}</strong>
                  <br />
                  {marker.description}
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* 📱 Мобільна маска */}
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
