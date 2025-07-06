import { Card, CardContent } from "@/components/ui/card"

export function Stats() {
  const stats = [
    { number: "12,500+", label: "Reports Submitted" },
    { number: "8,200+", label: "Issues Resolved" },
    { number: "25,000+", label: "Community Members" },
    { number: "150+", label: "Cities Covered" },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Making a Real Impact</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of citizens working together to improve urban life
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
