import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Map, Camera, Star, FileText, Users, Bell, Shield } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description: "Find locations and issues quickly with our intelligent search system",
      badge: "Enhanced",
    },
    {
      icon: Map,
      title: "Interactive Map",
      description: "Explore your city with dynamic markers for reports and reviews",
      badge: "Live",
    },
    {
      icon: Camera,
      title: "Photo Upload",
      description: "Add visual context to your reports with photo attachments",
      badge: "Visual",
    },
    {
      icon: Star,
      title: "Rating System",
      description: "Rate and review local places to help others make informed decisions",
      badge: "Community",
    },
    {
      icon: FileText,
      title: "Issue Reporting",
      description: "Report city problems like potholes, broken infrastructure, and more",
      badge: "Civic",
    },
    {
      icon: Users,
      title: "User Profiles",
      description: "Track your contributions and build your community reputation",
      badge: "Personal",
    },
    {
      icon: Bell,
      title: "Real-time Updates",
      description: "Get notified when issues you reported are addressed or updated",
      badge: "Instant",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security measures",
      badge: "Protected",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Improve Your City</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make urban reporting simple, effective, and engaging
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
