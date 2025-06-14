"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Download, Smartphone } from "lucide-react"
import Link from "next/link"

const heroSlides = [
  {
    title: "Track Your Fitness Journey",
    subtitle: "Log workouts, monitor progress, and achieve your goals",
    image: "/placeholder.svg?height=600&width=300",
  },
  {
    title: "AI-Powered Nutrition",
    subtitle: "Get personalized diet recommendations based on your needs",
    image: "/placeholder.svg?height=600&width=300",
  },
  {
    title: "Connect & Inspire",
    subtitle: "Join a community of fitness enthusiasts worldwide",
    image: "/placeholder.svg?height=600&width=300",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-red-900/20" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Mobile app
                </span>
                <br />
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  Athlytiq
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-lg">{heroSlides[currentSlide].subtitle}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/download">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 text-lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download the app
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <span>Available on iOS & Android</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto w-80 h-96">
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ${
                    index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl" />
                    <img
                      src={slide.image || "/placeholder.svg"}
                      alt={slide.title}
                      className="w-full h-full object-cover rounded-3xl shadow-2xl"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {heroSlides.map((_, index) => (
                <button
                  title="Go to slide"
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? "bg-red-500 scale-125" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
