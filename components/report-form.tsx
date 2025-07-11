"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, AlertTriangle, Star, X, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore"
import { useTranslation } from "@/i18n"
import { NominatimAutocomplete } from "./NominatimAutocomplete"
import { MapPicker } from "./MapPicker"

export function ReportForm() {
  const [reportType, setReportType] = useState<"issue" | "review" | "">("")
  const [photos, setPhotos] = useState<string[]>([])
  const [rating, setRating] = useState(0)
  const [cities, setCities] = useState<{ id: string; name: string }[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>("")

  // Нові стани для полів форми
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [sendUpdates, setSendUpdates] = useState(false)
  const [locationCoords, setLocationCoords] = useState<{
    lat: number
    lng: number
  }>({
    lat: 50.0755, // 🟢 Прага
    lng: 14.4378,
  })

  const [latInput, setLatInput] = useState<string>("")
  const [lngInput, setLngInput] = useState<string>("")

  const { toast } = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    const fetchCities = async () => {
      const citiesCollectionRef = collection(db, "cities")
      const citySnapshot = await getDocs(citiesCollectionRef)
      const cityList = citySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }))
      setCities(cityList)
    }

    fetchCities()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate the *parsed* numeric values before submission
    if (
      !reportType ||
      !title ||
      !description ||
      !selectedLocation ||
      !category
    ) {
      toast({
        title: t("form.missingFieldsTitle"),
        description: t("form.missingFieldsDescription"),
        variant: "destructive",
      })
      return
    }

    const newReport = {
      type: reportType,
      title,
      description,
      location: selectedLocation,
      category,
      priority: reportType === "issue" ? priority : null,
      rating: reportType === "review" ? rating : null,
      photos,
      hasPhoto: photos.length > 0,
      likes: 0,
      comments: 0,
      views: 0,
      author: name,
      authorAvatar: "/placeholder.svg",
      status: reportType === "issue" ? "pending" : null,
      contact: {
        name,
        email: "test+" + Math.floor(Math.random() * 1000) + "@example.com",
        sendUpdates,
      },
      createdAt: serverTimestamp(),
      locationCoords: {
        lat: locationCoords.lat,
        lng: locationCoords.lng,
      },
    }

    try {
      await addDoc(collection(db, "reports"), newReport)
      toast({
        title: t("form.submissionSuccessTitle"),
        description: t("form.submissionSuccessDescription"),
      })

      // Очистка форми після успішної відправки
      setReportType("")
      setPhotos([])
      setRating(0)
      setSelectedLocation("")
      setTitle("")
      setDescription("")
      setCategory("")
      setPriority("")
      setName("")
      setEmail("")
      setSendUpdates(false)
    } catch (error) {
      console.error("Помилка при відправці в Firestore:", error)
      toast({
        title: t("form.submissionFailedTitle"),
        description: t("form.submissionFailedDescription"),
        variant: "destructive",
      })
    }
  }

  const addPhoto = () => {
    setPhotos([
      ...photos,
      `/placeholder.svg?height=100&width=100&text=Photo${photos.length + 1}`,
    ])
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("form.reportTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              {t("form.reportTypeLabel")}
            </Label>
            <RadioGroup
              value={reportType}
              onValueChange={(value) =>
                setReportType(value as "issue" | "review" | "")
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="issue" id="issue" />
                <Label htmlFor="issue" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  {t("form.issue")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="review" id="review" />
                <Label htmlFor="review" className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-green-500" />
                  {t("form.review")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {reportType && (
            <>
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">{t("form.title")} *</Label>
                <Input
                  id="title"
                  placeholder={
                    reportType === "issue"
                      ? t("form.issuePlaceholder")
                      : t("form.reviewPlaceholder")
                  }
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Select
                  required
                  onValueChange={setSelectedLocation}
                  value={selectedLocation}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder={t("form.locationPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              <Label htmlFor="location">{t("form.location")} *</Label>

              <Button type="button" variant="outline" size="sm">
                {t("form.useCurrentLocation")}
              </Button>

              <div className="space-y-2">
                <Label htmlFor="address">Адреса *</Label>
                <NominatimAutocomplete
                  onSelect={(coords, address) => {
                    setSelectedLocation(address)
                    setLocationCoords(coords)
                  }}
                />
              </div>
              <MapPicker
                markerCoords={locationCoords}
                onCoordsChange={(coords) => {
                  setLocationCoords(coords)

                  // [опційно] Reverse geocoding:
                  fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
                  )
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.display_name) {
                        setSelectedLocation(data.display_name)
                      }
                    })
                }}
              />

              {/* Category */}
              <div className="space-y-2">
                <Label>{t("form.category")} *</Label>
                <Select required value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("form.categoryPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {reportType === "issue" ? (
                      <>
                        <SelectItem value="infrastructure">
                          {t("form.categories.infrastructure")}
                        </SelectItem>
                        <SelectItem value="safety">
                          {t("form.categories.safety")}
                        </SelectItem>
                        <SelectItem value="cleanliness">
                          {t("form.categories.cleanliness")}
                        </SelectItem>
                        <SelectItem value="transportation">
                          {t("form.categories.transportation")}
                        </SelectItem>
                        <SelectItem value="utilities">
                          {t("form.categories.utilities")}
                        </SelectItem>
                        <SelectItem value="other">
                          {t("form.categories.other")}
                        </SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="restaurant">
                          {t("form.categories.restaurant")}
                        </SelectItem>
                        <SelectItem value="park">
                          {t("form.categories.park")}
                        </SelectItem>
                        <SelectItem value="shopping">
                          {t("form.categories.shopping")}
                        </SelectItem>
                        <SelectItem value="service">
                          {t("form.categories.service")}
                        </SelectItem>
                        <SelectItem value="attraction">
                          {t("form.categories.attraction")}
                        </SelectItem>
                        <SelectItem value="other">
                          {t("form.categories.other")}
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority (for issues) */}
              {reportType === "issue" && (
                <div className="space-y-2">
                  <Label>{t("form.priority")}</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("form.priorityPlaceholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        {t("form.priorityLow")}
                      </SelectItem>
                      <SelectItem value="medium">
                        {t("form.priorityMedium")}
                      </SelectItem>
                      <SelectItem value="high">
                        {t("form.priorityHigh")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Rating (for reviews) */}
              {reportType === "review" && (
                <div className="space-y-2">
                  <Label>{t("form.rating")}</Label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1"
                      >
                        <Star
                          className={`h-6 w-6 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">{t("form.description")} *</Label>
                <Textarea
                  id="description"
                  placeholder={
                    reportType === "issue"
                      ? t("form.issueDescription")
                      : t("form.reviewDescription")
                  }
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-3">
                <Label>{t("form.photos")}</Label>
                <div className="grid grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 5 && (
                    <button
                      type="button"
                      onClick={addPhoto}
                      className="h-24 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center hover:border-muted-foreground/50 transition-colors"
                    >
                      <Plus className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">
                        {t("form.addPhoto")}
                      </span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("form.maxPhotosInfo")}
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  {t("form.contactInfo")}
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("form.name")}</Label>
                    <Input
                      id="name"
                      placeholder={t("form.name")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("form.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("form.email")}
                      value={email}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("form.emailNote")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="updates"
                    checked={sendUpdates}
                    onCheckedChange={(checked) =>
                      setSendUpdates(Boolean(checked))
                    }
                  />
                  <Label htmlFor="updates" className="text-sm">
                    {t("form.updates")}
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  {t("form.submit")}
                </Button>
                <Button type="button" variant="outline">
                  {t("form.saveDraft")}
                </Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
