import { LocationForm } from "@/components/AddLocationForm"
import { Hero } from "@/components/hero"
// import { LocationsList } from "@/components/LocStList"
// import { Features } from "@/components/features"
// import { Stats } from "@/components/stats"
// import { CTA } from "@/components/cta"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <LocationForm />
      {/* <LocationsList /> */}
      <Hero />
      {/* <Features />
     <Stats /> 
     <CTA /> */}
    </div>
  )
}
