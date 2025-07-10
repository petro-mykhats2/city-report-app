"use client"

import { useEffect, useState } from "react"

export function LocationsList() {
  const [locations, setLocations] = useState<any[] | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("locations")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLocations(parsed)
        } else {
          setLocations([])
        }
      } catch {
        setLocations([])
      }
    } else {
      setLocations([])
    }
  }, [])

  if (locations === null) {
    return <p>Завантаження...</p>
  }

  if (locations.length === 0) {
    return <p>Немає збережених місць у localStorage</p>
  }

  return (
    <div>
      <h2>Збережені місця:</h2>
      <ul>
        {locations.map((loc, index) => (
          <li key={index}>
            <strong>{loc.name}</strong>: {loc.address}
          </li>
        ))}
      </ul>

      <h3>JSON дані з localStorage:</h3>
      <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded border border-gray-300">
        {JSON.stringify(locations, null, 2)}
      </pre>
    </div>
  )
}
