"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/i18n"

export function Stats() {
  const { t } = useTranslation()

  const stats = t("stats.items", { returnObjects: true }) as {
    number: string
    label: string
  }[]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("stats.sectionTitle")}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t("stats.sectionDescription")}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
