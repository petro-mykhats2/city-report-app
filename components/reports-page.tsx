"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("recent")

  // Mock data - expanded for demonstration
  const allReports = [
    {
      id: 1,
      type: "issue",
      title: "Large pothole causing vehicle damage on Main Street",
      description: "Deep pothole has been growing larger over the past month, causing damage to several vehicles.",
      location: "Main St & 5th Ave",
      category: "infrastructure",
      priority: "high",
      status: "pending",
      author: "John D.",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      time: "2 hours ago",
      date: "2024-01-15",
      likes: 12,
      comments: 3,
      views: 45,
      hasPhoto: true,
      photos: ["/placeholder.svg?height=200&width=300&text=Pothole"],
    },
    // {
    //   id: 2,
    //   type: "review",
    //   title: "Amazing coffee and atmosphere at Central Cafe",
    //   description: "Best latte in the city with incredibly friendly staff. The new renovation looks fantastic!",
    //   location: "Central Cafe, Downtown",
    //   category: "restaurant",
    //   rating: 5,
    //   author: "Sarah M.",
    //   authorAvatar: "/placeholder.svg?height=40&width=40",
    //   time: "4 hours ago",
    //   date: "2024-01-15",
    //   likes: 8,
    //   comments: 2,
    //   views: 67,
    //   hasPhoto: true,
    //   photos: ["/placeholder.svg?height=200&width=300&text=Cafe"],
    // },
    // {
    //   id: 3,
    //   type: "issue",
    //   title: "Broken street light creating safety hazard",
    //   description: "Street light has been out for over a week, making the area unsafe for pedestrians at night.",
    //   location: "Oak Street near Park",
    //   category: "safety",
    //   priority: "medium",
    //   status: "in-progress",
    //   author: "Mike R.",
    //   authorAvatar: "/placeholder.svg?height=40&width=40",
    //   time: "1 day ago",
    //   date: "2024-01-14",
    //   likes: 5,
    //   comments: 1,
    //   views: 89,
    //   hasPhoto: false,
    //   photos: [],
    // },
    // {
    //   id: 4,
    //   type: "review",
    //   title: "Beautiful park renovation exceeded expectations",
    //   description: "The new playground equipment and walking paths are fantastic. Great job by the city!",
    //   location: "Central Park",
    //   category: "park",
    //   rating: 4,
    //   author: "Emma L.",
    //   authorAvatar: "/placeholder.svg?height=40&width=40",
    //   time: "2 days ago",
    //   date: "2024-01-13",
    //   likes: 15,
    //   comments: 7,
    //   views: 123,
    //   hasPhoto: true,
    //   photos: ["/placeholder.svg?height=200&width=300&text=Park"],
    // },
    // {
    //   id: 5,
    //   type: "issue",
    //   title: "Overflowing trash bins in downtown area",
    //   description: "Multiple trash bins have been overflowing for days, creating unsanitary conditions.",
    //   location: "Downtown Shopping District",
    //   category: "cleanliness",
    //   priority: "medium",
    //   status: "pending",
    //   author: "Alex K.",
    //   authorAvatar: "/placeholder.svg?height=40&width=40",
    //   time: "3 days ago",
    //   date: "2024-01-12",
    //   likes: 9,
    //   comments: 4,
    //   views: 78,
    //   hasPhoto: true,
    //   photos: ["/placeholder.svg?height=200&width=300&text=Trash"],
    // },
    // {
    //   id: 6,
    //   type: "review",
    //   title: "Excellent service at City Library",
    //   description: "Staff is incredibly helpful and the new digital resources are amazing.",
    //   location: "City Central Library",
    //   category: "service",
    //   rating: 5,
    //   author: "Lisa P.",
    //   authorAvatar: "/placeholder.svg?height=40&width=40",
    //   time: "4 days ago",
    //   date: "2024-01-11",
    //   likes: 6,
    //   comments: 2,
    //   views: 56,
    //   hasPhoto: false,
    //   photos: [],
    // },
  ]

  const categories = [
    { id: "all", label: "All Reports", count: allReports.length },
    { id: "issues", label: "Issues", count: allReports.filter((r) => r.type === "issue").length },
    { id: "reviews", label: "Reviews", count: allReports.filter((r) => r.type === "review").length },
    {
      id: "infrastructure",
      label: "Infrastructure",
      count: allReports.filter((r) => r.category === "infrastructure").length,
    },
    { id: "safety", label: "Safety", count: allReports.filter((r) => r.category === "safety").length },
    { id: "cleanliness", label: "Cleanliness", count: allReports.filter((r) => r.category === "cleanliness").length },
  ]

  const filteredReports = allReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      activeCategory === "all" || report.type === activeCategory || report.category === activeCategory

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

  const ReportCard = ({ report, isListView = false }: { report: any; isListView?: boolean }) => (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/20 ${
        isListView ? "mb-4" : ""
      }`}
    >
      <CardContent className={`p-0 ${isListView ? "flex" : ""}`}>
        {/* Image */}
        {report.hasPhoto && report.photos.length > 0 && (
          <div className={`relative overflow-hidden ${isListView ? "w-48 flex-shrink-0" : "aspect-video w-full"}`}>
            <img
              src={report.photos[0] || "/placeholder.svg"}
              alt={report.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3">
              <Badge
                className={`${
                  report.type === "issue" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                } text-white`}
              >
                {report.type === "issue" ? (
                  <AlertTriangle className="h-3 w-3 mr-1" />
                ) : (
                  <Star className="h-3 w-3 mr-1" />
                )}
                {report.type === "issue" ? "Issue" : "Review"}
              </Badge>
            </div>
            {report.photos.length > 1 && (
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="bg-black/50 text-white">
                  <Camera className="h-3 w-3 mr-1" />
                  {report.photos.length}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4 flex-1">
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
                  <Badge variant="outline">{report.type === "issue" ? "Issue" : "Review"}</Badge>
                </div>
              )}
              <h3 className="font-semibold text-lg leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                {report.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{report.description}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span>{report.location}</span>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {report.type === "issue" && report.priority && (
              <Badge className={getPriorityColor(report.priority)}>{report.priority} priority</Badge>
            )}
            {report.type === "issue" && report.status && (
              <Badge className={getStatusColor(report.status)}>
                {report.status === "in-progress" ? "In Progress" : report.status}
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
                <AvatarImage src={report.authorAvatar || "/placeholder.svg"} alt={report.author} />
                <AvatarFallback className="text-xs">
                  {report.author
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{report.author}</span>
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{report.time}</span>
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
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Reports</h1>
        <p className="text-muted-foreground">
          Discover what's happening in your community and contribute to making it better
        </p>
      </div>

      {/* Search and Controls */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports, locations, or categories..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Sort by: {sortBy === "recent" ? "Recent" : sortBy === "popular" ? "Popular" : "Oldest"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("recent")}>Most Recent</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("popular")}>Most Popular</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("oldest")}>Oldest First</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
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
              Showing {filteredReports.length} {filteredReports.length === 1 ? "report" : "reports"}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          {/* Reports Grid/List */}
          {filteredReports.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} isListView={viewMode === "list"} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No reports found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search terms or filters</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("all")
                }}
              >
                Clear filters
              </Button>
            </div>
          )}

          {/* Load More Button */}
          {filteredReports.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Reports
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
