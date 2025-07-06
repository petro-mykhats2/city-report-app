'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, MessageSquare, Camera } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/i18n" // шлях до твого i18n.ts

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {t("hero.title", { action: t("hero.action") })}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("hero.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild>
              <Link href="/map">
                {t("hero.explore")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/report">{t("hero.submit")}</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{t("hero.feature1.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("hero.feature1.text")}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{t("hero.feature2.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("hero.feature2.text")}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{t("hero.feature3.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("hero.feature3.text")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
