"use client"

import { useMemo } from "react"
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
import type {
  MapFilterState,
  PriorityFilter,
  ReportTypeFilter,
  TimeRangeFilter,
} from "@/types/filters"

interface FilterItem {
  id: string
  label: string
  icon?: LucideIcon
  color?: string
}

interface MapFiltersProps {
  value: MapFilterState
  onChange: (next: MapFilterState) => void
}

export function MapFilters({ value, onChange }: MapFiltersProps) {
  const { query, types, priorities, timeRanges } = value

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

  const clearAllFilters = () => {
    onChange({ types: [], priorities: [], timeRanges: [], query: "" })
  }

  const isTypeActive = (id: ReportTypeFilter) => types.includes(id)
  const isPriorityActive = (id: PriorityFilter) => priorities.includes(id)
  const isTimeActive = (id: TimeRangeFilter) => timeRanges.includes(id)

  const toggleArrayValue = <T extends string>(arr: T[], id: T): T[] =>
    arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
        {[...types, ...priorities, ...timeRanges].length > 0 && (
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {[...types, ...priorities, ...timeRanges].length} active
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
              value={query}
              onChange={(e) => onChange({ ...value, query: e.target.value })}
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => onChange({ ...value, query: "" })}
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
                  onClick={() => {
                    if (section.title === "Report Types") {
                      onChange({ ...value, types: toggleArrayValue(types, filter.id as ReportTypeFilter) })
                    } else if (section.title === "Priority Level") {
                      onChange({ ...value, priorities: toggleArrayValue(priorities, filter.id as PriorityFilter) })
                    } else if (section.title === "Time Period") {
                      onChange({ ...value, timeRanges: toggleArrayValue(timeRanges, filter.id as TimeRangeFilter) })
                    }
                  }}
                >
                  <Checkbox
                    id={filter.id}
                    checked={
                      section.title === "Report Types"
                        ? isTypeActive(filter.id as ReportTypeFilter)
                        : section.title === "Priority Level"
                        ? isPriorityActive(filter.id as PriorityFilter)
                        : isTimeActive(filter.id as TimeRangeFilter)
                    }
                    onChange={() => {
                      if (section.title === "Report Types") {
                        onChange({ ...value, types: toggleArrayValue(types, filter.id as ReportTypeFilter) })
                      } else if (section.title === "Priority Level") {
                        onChange({ ...value, priorities: toggleArrayValue(priorities, filter.id as PriorityFilter) })
                      } else if (section.title === "Time Period") {
                        onChange({ ...value, timeRanges: toggleArrayValue(timeRanges, filter.id as TimeRangeFilter) })
                      }
                    }}
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

        <Separator />

        {/* Apply Button (no-op, since filters are applied live) */}
        <Button className="w-full" size="lg" variant="secondary">
          <Filter className="h-4 w-4 mr-2" />
          Filters are Live
        </Button>
      </CardContent>
    </Card>
  )
}
