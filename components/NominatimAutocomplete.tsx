"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

import { booleanPointInPolygon, point, polygon } from "@turf/turf"
import pragueBoundary from "@/public/Praha.json"

type NominatimResult = {
  lat: string
  lon: string
  display_name: string
}

export function NominatimAutocomplete({
  onSelect,
  value = "",
}: {
  onSelect: (coords: { lat: number; lng: number }, address: string) => void
  value?: string
}) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<NominatimResult[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 2) {
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}`
        )
          .then((res) => res.json())
          .then((data) => {
            const filtered = data.filter((result: NominatimResult) => {
              const lat = parseFloat(result.lat)
              const lng = parseFloat(result.lon)
              return isWithinCity(lat, lng)
            })
            setResults(filtered)
            setShowDropdown(filtered.length > 0)
          })
      } else {
        setResults([])
        setShowDropdown(false)
      }
    }, 400)

    return () => clearTimeout(delayDebounce)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const isWithinCity = (lat: number, lng: number) => {
    const pt = point([lng, lat])
    const cityPolygon = polygon([
      pragueBoundary.features[0].geometry.coordinates[0].map(
        ([lng, lat]: number[]) => [lng, lat]
      ),
    ])
    return booleanPointInPolygon(pt, cityPolygon)
  }

  const handleSelect = (result: NominatimResult) => {
    const coords = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) }

    if (!isWithinCity(coords.lat, coords.lng)) {
      toast({
        title: "Адреса поза межами міста",
        description: "Оберіть адресу в межах Праги.",
        variant: "destructive",
      })
      return
    }

    onSelect(coords, result.display_name)
    setQuery(result.display_name)
    setShowDropdown(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Input
        type="text"
        placeholder="Введіть адресу"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 shadow-lg max-h-60 overflow-auto">
          {results.map((result, index) => (
            <div
              key={index}
              className="cursor-pointer px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => handleSelect(result)}
            >
              {result.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
