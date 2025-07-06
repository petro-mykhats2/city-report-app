import { Card, CardContent } from "@/components/ui/card"
import { FileText, Star, ThumbsUp, CheckCircle } from "lucide-react"

export function UserStats() {
  const stats = [
    {
      title: "Reports Submitted",
      value: "23",
      change: "+3 this month",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Issues Resolved",
      value: "18",
      change: "+5 this month",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Community Likes",
      value: "156",
      change: "+12 this week",
      icon: ThumbsUp,
      color: "text-purple-600",
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "⭐ Excellent",
      icon: Star,
      color: "text-yellow-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </div>
              <div className={`h-12 w-12 rounded-lg bg-muted/50 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
