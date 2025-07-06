"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

export function MapFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label>Search Location</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Enter address or landmark" className="pl-10" />
          </div>
        </div>

        {/* Report Types */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Report Types</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="issues" defaultChecked />
              <Label htmlFor="issues" className="text-sm">
                City Issues
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="reviews" defaultChecked />
              <Label htmlFor="reviews" className="text-sm">
                Reviews & Tips
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="events" />
              <Label htmlFor="events" className="text-sm">
                Community Events
              </Label>
            </div>
          </div>
        </div>

        {/* Priority Level */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Priority Level</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="high" defaultChecked />
              <Label htmlFor="high" className="text-sm">
                High Priority
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="medium" defaultChecked />
              <Label htmlFor="medium" className="text-sm">
                Medium Priority
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="low" />
              <Label htmlFor="low" className="text-sm">
                Low Priority
              </Label>
            </div>
          </div>
        </div>

        {/* Distance Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Distance Range</Label>
          <div className="px-2">
            <Slider defaultValue={[5]} max={20} min={1} step={1} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 km</span>
              <span>20 km</span>
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Time Period</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="today" />
              <Label htmlFor="today" className="text-sm">
                Today
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="week" defaultChecked />
              <Label htmlFor="week" className="text-sm">
                This Week
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="month" defaultChecked />
              <Label htmlFor="month" className="text-sm">
                This Month
              </Label>
            </div>
          </div>
        </div>

        <Button className="w-full">Apply Filters</Button>
      </CardContent>
    </Card>
  )
}
