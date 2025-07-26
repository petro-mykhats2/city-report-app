"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  AlertTriangle,
  Star,
  MapPin,
  ThumbsUp,
  MessageCircle,
  Share2,
  Flag,
  Bell,
  Camera,
  ChevronLeft,
  Heart,
  Bookmark,
  ExternalLink,
  Calendar,
  User,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { PhotoGallery } from "./photo-gallery"
import { ReportComments } from "./report-comments"
import { ReportLocationMap } from "./report-location-map"
import { SimilarReports } from "./similar-reports"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { formatTimeToNow } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { MapViewer } from "./MapViewer"

interface ReportDetailPageProps {
  reportId: string
}

export function ReportDetailPage({ reportId }: ReportDetailPageProps) {
  const [report, setReport] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const { toast } = useToast()
  const { i18n } = useTranslation()

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const ref = doc(db, "reports", reportId)
        const snap = await getDoc(ref)

        if (snap.exists()) {
          setReport({ id: snap.id, ...snap.data() })
        } else {
          console.warn("Звіт не знайдено")
        }
      } catch (err) {
        console.error("Помилка завантаження:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [reportId])

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Завантаження звіту...
      </div>
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800"
    }
  }

  const handleLike = () => {
    setIsLiked((prev) => {
      const newState = !prev
      toast({
        title: newState ? "Liked report" : "Removed like",
        description: newState
          ? "Thank you for supporting this report"
          : "You unliked this report",
      })
      return newState
    })
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast({
      title: isBookmarked ? "Removed bookmark" : "Bookmarked",
      description: isBookmarked
        ? "Report removed from bookmarks"
        : "Report saved to your bookmarks",
    })
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing
        ? "You'll no longer receive updates about this report"
        : "You'll receive notifications when this report is updated",
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied",
      description: "Report link has been copied to your clipboard",
    })
  }

  if (!report) {
    return (
      <div className="p-6 text-center text-red-500">
        Звіт з ID <b>{reportId}</b> не знайдено
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">{report.title}</h1>
      {/* ✅ Тут бачиш все, що приходить */}
      <pre className="text-sm bg-muted p-4 rounded overflow-x-auto max-w-full">
        {JSON.stringify(report, null, 2)}
      </pre>
      {/* Далі — решта твого інтерфейсу */}
      <ul className="text-sm leading-loose list-disc pl-4">
        <li>Назва: {report.title}</li>
        <li>Тип: {report.type}</li>
        <li>Пріоритет: {report.priority}</li>
        <li>Статус: {report.status}</li>
        <li>Адреса: {report.location}</li>
        <li>Автор: {report.contact?.name || "Невідомо"}</li>
      </ul>
      return (
      <div className="min-h-screen bg-background">
        {/* Back Navigation */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-16 z-40">
          <div className="container mx-auto px-4 py-3">
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link href="/reports">
                <ChevronLeft className="h-4 w-4" />
                Back to Reports
              </Link>
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Report Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Type and Status Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        className={`${
                          report.type === "issue"
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        } text-white`}
                      >
                        {report.type === "issue" ? (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        ) : (
                          <Star className="h-3 w-3 mr-1" />
                        )}
                        {report.type === "issue" ? "Issue Report" : "Review"}
                      </Badge>
                      <Badge
                        className={`border ${getPriorityColor(report.priority)}`}
                      >
                        {report.priority} priority
                      </Badge>
                      <Badge
                        className={`border ${getStatusColor(report.status)}`}
                      >
                        {report.status === "in-progress"
                          ? "In Progress"
                          : report.status}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                      {report.title}
                    </h1>

                    {/* Location and Meta*/}
                    <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">{report.location}</span>
                      </div>
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">
                        {formatTimeToNow(
                          report.createdAt.toDate(),
                          i18n.language
                        )}
                      </span>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{report.views} views</span>
                      </div>
                    </div>

                    {/* Author */}
                    {report.contact ? (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {report.contact.name
                              ? report.contact.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .toUpperCase()
                              : "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {report.contact.name || "Anonymous"}
                            </span>
                          </div>
                        </div>

                        <Button variant="outline" size="sm">
                          <User className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic p-3">
                        Author not found
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant={isLiked ? "default" : "outline"}
                        size="sm"
                        onClick={handleLike}
                        className="gap-2"
                      >
                        <Heart
                          className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                        />
                        {report.likes + (isLiked ? 1 : 0)}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent"
                      >
                        <MessageCircle className="h-4 w-4" />
                        {report.comments}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        className="gap-2 bg-transparent"
                      >
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>

                      <Button
                        variant={isBookmarked ? "default" : "outline"}
                        size="sm"
                        onClick={handleBookmark}
                        className="gap-2"
                      >
                        <Bookmark
                          className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
                        />
                        {isBookmarked ? "Saved" : "Save"}
                      </Button>

                      <Button
                        variant={isFollowing ? "default" : "outline"}
                        size="sm"
                        onClick={handleFollow}
                        className="gap-2"
                      >
                        <Bell className="h-4 w-4" />
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Photos */}
              {report.photos && report.photos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Photos ({report.photos.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PhotoGallery photos={report.photos} />
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {report.description
                      .split("\n")
                      .map((paragraph: string, index: number) => (
                        <p
                          key={index}
                          className="mb-4 last:mb-0 leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                  </div>

                  {/* Tags */}
                  {/* {report.tags && report.tags.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-muted-foreground">
                        Tags:
                      </span>
                      {report.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )} */}
                </CardContent>
              </Card>

              {/* Comments */}
              <ReportComments reportId={report.id} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Location Map */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MapViewer coords={report.locationCoords} />
                  <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{report.location}</p>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          asChild
                        >
                          <a
                            href={`https://www.google.com/maps?q=${report.locationCoords?.lat},${report.locationCoords?.lng}&z=17`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Open in Google Maps
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Report Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Take Action</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Support This Report
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    size="sm"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Report Issue
                  </Button>
                  <Separator />
                  <div className="text-xs text-muted-foreground">
                    <p className="mb-2">Help improve your community by:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Supporting valid reports</li>
                      <li>Adding helpful comments</li>
                      <li>Sharing with neighbors</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              {/* Similar Reports */}
              <SimilarReports
                currentReportId={report.id}
                relatedIds={report.relatedReports}
              />
            </div>
          </div>
        </div>
      </div>
      )
    </div>
  )
}
