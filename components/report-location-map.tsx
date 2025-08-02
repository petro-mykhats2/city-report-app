"use client"
import { AlertTriangle, Star } from "lucide-react"

interface ReportLocationMapProps {
  coordinates: { lat: number; lng: number }
  title: string
  type: "issue" | "review"
  priority?: string
}

export function ReportLocationMap({
  coordinates,
  title,
  type,
  priority,
}: ReportLocationMapProps) {
  return (
    <div className="relative h-64 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg overflow-hidden">
      {/* Mock map background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" className="text-muted-foreground">
          <defs>
            <pattern
              id="map-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#map-grid)" />
        </svg>
      </div>

      {/* Mock streets */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-0 right-0 h-1.5 bg-gray-300 dark:bg-gray-600"></div>
        <div className="absolute top-2/3 left-0 right-0 h-1.5 bg-gray-300 dark:bg-gray-600"></div>
        <div className="absolute top-0 bottom-0 left-1/4 w-1.5 bg-gray-300 dark:bg-gray-600"></div>
        <div className="absolute top-0 bottom-0 right-1/4 w-1.5 bg-gray-300 dark:bg-gray-600"></div>
      </div>

      {/* Report marker */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          {/* Pulse animation */}
          <div
            className={`absolute inset-0 rounded-full animate-ping ${
              type === "issue"
                ? priority === "high"
                  ? "bg-red-400"
                  : "bg-yellow-400"
                : "bg-green-400"
            }`}
          ></div>

          {/* Main marker */}
          <div
            className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
              type === "issue"
                ? priority === "high"
                  ? "bg-red-500"
                  : "bg-yellow-500"
                : "bg-green-500"
            }`}
          >
            {type === "issue" ? (
              <AlertTriangle className="h-6 w-6 text-white" />
            ) : (
              <Star className="h-6 w-6 text-white" />
            )}
          </div>
        </div>

        {/* Tooltip */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-black text-white text-xs rounded whitespace-nowrap max-w-48 truncate">
          {title}
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-1">
        <button className="w-8 h-8 bg-white dark:bg-gray-800 rounded shadow-md flex items-center justify-center text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          +
        </button>
        <button className="w-8 h-8 bg-white dark:bg-gray-800 rounded shadow-md flex items-center justify-center text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          −
        </button>
      </div>

      {/* Coordinates display */}
      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
        {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
      </div>
    </div>
  )
}
