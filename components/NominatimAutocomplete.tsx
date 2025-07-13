"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"

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

  // 👇 Додаємо цей useEffect — щоб коли value ззовні змінюється, ми оновлювали query
  useEffect(() => {
    setQuery(value)
  }, [value])

  // решта коду без змін...

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
            setResults(data)
            setShowDropdown(true)
          })
      } else {
        setResults([])
        setShowDropdown(false)
      }
    }, 400)

    return () => clearTimeout(delayDebounce)
  }, [query])

  // Закриття списку при кліку поза ним
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

  const handleSelect = (result: NominatimResult) => {
    const coords = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) }
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
