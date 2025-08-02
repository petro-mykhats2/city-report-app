"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Star, MapPin, Clock } from "lucide-react"
import Link from "next/link"

interface SimilarReportsProps {
  currentReportId: string
  relatedIds: number[]
}

export function SimilarReports({
  currentReportId,
  relatedIds,
}: SimilarReportsProps) {
  // Mock similar reports data
  const similarReports = [
    {
      id: 2,
      type: "issue",
      title: "Broken street light near intersection",
      location: "5th Ave & Oak St",
      priority: "medium",
      status: "in-progress",
      time: "3d ago",
      distance: "0.2 miles away",
    },
    {
      id: 5,
      type: "issue",
      title: "Cracked sidewalk causing trip hazard",
      location: "Main St & 3rd Ave",
      priority: "low",
      status: "pending",
      time: "1w ago",
      distance: "0.4 miles away",
    },
    {
      id: 8,
      type: "review",
      title: "Great road maintenance work",
      location: "Downtown Area",
      rating: 4,
      time: "2w ago",
      distance: "0.1 miles away",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Similar Reports Nearby</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {similarReports.map((report) => (
          <Link key={report.id} href={`/reports/${report.id}`}>
            <div className="group p-3 rounded-lg border hover:bg-muted/50 transition-all duration-200 cursor-pointer hover:shadow-sm">
              <div className="space-y-2">
                {/* Header */}
                <div className="flex items-start gap-2">
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${
                      report.type === "issue"
                        ? report.priority === "high"
                          ? "bg-red-100 dark:bg-red-900/20"
                          : "bg-yellow-100 dark:bg-yellow-900/20"
                        : "bg-green-100 dark:bg-green-900/20"
                    }`}
                  >
                    {report.type === "issue" ? (
                      <AlertTriangle
                        className={`h-3 w-3 ${report.priority === "high" ? "text-red-600" : "text-yellow-600"}`}
                      />
                    ) : (
                      <Star className="h-3 w-3 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {report.title}
                    </h4>
                  </div>
                </div>

                {/* Location and Distance */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{report.location}</span>
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {report.distance}
                </div>

                {/* Badges and Time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {report.type === "issue" && report.priority && (
                      <Badge
                        className={`text-xs px-1.5 py-0.5 ${getPriorityColor(report.priority)}`}
                      >
                        {report.priority}
                      </Badge>
                    )}
                    {report.type === "issue" && report.status && (
                      <Badge
                        className={`text-xs px-1.5 py-0.5 ${getStatusColor(report.status)}`}
                      >
                        {report.status === "in-progress"
                          ? "in progress"
                          : report.status}
                      </Badge>
                    )}
                    {report.type === "review" && report.rating && (
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-2.5 w-2.5 ${
                              i < report.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{report.time}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}

        <div className="pt-2 text-center">
          <Link
            href="/reports"
            className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            View all reports in this area →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
