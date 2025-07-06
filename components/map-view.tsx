"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, AlertTriangle, Star } from "lucide-react"

export function MapView() {
  // Mock data for demonstration
  const mockReports = [
    { id: 1, type: "issue", title: "Pothole on Main St", x: 30, y: 40, severity: "high" },
    { id: 2, type: "review", title: "Great Coffee Shop", x: 60, y: 30, rating: 5 },
    { id: 3, type: "issue", title: "Broken Street Light", x: 45, y: 70, severity: "medium" },
    { id: 4, type: "review", title: "Beautiful Park", x: 80, y: 50, rating: 4 },
  ]

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Interactive City Map
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-[500px] bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 overflow-hidden">
          {/* Mock map background */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" className="text-muted-foreground">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Mock streets */}
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-0 right-0 h-2 bg-gray-300 dark:bg-gray-600"></div>
            <div className="absolute top-2/3 left-0 right-0 h-2 bg-gray-300 dark:bg-gray-600"></div>
            <div className="absolute top-0 bottom-0 left-1/4 w-2 bg-gray-300 dark:bg-gray-600"></div>
            <div className="absolute top-0 bottom-0 right-1/4 w-2 bg-gray-300 dark:bg-gray-600"></div>
          </div>

          {/* Report markers */}
          {mockReports.map((report) => (
            <div
              key={report.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${report.x}%`, top: `${report.y}%` }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                  report.type === "issue"
                    ? report.severity === "high"
                      ? "bg-red-500 text-white"
                      : "bg-yellow-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {report.type === "issue" ? <AlertTriangle className="h-4 w-4" /> : <Star className="h-4 w-4" />}
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {report.title}
              </div>
            </div>
          ))}

          {/* Map controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button size="sm" variant="secondary">
              +
            </Button>
            <Button size="sm" variant="secondary">
              -
            </Button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
            <div className="text-sm font-medium">Legend</div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>High Priority Issues</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Medium Priority Issues</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Reviews & Tips</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
