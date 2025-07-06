"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, AlertTriangle, Star, X, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore"

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

  const { toast } = useToast()

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

    if (!reportType || !title || !description || !selectedLocation || !category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
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
      contact: {
        name,
        email,
        sendUpdates,
      },
      createdAt: serverTimestamp(),
    }

    try {
      await addDoc(collection(db, "reports"), newReport)
      toast({
        title: "Report Submitted!",
        description: "Thank you for helping improve our city.",
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
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const addPhoto = () => {
    setPhotos([...photos, `/placeholder.svg?height=100&width=100&text=Photo${photos.length + 1}`])
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit a New Report</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium">What would you like to report?</Label>
            <RadioGroup value={reportType} onValueChange={(value) => setReportType(value as "issue" | "review" | "")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="issue" id="issue" />
                <Label htmlFor="issue" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Report an Issue
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="review" id="review" />
                <Label htmlFor="review" className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-green-500" />
                  Share a Review/Tip
                </Label>
              </div>
            </RadioGroup>
          </div>

          {reportType && (
            <>
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder={
                    reportType === "issue" ? "Brief description of the issue" : "What's great about this place?"
                  }
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Select required onValueChange={setSelectedLocation} value={selectedLocation}>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" variant="outline" size="sm">
                  Use Current Location
                </Button>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select required value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportType === "issue" ? (
                      <>
                        <SelectItem value="infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="safety">Safety</SelectItem>
                        <SelectItem value="cleanliness">Cleanliness</SelectItem>
                        <SelectItem value="transportation">Transportation</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="restaurant">Restaurant/Cafe</SelectItem>
                        <SelectItem value="park">Park/Recreation</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="attraction">Attraction</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority (for issues) */}
              {reportType === "issue" && (
                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Minor inconvenience</SelectItem>
                      <SelectItem value="medium">Medium - Needs attention</SelectItem>
                      <SelectItem value="high">High - Safety concern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Rating (for reviews) */}
              {reportType === "review" && (
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setRating(star)} className="p-1">
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
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder={
                    reportType === "issue"
                      ? "Provide detailed information about the issue..."
                      : "Share your experience and tips..."
                  }
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-3">
                <Label>Photos</Label>
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
                      <span className="text-xs text-muted-foreground mt-1">Add Photo</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Add up to 5 photos to help illustrate your report</p>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Contact Information (Optional)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="updates"
                    checked={sendUpdates}
                    onCheckedChange={(checked) => setSendUpdates(Boolean(checked))}
                  />
                  <Label htmlFor="updates" className="text-sm">
                    Send me updates about this report
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Submit Report
                </Button>
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
