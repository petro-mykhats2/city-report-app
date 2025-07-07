"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertTriangle,
  Star,
  MapPin,
  Clock,
  ThumbsUp,
  MessageCircle,
  Camera,
  ArrowRight,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

export function RecentReports() {
  const recentReports = [
    {
      id: 1,
      type: "issue",
      title: "Large pothole on Main Street",
      location: "Main St & 5th Ave",
      priority: "high",
      status: "pending",
      author: "John D.",
      time: "2h ago",
      likes: 12,
      comments: 3,
      hasPhoto: true,
    },
    {
      id: 2,
      type: "review",
      title: "Amazing coffee at Central Cafe",
      location: "Central Cafe, Downtown",
      rating: 5,
      author: "Sarah M.",
      time: "4h ago",
      likes: 8,
      comments: 2,
      hasPhoto: true,
    },
    {
      id: 3,
      type: "issue",
      title: "Broken street light",
      location: "Oak Street",
      priority: "medium",
      status: "in-progress",
      author: "Mike R.",
      time: "1d ago",
      likes: 5,
      comments: 1,
      hasPhoto: false,
    },
    {
      id: 4,
      type: "review",
      title: "Beautiful park renovation",
      location: "Central Park",
      rating: 4,
      author: "Emma L.",
      time: "2d ago",
      likes: 15,
      comments: 7,
      hasPhoto: true,
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
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {recentReports.slice(0, 4).map((report) => (
          <div
            key={report.id}
            className="group p-3 rounded-lg border hover:bg-muted/50 transition-all duration-200 cursor-pointer hover:shadow-sm"
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  report.type === "issue"
                    ? report.priority === "high"
                      ? "bg-red-100 dark:bg-red-900/20"
                      : "bg-yellow-100 dark:bg-yellow-900/20"
                    : "bg-green-100 dark:bg-green-900/20"
                }`}
              >
                {report.type === "issue" ? (
                  <AlertTriangle
                    className={`h-4 w-4 ${report.priority === "high" ? "text-red-600" : "text-yellow-600"}`}
                  />
                ) : (
                  <Star className="h-4 w-4 text-green-600" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {report.title}
                  </h4>
                  {report.hasPhoto && <Camera className="h-3 w-3 text-muted-foreground flex-shrink-0 ml-2" />}
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{report.location}</span>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-1 mb-2 flex-wrap">
                  {report.type === "issue" && report.priority && (
                    <Badge className={`text-xs px-1.5 py-0.5 ${getPriorityColor(report.priority)}`}>
                      {report.priority}
                    </Badge>
                  )}
                  {report.type === "issue" && report.status && (
                    <Badge className={`text-xs px-1.5 py-0.5 ${getStatusColor(report.status)}`}>
                      {report.status === "in-progress" ? "in progress" : report.status}
                    </Badge>
                  )}
                  {report.type === "review" && report.rating && (
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-2.5 w-2.5 ${
                            i < report.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-4 w-4">
                      <AvatarFallback className="text-xs">
                        {report.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{report.author}</span>
                    <Clock className="h-3 w-3" />
                    <span>{report.time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{report.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{report.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* View All Button */}
        <div className="pt-2">
          <Button asChild variant="outline" className="w-full group bg-transparent">
            <Link href="/reports">
              View All Reports
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
