"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertTriangle, Star, MapPin, Clock, ThumbsUp, MessageCircle, Camera } from "lucide-react"

export function ReportsList() {
  const reports = [
    {
      id: 1,
      type: "issue",
      title: "Large pothole on Main Street",
      description: "Deep pothole causing damage to vehicles",
      location: "Main St & 5th Ave",
      priority: "high",
      status: "pending",
      author: "John D.",
      time: "2 hours ago",
      likes: 12,
      comments: 3,
      hasPhoto: true,
    },
    {
      id: 2,
      type: "review",
      title: "Amazing coffee at Central Cafe",
      description: "Best latte in the city, friendly staff",
      location: "Central Cafe, Downtown",
      rating: 5,
      author: "Sarah M.",
      time: "4 hours ago",
      likes: 8,
      comments: 2,
      hasPhoto: true,
    },
    {
      id: 3,
      type: "issue",
      title: "Broken street light",
      description: "Street light has been out for a week",
      location: "Oak Street",
      priority: "medium",
      status: "in-progress",
      author: "Mike R.",
      time: "1 day ago",
      likes: 5,
      comments: 1,
      hasPhoto: false,
    },
  ]

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle>Recent Reports</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[500px] overflow-y-auto">
          <div className="space-y-4 p-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {report.type === "issue" ? (
                      <AlertTriangle
                        className={`h-4 w-4 ${report.priority === "high" ? "text-red-500" : "text-yellow-500"}`}
                      />
                    ) : (
                      <Star className="h-4 w-4 text-green-500" />
                    )}
                    <Badge variant={report.type === "issue" ? "destructive" : "default"}>
                      {report.type === "issue" ? "Issue" : "Review"}
                    </Badge>
                    {report.type === "issue" && (
                      <Badge
                        variant="outline"
                        className={
                          report.status === "pending"
                            ? "border-yellow-500 text-yellow-600"
                            : report.status === "in-progress"
                              ? "border-blue-500 text-blue-600"
                              : "border-green-500 text-green-600"
                        }
                      >
                        {report.status}
                      </Badge>
                    )}
                  </div>
                  {report.hasPhoto && <Camera className="h-4 w-4 text-muted-foreground" />}
                </div>

                <h4 className="font-medium mb-1">{report.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{report.description}</p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <MapPin className="h-3 w-3" />
                  <span>{report.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {report.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{report.author}</span>
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{report.time}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{report.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{report.comments}</span>
                    </div>
                  </div>
                </div>

                {report.type === "review" && report.rating && (
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < report.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
