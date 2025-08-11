export type ReportTypeFilter = "issues" | "reviews" | "events"

export type PriorityFilter = "high" | "medium" | "low"

export type TimeRangeFilter = "today" | "week" | "month"

export interface MapFilterState {
  types: ReportTypeFilter[]
  priorities: PriorityFilter[]
  timeRanges: TimeRangeFilter[]
  query: string
}

