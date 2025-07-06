"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Star, Clock, Eye, Edit, Trash2 } from "lucide-react"

export function UserReports() {
  const reports = [
    {
      id: 1,
      type: "issue",
      title: "Broken sidewalk on Oak Street",
      status: "resolved",
      priority: "medium",
      date: "2024-01-15",
      likes: 8,
      views: 45,
    },
    {
      id: 2,
      type: "review",
      title: "Great coffee at Downtown Cafe",
      rating: 5,
      date: "2024-01-12",
      likes: 12,
      views: 67,
    },
    {
      id: 3,
      type: "issue",
      title: "Pothole causing traffic issues",
      status: "in-progress",
      priority: "high",
      date: "2024-01-10",
      likes: 15,
      views: 89,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {report.type === "issue" ? (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      ) : (
                        <Star className="h-4 w-4 text-yellow-500" />
                      )}
                      <h4 className="font-medium">{report.title}</h4>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      {report.type === "issue" && report.status && (
                        <Badge className={getStatusColor(report.status)}>
                          {report.status === "in-progress"
                            ? "In Progress"
                            : report.status === "resolved"
                              ? "Resolved"
                              : "Pending"}
                        </Badge>
                      )}
                      {report.type === "issue" && report.priority && (
                        <Badge className={getPriorityColor(report.priority)}>{report.priority} priority</Badge>
                      )}
                      {report.type === "review" && report.rating && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < report.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(report.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{report.views} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>👍 {report.likes} likes</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="issues" className="space-y-4 mt-4">
            {reports
              .filter((r) => r.type === "issue")
              .map((report) => (
                <div key={report.id} className="border rounded-lg p-4">
                  <p>Issue reports will be displayed here...</p>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4 mt-4">
            {reports
              .filter((r) => r.type === "review")
              .map((report) => (
                <div key={report.id} className="border rounded-lg p-4">
                  <p>Review reports will be displayed here...</p>
                </div>
              ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
