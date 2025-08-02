"use client"

import { useState } from "react"

export function LocationForm() {
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!lat || !lng) return alert("Введи координати")

    const newLocation = {
      name,
      address,
      coords: [parseFloat(lat), parseFloat(lng)] as [number, number],
    }

    const existing = JSON.parse(localStorage.getItem("locations") || "[]")
    localStorage.setItem(
      "locations",
      JSON.stringify([...existing, newLocation])
    )

    setName("")
    setAddress("")
    setLat("")
    setLng("")

    alert("Збережено!")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 p-4 border rounded-md max-w-md"
    >
      <h3 className="text-lg font-bold">Додати точку</h3>

      <input
        type="text"
        placeholder="Назва"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-2 py-1"
        required
      />

      <input
        type="text"
        placeholder="Адреса"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full border px-2 py-1"
      />

      <input
        type="text"
        placeholder="Широта (lat)"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
        className="w-full border px-2 py-1"
        required
      />

      <input
        type="text"
        placeholder="Довгота (lng)"
        value={lng}
        onChange={(e) => setLng(e.target.value)}
        className="w-full border px-2 py-1"
        required
      />

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Зберегти
      </button>
    </form>
  )
}
