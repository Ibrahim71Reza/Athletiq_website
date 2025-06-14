// app/demo/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { ArrowLeft, Play, Youtube } from "lucide-react"
import Link from "next/link"

// Helper to extract video ID from various YouTube URL formats
const extractVideoId = (url: string): string | null => {
  if (!url) return null;
  // Regex updated to better handle shorts and various URL structures
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// --- UPDATED VIDEO IDs ---
const MAIN_APP_DEMO_VIDEO_ID = extractVideoId("https://www.youtube.com/watch?v=P4g1_g0ESOk") || "VIDEO_ID_EXTRACTION_FAILED_MAIN"; 

export default function DemoPage() {
  const [currentPlayingVideoId, setCurrentPlayingVideoId] = useState(MAIN_APP_DEMO_VIDEO_ID);
  const [customYoutubeUrl, setCustomYoutubeUrl] = useState("");

  const demoVideos = [
    {
      id: extractVideoId("https://www.youtube.com/watch?v=n10VKsnC1JQ") || "VIDEO_ID_EXTRACTION_FAILED_1",
      title: "Smart Workout Tracking",
      description: "Discover how our app uses AI to monitor your form, count reps, and provide real-time feedback for optimized workouts.",
    },
    {
      id: extractVideoId("https://www.youtube.com/shorts/wN8MuDSvXfA") || "VIDEO_ID_EXTRACTION_FAILED_2",
      title: "Instant Nutrition Scanner",
      description: "See how our vision-powered scanner instantly analyzes meals to track calories, macros, and nutrition insights.",
    },
    {
      id: extractVideoId("https://www.youtube.com/watch?v=ADEFaygmChI") || "VIDEO_ID_EXTRACTION_FAILED_3",
      title: "Join the Fitness Community",
      description: "Take a tour of our community features—from progress sharing to support groups and challenges that keep you motivated.",
    },
  ];
  
  // Handles loading a video from the custom URL input
  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(customYoutubeUrl);
    if (id) {
      setCurrentPlayingVideoId(id);
      const playerElement = document.getElementById('main-demo-player-card');
      playerElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      alert("Please enter a valid YouTube video URL.");
    }
  };

  // Handles selecting a video from the predefined grid
  const handlePredefinedVideoSelect = (videoId: string | null) => { // Allow videoId to be null
    if (videoId && videoId.startsWith("VIDEO_ID_EXTRACTION_FAILED")) {
        alert("Sorry, there was an issue loading this demo video link.");
        return;
    }
    if (videoId) { 
      setCurrentPlayingVideoId(videoId);
      const playerElement = document.getElementById('main-demo-player-card');
      playerElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      alert("Demo video for this feature is not available or the link is invalid.");
    }
  };
  
  useEffect(() => {
    // Check if the main demo ID failed to extract and clear it to show fallback
    if (MAIN_APP_DEMO_VIDEO_ID.startsWith("VIDEO_ID_EXTRACTION_FAILED")) {
        console.error("Failed to extract Main App Demo Video ID. Please check the URL.");
        setCurrentPlayingVideoId(""); // Clear to show fallback message
    }
  }, []); // Run once on mount

  // ... (The rest of your DemoPage component's return statement and JSX remains the same as your last provided version) ...
  // Ensure the Card onClick for demoVideos calls handlePredefinedVideoSelect(video.id)
  // And the disabled state for buttons in the grid uses:
  // disabled={!video.id || video.id.startsWith("VIDEO_ID_EXTRACTION_FAILED")}

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl"> 
          
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="ghost" size="icon" aria-label="Go back">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  App Demonstration Video
                </span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                See Athlytiq in action!
              </p>
            </div>
          </div>
          {/* Main Video Player */}
          {currentPlayingVideoId && !currentPlayingVideoId.startsWith("VIDEO_ID_EXTRACTION_FAILED") && (
            <Card id="main-demo-player-card" className="mb-12 shadow-2xl overflow-hidden border-2 border-primary/40 dark:border-primary/60">
              <CardHeader className="pb-2 pt-4 px-4 sm:px-6 bg-muted/20 dark:bg-gray-800/40">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-card-foreground">
                  <Youtube className="w-6 h-6 text-red-600" />
                  Video Player
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video w-full bg-black">
                  <iframe
                    key={currentPlayingVideoId} 
                    src={`https://www.youtube.com/embed/${currentPlayingVideoId}?autoplay=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&color=white&controls=1`}
                    title="YouTube Video Player"
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    loading="lazy"
                  />
                </div>
              </CardContent>
            </Card>
          )}
          {/* Fallback if no video ID is ready to play or if ID extraction failed */}
          {(!currentPlayingVideoId || currentPlayingVideoId.startsWith("VIDEO_ID_EXTRACTION_FAILED")) && (
            <Card className="mb-12 shadow-lg">
                <CardContent className="p-8 text-center text-muted-foreground">
                    <p className="text-lg">No video loaded or video link is invalid.</p>
                    <p className="text-sm mt-2">Paste a YouTube URL above or select a featured demo below.</p>
                    {MAIN_APP_DEMO_VIDEO_ID.startsWith("VIDEO_ID_EXTRACTION_FAILED") && <p className="text-xs mt-1 text-destructive">(Developer: Main demo video URL is invalid or could not be processed.)</p>}
                </CardContent>
            </Card>
          )}

          {/* Predefined Demo Videos Grid */}
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center sm:text-left">
              Watch Our Feature Demos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {demoVideos.map((video, index) => {
                const isVideoLinkValid = video.id && !video.id.startsWith("VIDEO_ID_EXTRACTION_FAILED");
                return (
                <Card
                  key={video.id || index}
                  className={`bg-card border-border hover:shadow-xl transition-all duration-300 flex flex-col group ${isVideoLinkValid ? 'cursor-pointer hover:border-primary/50 dark:hover:border-primary/70' : 'opacity-70'}`}
                  onClick={() => isVideoLinkValid && handlePredefinedVideoSelect(video.id)}
                >
                  <div className="aspect-video bg-muted dark:bg-gray-800 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                    <img 
                        src={isVideoLinkValid ? `https://img.youtube.com/vi/${video.id}/mqdefault.jpg` : "/placeholder-logo.svg"} // Use a placeholder if link is bad
                        alt={`${video.title} thumbnail`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.src = "/placeholder-logo.svg"; // Fallback to a generic placeholder
                            const parent = target.parentElement; 
                            if (parent && !parent.querySelector('.thumbnail-fallback-icon')) {
                                const fallbackIconContainer = document.createElement('div');
                                fallbackIconContainer.className = 'thumbnail-fallback-icon absolute inset-0 flex items-center justify-center';
                                fallbackIconContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-youtube text-muted-foreground/30"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17Z"/><path d="m10 15 5-3-5-3z"/></svg>';
                                parent.appendChild(fallbackIconContainer);
                            }
                        }}
                    />
                    {isVideoLinkValid && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end justify-start p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Play className="w-8 h-8 text-white drop-shadow-lg" />
                        </div>
                    )}
                    {!isVideoLinkValid && (
                        <div className="absolute inset-0 bg-muted dark:bg-gray-800 flex items-center justify-center">
                          <p className="text-xs text-destructive p-2 text-center">Video link issue</p>
                        </div>
                    )}
                  </div>
                  <CardContent className="p-4 flex-grow flex flex-col">
                    <h3 className="font-semibold text-base sm:text-lg mb-1.5 flex-grow line-clamp-2">{video.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-3">{video.description}</p>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-auto border-primary/30 hover:bg-primary/10 text-primary dark:border-primary/50 dark:hover:bg-primary/20 dark:text-primary-light"
                        disabled={!isVideoLinkValid}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Watch This Demo
                    </Button>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-primary via-primary/80 to-orange-500 text-white">
            {/* ... CTA Content from your previous code ... */}
            <CardContent className="p-6 sm:p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-sm sm:text-base mb-6 opacity-90">
                Download Athlytiq today and start your AI-powered fitness journey!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/download">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-md hover:bg-secondary/90">
                    Download App
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-black dark:hover:bg-white dark:hover:text-black dark:hover:font-bold dark:text-white hover:bg-black hover:font-bold hover:text-white w-full sm:w-auto shadow-md"
                  >
                    Sign Up Free
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}