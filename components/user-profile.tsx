"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, Calendar, Award, Settings, Edit } from "lucide-react"

export function UserProfile() {
  const user = {
    name: "John Doe",
    email: "john.doe@email.com",
    location: "Downtown, City Center",
    joinDate: "March 2023",
    level: "Community Champion",
    points: 1250,
    avatar: "/placeholder.svg?height=80&width=80",
  }

  const achievements = [
    { name: "First Reporter", description: "Submitted your first report" },
    { name: "Photo Pro", description: "Added photos to 10 reports" },
    { name: "Community Helper", description: "Received 50+ likes on reports" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Info */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="text-lg">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div>
            <h3 className="font-semibold text-lg">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <Badge variant="secondary" className="px-3 py-1">
            <Award className="h-3 w-3 mr-1" />
            {user.level}
          </Badge>
        </div>

        {/* User Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{user.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Member since {user.joinDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Award className="h-4 w-4 text-muted-foreground" />
            <span>{user.points} Community Points</span>
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-3">
          <h4 className="font-medium">Recent Achievements</h4>
          <div className="space-y-2">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Award className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button className="w-full" variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button className="w-full" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
