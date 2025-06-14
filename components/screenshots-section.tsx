"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const screenshotCategories = [
  {
    id: "workout",
    name: "Workout Tracking",
    screenshots: [
      "/placeholder.svg?height=600&width=300",
      "/placeholder.svg?height=600&width=300",
      "/placeholder.svg?height=600&width=300",
      "/placeholder.svg?height=600&width=300",
    ],
  },
  {
    id: "nutrition",
    name: "Nutrition & Diet",
    screenshots: [
      "/placeholder.svg?height=600&width=300",
      "/placeholder.svg?height=600&width=300",
      "/placeholder.svg?height=600&width=300",
      "/placeholder.svg?height=600&width=300",
    ],
  },
  {
    id: "analytics",
    name: "Progress Analytics",
    screenshots: [
      "/placeholder.svg?height=600&width=300",
      "/placeholder.svg?height=600&width=300",
      "/placeholder.svg?height=600&width=300",
    ],
  },
  {
    id: "community",
    name: "Community Features",
    screenshots: [
      "/placeholder.svg?height=600&width=300",
      "/placeholder.svg?height=600&width=300",
      "/placeholder.svg?height=600&width=300",
    ],
  },
]

export function ScreenshotsSection() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)

  const currentScreenshots = screenshotCategories[activeCategory].screenshots

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, currentScreenshots.length - 2))
  }

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + Math.max(1, currentScreenshots.length - 2)) % Math.max(1, currentScreenshots.length - 2),
    )
  }

  return (
    <section id="screenshots" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              App Screenshots
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">Explore the beautiful and intuitive interface of Athlytiq</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {screenshotCategories.map((category, index) => (
            <Button
              key={category.id}
              variant={activeCategory === index ? "default" : "outline"}
              onClick={() => {
                setActiveCategory(index)
                setCurrentSlide(0)
              }}
              className={activeCategory === index ? "bg-gradient-to-r from-red-500 to-orange-500" : ""}
            >
              {category.name}
            </Button>
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-center space-x-4 overflow-hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="absolute left-4 z-10 bg-background/80 backdrop-blur-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div
              className="flex space-x-4 transition-transform duration-300"
              style={{ transform: `translateX(-${currentSlide * 320}px)` }}
            >
              {currentScreenshots.map((screenshot, index) => (
                <div key={index} className="flex-shrink-0">
                  <div className="w-72 h-96 bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-2 shadow-2xl">
                    <img
                      src={screenshot || "/placeholder.svg"}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="absolute right-4 z-10 bg-background/80 backdrop-blur-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
