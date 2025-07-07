"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, AlertTriangle, Star, Calendar, MapPin, Clock, Users, X } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface FilterItem {
  id: string
  label: string
  icon?: LucideIcon
  color?: string
}

export function MapFilters() {
  const [searchQuery, setSearchQuery] = useState("")
  const [distanceRange, setDistanceRange] = useState([5])
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const filterSections: {
    title: string
    icon: LucideIcon
    filters: FilterItem[]
  }[] = [
  {
    title: "Report Types",
    icon: Filter,
    filters: [
      { id: "issues", label: "City Issues", icon: AlertTriangle, color: "text-red-500" },
      { id: "reviews", label: "Reviews & Tips", icon: Star, color: "text-green-500" },
      { id: "events", label: "Community Events", icon: Users, color: "text-blue-500" },
    ],
  },
  {
    title: "Priority Level",
    icon: AlertTriangle,
    filters: [
      { id: "high", label: "High Priority", icon: undefined, color: "text-red-600" },
      { id: "medium", label: "Medium Priority", icon: undefined, color: "text-yellow-600" },
      { id: "low", label: "Low Priority", icon: undefined, color: "text-green-600" },
    ],
  },
  {
    title: "Time Period",
    icon: Clock,
    filters: [
      { id: "today", label: "Today", icon: Calendar },
      { id: "week", label: "This Week", icon: Calendar },
      { id: "month", label: "This Month", icon: Calendar },
    ],
  },
]


  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) => (prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]))
  }

  const clearAllFilters = () => {
    setActiveFilters([])
    setSearchQuery("")
    setDistanceRange([5])
  }

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
        {activeFilters.length > 0 && (
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {activeFilters.length} active
            </Badge>
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 px-2 text-xs">
              Clear all
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Location
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter address or landmark"
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Filter Sections */}
        {filterSections.map((section, sectionIndex) => (
          <div key={section.title} className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <section.icon className="h-4 w-4" />
              {section.title}
            </Label>
            <div className="space-y-2">
              {section.filters.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => toggleFilter(filter.id)}
                >
                  <Checkbox
                    id={filter.id}
                    checked={activeFilters.includes(filter.id)}
                    onChange={() => toggleFilter(filter.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    {filter.icon && <filter.icon className={`h-4 w-4 ${filter.color || "text-muted-foreground"}`} />}
                    <Label
                      htmlFor={filter.id}
                      className="text-sm cursor-pointer group-hover:text-foreground transition-colors"
                    >
                      {filter.label}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
            {sectionIndex < filterSections.length - 1 && <Separator />}
          </div>
        ))}

        {/* Distance Range */}
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Distance Range
          </Label>
          <div className="px-2 space-y-3">
            <Slider
              value={distanceRange}
              onValueChange={setDistanceRange}
              max={20}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>1 km</span>
              <Badge variant="outline" className="text-xs">
                {distanceRange[0]} km radius
              </Badge>
              <span>20 km</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Apply Button */}
        <Button className="w-full" size="lg">
          <Filter className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  )
}
