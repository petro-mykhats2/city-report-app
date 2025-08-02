"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface PhotoGalleryProps {
  photos: string[]
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState(0)

  if (!photos || photos.length === 0) return null

  return (
    <div className="space-y-4">
      {/* Main photo */}
      <div className="relative group">
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative aspect-video rounded-lg overflow-hidden cursor-pointer">
              <img
                src={photos[selectedPhoto] || "/placeholder.svg"}
                alt={`Photo ${selectedPhoto + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="h-8 w-8 text-white drop-shadow-lg" />
                </div>
              </div>
              {photos.length > 1 && (
                <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {selectedPhoto + 1} / {photos.length}
                </div>
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full p-0">
            <div className="relative">
              <img
                src={photos[selectedPhoto] || "/placeholder.svg"}
                alt={`Photo ${selectedPhoto + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              {photos.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={() =>
                      setSelectedPhoto((prev) =>
                        prev > 0 ? prev - 1 : photos.length - 1
                      )
                    }
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={() =>
                      setSelectedPhoto((prev) =>
                        prev < photos.length - 1 ? prev + 1 : 0
                      )
                    }
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Thumbnail navigation */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setSelectedPhoto(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedPhoto === index
                  ? "border-primary shadow-md"
                  : "border-transparent hover:border-muted-foreground/30"
              }`}
            >
              <img
                src={photo || "/placeholder.svg"}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
