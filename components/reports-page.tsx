"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  AlertTriangle,
  Star,
  MapPin,
  Clock,
  ThumbsUp,
  MessageCircle,
  Camera,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown,
  TrendingUp,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { formatTimeToNow } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import Link from "next/link"

export function ReportsPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("recent")

  const [allReports, setAllReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { i18n } = useTranslation()
  const currentLang = i18n.language

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const q = query(collection(db, "reports"), orderBy("createdAt", "desc"))
        const snapshot = await getDocs(q)
        const reports = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setAllReports(reports)
        console.log("Fetched reports:", reports)
      } catch (error) {
        console.error("Error fetching reports:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  const categories = [
    { id: "all", label: t("reportsPage.allReports"), count: allReports.length },
    {
      id: "issue",
      label: t("reportsPage.issues"),
      count: allReports.filter((r) => r.type === "issue").length,
    },
    {
      id: "review",
      label: t("reportsPage.reviews"),
      count: allReports.filter((r) => r.type === "review").length,
    },
    {
      id: "infrastructure",
      label: t("reportsPage.infrastructure"),
      count: allReports.filter((r) => r.category === "infrastructure").length,
    },
    {
      id: "safety",
      label: t("reportsPage.safety"),
      count: allReports.filter((r) => r.category === "safety").length,
    },
    {
      id: "cleanliness",
      label: t("reportsPage.cleanliness"),
      count: allReports.filter((r) => r.category === "cleanliness").length,
    },
  ]

  const filteredReports = allReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      activeCategory === "all" ||
      report.type === activeCategory ||
      report.category === activeCategory

    return matchesSearch && matchesCategory
  })

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

  const ReportCard = ({
    report,
    isListView = false,
  }: {
    report: any
    isListView?: boolean
  }) => {
    // Підставляємо плейсхолдер, якщо немає фото
    const displayPhotos =
      report.photos && report.photos.length > 0
        ? report.photos
        : [`/placeholder.svg?height=100&width=100&text=No+Photo`]

    return (
      <Link href={`/reports/${report.id}`} className="text-blue-500 underline">
        <Card
          className={`group hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/20 ${
            isListView ? "mb-4" : ""
          }`}
        >
          <CardContent
            className={`p-0 ${isListView ? "flex flex-col md:flex-row" : "flex flex-col h-full"}`}
          >
            {/* Image */}
            {(report.hasPhoto || displayPhotos.length > 0) && (
              <div
                className={`relative overflow-hidden ${isListView ? "w-full md:w-48 flex-shrink-0" : "aspect-video w-full"}`}
              >
                <img
                  src={displayPhotos[0] || "/placeholder.svg"}
                  alt={report.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
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
                    {t(`reportCard.${report.type}`)}
                  </Badge>
                </div>
                {displayPhotos.length > 1 && (
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant="secondary"
                      className="bg-black/50 text-white"
                    >
                      <Camera className="h-3 w-3 mr-1" />
                      {displayPhotos.length}
                    </Badge>
                  </div>
                )}
              </div>
            )}
            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  {!report.hasPhoto && (
                    <div className="flex items-center gap-2 mb-2">
                      {report.type === "issue" ? (
                        <AlertTriangle
                          className={`h-4 w-4 ${report.priority === "high" ? "text-red-500" : "text-yellow-500"}`}
                        />
                      ) : (
                        <Star className="h-4 w-4 text-green-500" />
                      )}
                      <Badge variant="outline">
                        {t(`reportCard.${report.type}`)}
                      </Badge>
                    </div>
                  )}
                  <h3 className="font-semibold text-lg leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {report.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                    {report.description}
                  </p>
                </div>
              </div>

              {/* Grouped bottom content */}
              <div className="mt-auto space-y-3">
                {/* Location */}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{report.location}</span>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {report.type === "issue" && report.priority && (
                    <Badge className={getPriorityColor(report.priority)}>
                      {t(`reportCard.priority.${report.priority}`)}
                    </Badge>
                  )}
                  {report.type === "issue" && report.status && (
                    <Badge className={getStatusColor(report.status)}>
                      {t(`reportCard.status.${report.status}`)}
                    </Badge>
                  )}
                  {report.type === "review" && report.rating && (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < report.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={report.authorAvatar || "/placeholder.svg"}
                        alt={report.author}
                      />
                      <AvatarFallback className="text-xs">
                        {report.author
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {report.author}
                    </span>
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatTimeToNow(
                        report.createdAt.toDate(),
                        i18n.language
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{report.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{report.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t("reportsPage.communityReports")}
        </h1>
        <p className="text-muted-foreground">{t("reportsPage.description")}</p>
      </div>

      {/* Search and Controls */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("reportsPage.searchPlaceholder")}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  {t("reportsPage.sortBy")}:{" "}
                  {sortBy === "recent"
                    ? t("reportsPage.mostRecent")
                    : sortBy === "popular"
                      ? t("reportsPage.mostPopular")
                      : t("reportsPage.oldestFirst")}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("recent")}>
                  {t("reportsPage.mostRecent")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("popular")}>
                  {t("reportsPage.mostPopular")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                  {t("reportsPage.oldestFirst")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex flex-col gap-1 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <span className="text-xs font-medium">{category.label}</span>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {t("reportsPage.showingReports", {
                count: filteredReports.length,
              })}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          {/* Reports Grid/List */}
          {filteredReports.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  isListView={viewMode === "list"}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t("reportsPage.noReportsFound")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("reportsPage.tryAdjustingSearch")}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("all")
                }}
              >
                {t("reportsPage.clearFilters")}
              </Button>
            </div>
          )}

          {/* Load More Button */}
          {filteredReports.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                {t("reportsPage.loadMoreReports")}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
