"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertTriangle, Star, MapPin, Clock, ThumbsUp, MessageCircle, Camera, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { formatTimeToNow } from "@/lib/utils"
import { useTranslation } from "react-i18next"

export function RecentReports() {
  const { t, i18n } = useTranslation()
  const [recentReports, setRecentReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentReports() {
      try {
        // Забираємо останні 4 звіти за датою створення
        const q = query(collection(db, "reports"), orderBy("createdAt", "desc"), limit(4))
        const snapshot = await getDocs(q)
        const reports = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setRecentReports(reports)
      } catch (error) {
        console.error("Error fetching recent reports:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRecentReports()
  }, [])

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

  if (loading) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            {t("recentReports.loading")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t("recentReports.loadingMessage")}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" />
          {t("recentReports.title")}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {recentReports.map((report) => (
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
                  {report.photos && report.photos.length > 0 && <Camera className="h-3 w-3 text-muted-foreground flex-shrink-0 ml-2" />}
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
                      {t(`reportCard.priority.${report.priority}`)}

                    </Badge>
                  )}
                  {report.type === "issue" && report.status && (
                    <Badge className={`text-xs px-1.5 py-0.5 ${getStatusColor(report.status)}`}>
                      {report.status === "in-progress" ? t("recentReports.status.inProgress") : t(`recentReports.status.${report.status}`)}
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
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{report.author}</span>
                    <Clock className="h-3 w-3" />
                    <span>{formatTimeToNow(report.createdAt.toDate(), i18n.language)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{report.likes || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{report.comments || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* View All Button */}
        <div className="pt-2">
          <Link href="/reports" passHref legacyBehavior>
            <a>
              <Badge
                className="cursor-pointer flex items-center gap-1 justify-center"
                variant="outline"
              >
                {t("recentReports.viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Badge>
            </a>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
