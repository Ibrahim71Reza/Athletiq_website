import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Download, Star, ArrowLeft, Apple, Play } from "lucide-react"
import Link from "next/link"

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Download Athlytiq
            </span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Get the{" "}
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  Athlytiq
                </span>{" "}
                app
              </h2>
              <p className="text-xl text-muted-foreground">
                Transform your fitness journey with AI-powered tracking, personalized nutrition, and a supportive
                community.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-lg">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg">Available on iOS and Android</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg">Rated 4.8/5 by users worldwide</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                  <Download className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg">Free to download and use</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white">
                <Apple className="mr-2 h-5 w-5" />
                Download for iOS
              </Button>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <Play className="mr-2 h-5 w-5" />
                Get it on Google Play
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto w-80 h-96">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl" />
              <img
                src="/placeholder.svg?height=600&width=300"
                alt="Athlytiq App Screenshot"
                className="w-full h-full object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Athlytiq</span>
            ?
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-center">Smart Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  AI-powered workout and nutrition tracking that adapts to your lifestyle and goals.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-center">Personalized Plans</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Get custom workout routines and meal plans based on your preferences and progress.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-center">Global Community</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Connect with millions of fitness enthusiasts and share your journey to success.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
