"use client"

import type React from "react"

import { useEffect, useState , useRef , useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import ParticleEffects from "@/components/particle-effects"
import {
  supabase,
  type UserFeedback,
  type Comment,
  createCommentWithProfile,
  fetchCommentsWithProfiles,
  testDatabaseConnection,
} from "@/lib/supabase"
import { Header } from "@/components/header"
import {
  Star,
  Play,
  Download,
  Users,
  Zap,
  Target,
  ChevronRight,
  Quote,
  Brain,
  Activity,
  Heart,
  Camera,
  Trophy,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Send,
  Apple,
  CheckCircle,
  Shield,
  Globe,
  Dumbbell,
  TrendingUp,
  BarChart3,
  MessageCircle,
  ArrowRight,
  AlertCircle,
  ChevronLeft
} from "lucide-react"
import Link from "next/link"
import { FitnessChatbot } from "@/components/fitness-chatbot";

// Define a type for your fetched exercise demo data
interface ExerciseDemo {
  id: string;
  title: string;
  description?: string;
  youtube_url: string;
  category: string;
  difficulty_level?: string;
  duration_minutes?: number;
}

// Define a type for the grouped categories
interface ExerciseCategoryGroup {
  categoryName: string;
  icon?: React.ElementType;
  demos: ExerciseDemo[];
}

export default function HomePage() {
  const [feedback, setFeedback] = useState<UserFeedback[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [dbConnected, setDbConnected] = useState<boolean | null>(null)
  const [exerciseDemoCategories, setExerciseDemoCategories] = useState<ExerciseCategoryGroup[]>([]);
  const [loadingDemos, setLoadingDemos] = useState(true);

  // Helper function
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    // This regex handles standard, short, and shorts URLs
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeVideos, setActiveVideos] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchData()
    checkUser()
    checkDatabaseConnection()
    fetchExerciseDemos();
  }, [])

  const fetchExerciseDemos = async () => {
    setLoadingDemos(true);
    try {
      const { data, error } = await supabase
        .from("exercise_demos")
        .select("id, title, description, youtube_url, category, difficulty_level, duration_minutes")
        .order("category", { ascending: true })
        .order("created_at", { ascending: false, nullsFirst: false });

      if (error) {
        console.error("Error fetching exercise demos:", error);
        setExerciseDemoCategories([]);
      } else if (data) {
        const grouped: { [key: string]: ExerciseDemo[] } = {};
        const initialActiveVideos: { [key: string]: string } = {};
        data.forEach(demo => {
          if (!grouped[demo.category]) {
            grouped[demo.category] = [];
            // Set the first demo of each category as the initially active one
            if (demo.youtube_url) {
              initialActiveVideos[demo.category] = demo.youtube_url;
            }
          }
          grouped[demo.category].push(demo);
        });
        
        setActiveVideos(initialActiveVideos); // Set initial active videos

        const iconMap: { [key: string]: React.ElementType } = {
          "Strength": Dumbbell, "Cardio": Heart, "Flexibility": Activity, "Core": Zap, "Physical": Activity, // Added Physical
        };

        const categoryArray: ExerciseCategoryGroup[] = Object.keys(grouped).map(categoryName => ({
          categoryName,
          icon: iconMap[categoryName] || Activity,
          demos: grouped[categoryName],
        }));
        setExerciseDemoCategories(categoryArray);
      }
    } catch (err) {
      console.error("Client-side error fetching demos:", err);
      setExerciseDemoCategories([]);
    } finally {
      setLoadingDemos(false);
    }
  };

  const handleVideoSelect = useCallback((categoryName: string, videoUrl: string) => {
    setActiveVideos(prev => ({
      ...prev,
      [categoryName]: videoUrl,
    }));
  }, []);

  const checkDatabaseConnection = async () => {
    const { connected } = await testDatabaseConnection()
    setDbConnected(connected)
    console.log("Database connection status:", connected)
  }

  const checkUser = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error) {
        console.log("No authenticated user:", error.message)
      }
      setUser(user)
    } catch (error) {
      console.error("Error checking user:", error)
    }
  }

  const fetchData = async () => {
    try {
      // Fetch feedback with error handling
      const feedbackResult = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6)

      if (feedbackResult.error) {
        console.error("Error fetching feedback:", feedbackResult.error)
        setFeedback(mockFeedback)
      } else {
        setFeedback(feedbackResult.data || mockFeedback)
      }

      // Fetch comments with updated profile names
      const { data: commentsData, error: commentsError } = await fetchCommentsWithProfiles(6)

      if (commentsError) {
        console.error("Error fetching comments:", commentsError)
        setComments(mockComments)
      } else {
        setComments(commentsData || mockComments)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setFeedback(mockFeedback)
      setComments(mockComments)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) {
      alert("Please enter a comment")
      return
    }

    if (newComment.trim().length < 3) {
      alert("Comment must be at least 3 characters long")
      return
    }

    if (!user?.id) {
      alert("Please sign in to post comments")
      window.location.href = "/auth"
      return
    }

    setSubmittingComment(true)

    try {
      const { data, error } = await createCommentWithProfile(user.id, newComment)

      if (error) {
        console.error("Comment submission failed:", error)
        alert(`Failed to post comment: ${error.message}`)
        return
      }

      console.log("Comment submitted successfully:", data)
      setNewComment("")
      await fetchData() // Refresh the comments to show the new one
      alert("Comment posted successfully!")
    } catch (error) {
      console.error("Unexpected error:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setSubmittingComment(false)
    }
  }

  const stats = [
    { icon: Users, label: "Active Users", value: "500K+" },
    { icon: Dumbbell, label: "Workouts Tracked", value: "10M+" },
    { icon: Target, label: "Goals Achieved", value: "250K+" },
    { icon: Trophy, label: "Countries", value: "50+" },
  ]

  const mainFeatures = [
    {
      icon: Activity,
      title: "Workout Tracking",
      description: "Advanced exercise logging with real-time form analysis and progress visualization.",
      features: ["Exercise database", "Form analysis", "Progress charts", "Workout history"],
    },
    {
      icon: Heart,
      title: "Health Monitoring",
      description: "Comprehensive health metrics tracking with AI-powered insights and recommendations.",
      features: ["Vital signs tracking", "Health reports", "Recovery analysis", "Trend monitoring"],
    },
    {
      icon: Brain,
      title: "AI Nutrition",
      description: "Intelligent diet recommendations based on your goals, preferences, and location.",
      features: ["Meal planning", "Macro tracking", "Smart recipes", "Nutrition coaching"],
      path: "/nutrition-coach",
    },
    {
      icon: Camera,
      title: "Food Scanning",
      description: "Instant food recognition and nutritional analysis using computer vision technology.",
      features: ["Food recognition", "Calorie counting", "Macro analysis", "Nutrition database"],
      path: "/food-scanner",
    },
  ]

  const scrollDemos = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8; // Scroll by 80% of visible width
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Mock feedback data if database is empty
  const mockFeedback = [
    {
      id: "1",
      user_id: "user1",
      rating: 5,
      comment:
        "Amazing app! The AI recommendations are spot on and have helped me reach my fitness goals faster than ever.",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      user_id: "user2",
      rating: 5,
      comment: "The workout tracking is incredibly detailed. Love how it analyzes my form and suggests improvements.",
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      user_id: "user3",
      rating: 4,
      comment: "Great community features! Connecting with other athletes has been really motivating.",
      created_at: new Date().toISOString(),
    },
    {
      id: "4",
      user_id: "user4",
      rating: 5,
      comment: "The nutrition scanning feature is a game-changer. Makes tracking macros so much easier!",
      created_at: new Date().toISOString(),
    },
    {
      id: "5",
      user_id: "user5",
      rating: 4,
      comment: "Love the AI coaching suggestions. It's like having a personal trainer in my pocket.",
      created_at: new Date().toISOString(),
    },
    {
      id: "6",
      user_id: "user6",
      rating: 5,
      comment: "The progress tracking and analytics are incredible. Really helps me stay motivated!",
      created_at: new Date().toISOString(),
    },
  ]

  // Mock comments data if database is empty
  const mockComments = [
    {
      id: "1",
      user_id: "athlete1",
      content: "Just completed my first marathon training with Athlytiq! The AI coaching made all the difference. 🏃‍♂️",
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "2",
      user_id: "athlete2",
      content: "The nutrition recommendations helped me lose 20 pounds while gaining muscle. Incredible results! 💪",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: "3",
      user_id: "athlete3",
      content: "Form analysis feature caught my deadlift technique issues. Prevented injury and improved my PR!",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: "4",
      user_id: "athlete4",
      content: "Community challenges keep me motivated. Love competing with athletes worldwide! 🌍",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
    {
      id: "5",
      user_id: "athlete5",
      content: "Food scanning is so accurate! Scanned my homemade smoothie and got perfect macro breakdown.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
    {
      id: "6",
      user_id: "athlete6",
      content: "Recovery tracking helped me optimize my sleep and training schedule. Game changer! 😴",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
  ]

  const displayFeedback = feedback.length > 0 ? feedback : mockFeedback
  const displayComments = comments.length > 0 ? comments : mockComments

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <ParticleEffects variant="fitness" intensity="medium" />

      {/* Database Status Indicator */}
      {dbConnected === false && (
        <div className="fixed top-20 left-4 right-4 z-50 max-w-md mx-auto">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Database offline - comments will be saved locally
            </p>
          </div>
        </div>
      )}

      <section
        id="home"
        className="relative pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden"
      >
        {/* Background Video — Light Mode */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30 z-0 block dark:hidden pointer-events-none"
        >
          <source src="abc" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Background Video — Dark Mode */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30 z-0 hidden dark:block pointer-events-none"
        >
          <source src="/Video_dark.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Particle Layer */}
        <div className="absolute inset-0 z-10">
          {/* ⬇️ Place your Particle Component here */}
          {/* <ParticlesComponent /> or Particles.js canvas etc. */}
        </div>

        {/* Main Content */}
        <div className="container mx-auto relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight drop-shadow-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 dark:from-red-400 dark:via-orange-400 dark:to-red-500 bg-clip-text text-transparent">
                  TRACK FITNESS IN
                </span>
                <br />
                <span className="text-gray-600 dark:text-gray-400">A SMARTER WAY</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-gray-600 dark:text-gray-300 max-w-lg drop-shadow-sm"
              >
                AI-powered fitness tracking that adapts to your goals, analyzes your form, and optimizes your nutrition.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 mb-8 sm:mb-12"
              >
                <Button
                  size="lg"
                  onClick={() => (window.location.href = "/auth")}
                  className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-400 hover:text-white transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold"
                >
                  Start Training
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => (window.location.href = "/demo")}
                  className="border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Watch Demo
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-2 gap-4 sm:gap-8"
              >
                {stats.slice(0, 2).map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - App Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative order-last lg:order-last"
            >
              <div className="relative mx-auto w-80 sm:w-72 lg:w-80 max-w-full h-[35rem] sm:h-[34rem] lg:h-[40rem] bg-gray-900 dark:bg-white rounded-3xl p-2 shadow-2xl">
                <div className="w-full h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center">
                  <img
                    src="/App_screenshot.jpg"
                    alt="App Screenshot"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>

              {/* Floating Dumbbell */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="absolute -top-3 -right-3 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-400 dark:to-orange-400 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Dumbbell className="w-6 h-6 sm:w-7 sm:h-7 text-white dark:text-black" />
              </motion.div>

              {/* Floating Heart */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                className="absolute -bottom-3 -left-3 w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md"
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 text-gray-900 dark:text-white">
              ABOUT <span className="text-gray-600 dark:text-gray-300">Athlytiq</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're revolutionizing fitness through AI-powered technology, combining workout tracking, health
              monitoring, intelligent nutrition, and community support.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered",
                description: "Advanced algorithms that learn and adapt to your fitness journey",
              },
              {
                icon: Shield,
                title: "Privacy First",
                description: "Enterprise-grade security to protect your personal data",
              },
              {
                icon: Users,
                title: "Community",
                description: "Built by athletes, for athletes, with community at the core",
              },
              {
                icon: TrendingUp,
                title: "Results Driven",
                description: "Proven methods backed by sports science and data",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-red-500 dark:hover:border-red-400 hover:shadow-lg hover:shadow-red-500/10 dark:hover:shadow-red-400/20 transition-all duration-300 h-full">
                  <CardContent className="p-6 sm:p-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-400 dark:to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                      <value.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white dark:text-black" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{value.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - UPDATED LINKING */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto relative z-10">
          <motion.div /* ... section title ... */ >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 text-gray-900 dark:text-white text-center">
              POWERFUL <span className="text-gray-600 dark:text-gray-300">FEATURES</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover the cutting-edge technology that makes Athlytiq the most advanced fitness ecosystem
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">
            {mainFeatures.map((feature, index) => {
              // Card content is defined once
              const CardItself = (
                <Card className="bg-card dark:bg-gray-900 border-border hover:border-primary dark:hover:border-primary-light hover:shadow-xl dark:hover:shadow-primary/20 transition-all duration-300 h-full flex flex-col group-hover:ring-2 group-hover:ring-primary/50 dark:group-hover:ring-primary-light/50 rounded-xl"> {/* Added group-hover effects to card */}
                  <CardContent className="p-6 sm:p-8 flex flex-col flex-grow">
                    <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
                      <div className="p-3 bg-gradient-to-br from-primary via-red-500 to-orange-500 rounded-xl shadow-lg flex-shrink-0">
                        <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-card-foreground dark:text-white">{feature.title}</h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-2 sm:space-y-3 mt-auto pt-4 border-t border-border/20">
                      {feature.features.map((item, i) => (
                        <li key={i} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-primary dark:text-primary-light mr-2.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
                  className="h-full" // Ensure motion div takes full height for consistent card height
                >
                  {feature.path ? (
                    <Link href={feature.path} className="block h-full w-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl" aria-label={`Learn more about ${feature.title}`}>
                      {/* The Link component itself will act as the clickable area */}
                      {CardItself}
                    </Link>
                  ) : (
                    // For non-linkable cards, just render the card
                    <div className="h-full">{CardItself}</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* === UPDATED EXERCISE DEMOS SECTION with IN-CARD Video Switching === */}
      <section id="exercise-demos" className="py-12 sm:py-16 lg:py-20 px-0 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-950 overflow-hidden">
      <div className="container mx-auto relative z-10"> {/* Container for title and controls */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-12 text-center" // REMOVED sm:text-left, text-center will now apply to all sizes
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">
            EXERCISE <span className="text-primary dark:text-primary-light">DEMOS</span>
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Explore video demonstrations for various exercises, categorized for your convenience.
          </p>
        </motion.div>
      </div>

        {loadingDemos ? ( <div className="container mx-auto text-center py-10"><p className="text-lg text-muted-foreground">Loading exercise demos...</p></div>
        ) : exerciseDemoCategories.length === 0 ? ( <div className="container mx-auto text-center py-10"><p className="text-lg text-muted-foreground">No exercise demos available.</p></div>
        ) : (
          <div className="relative group">
            <Button variant="outline" size="icon" className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-background/80 hover:bg-background backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex" onClick={() => scrollDemos('left')} aria-label="Scroll left"><ChevronLeft className="h-6 w-6" /></Button>
            <Button variant="outline" size="icon" className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-background/80 hover:bg-background backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex" onClick={() => scrollDemos('right')} aria-label="Scroll right"><ChevronRight className="h-6 w-6" /></Button>

            <div ref={scrollContainerRef} className="flex overflow-x-auto space-x-4 sm:space-x-6 lg:space-x-8 py-4 px-4 sm:px-0 no-scrollbar snap-x-mandatory">
              {exerciseDemoCategories.map((categoryGroup, index) => {
                const currentVideoUrlForCard = activeVideos[categoryGroup.categoryName] || (categoryGroup.demos.length > 0 ? categoryGroup.demos[0].youtube_url : null);
                const videoId = currentVideoUrlForCard ? getYouTubeVideoId(currentVideoUrlForCard) : null;
                const currentlyPlayingDemo = categoryGroup.demos.find(d => d.youtube_url === currentVideoUrlForCard) || categoryGroup.demos[0];

                return (
                  <motion.div key={categoryGroup.categoryName} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.05, duration: 0.4 }} className="flex-shrink-0 w-[85vw] sm:w-[400px] md:w-[420px] lg:w-[450px] snap-start" style={{ scrollMargin: '1rem' }}>
                    <Card className="bg-card dark:bg-gray-900 border-border hover:shadow-xl dark:hover:shadow-primary/10 transition-all duration-300 flex flex-col h-full rounded-xl overflow-hidden">
                      {videoId ? (
                        <div className="aspect-video w-full bg-black"> {/* bg-black for letterboxing */}
                          <iframe
                            key={videoId} // Add key here to force re-render on src change
                            width="100%" height="100%"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&color=white&controls=1`}
                            title={currentlyPlayingDemo?.title || "Exercise Demo"}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen loading="lazy"
                          ></iframe>
                        </div>
                      ) : (
                        <div className="aspect-video w-full bg-gradient-to-br from-muted/50 via-muted to-muted/80 dark:from-gray-800/70 dark:via-gray-800 dark:to-gray-800/70 rounded-t-xl flex items-center justify-center p-4">
                          {categoryGroup.icon ? <categoryGroup.icon className="w-16 h-16 text-primary/30 dark:text-primary-foreground/30" /> : <Play className="w-16 h-16 text-muted-foreground/50"/>}
                        </div>
                      )}
                      
                      <CardContent className="p-4 sm:p-5 flex flex-col flex-grow">
                        <h3 className="text-lg sm:text-xl font-semibold text-card-foreground dark:text-white mb-1 truncate" title={currentlyPlayingDemo?.title || categoryGroup.categoryName}>
                          {categoryGroup.categoryName}: {currentlyPlayingDemo?.title || "Select a Demo"}
                        </h3>
                        {currentlyPlayingDemo?.description && (
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                            {currentlyPlayingDemo.description}
                          </p>
                        )}
                        
                        {categoryGroup.demos.length > 0 && (
                          <>
                            <p className="text-xs font-semibold text-muted-foreground mt-auto pt-2 mb-1 uppercase">More in {categoryGroup.categoryName}:</p>
                            <div className="max-h-28 overflow-y-auto space-y-1 text-xs pr-1 no-scrollbar">
                              {categoryGroup.demos.map(demo => (
                                <button // Changed Link to button
                                  key={demo.id}
                                  onClick={() => handleVideoSelect(categoryGroup.categoryName, demo.youtube_url)}
                                  disabled={!getYouTubeVideoId(demo.youtube_url)} // Disable if URL is not a valid video
                                  className={`w-full group flex items-center space-x-1.5 text-left transition-colors py-1 px-1.5 rounded-md ${
                                    currentVideoUrlForCard === demo.youtube_url 
                                      ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light font-medium' 
                                      : 'text-muted-foreground hover:bg-muted/70 dark:hover:bg-gray-800/60 hover:text-card-foreground'
                                  } ${!getYouTubeVideoId(demo.youtube_url) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  <Play size={14} className={`flex-shrink-0 ${currentVideoUrlForCard === demo.youtube_url ? 'text-primary' : 'text-primary/70 group-hover:text-primary'}`}/> 
                                  <span className="truncate">{demo.title}</span>
                                  {!getYouTubeVideoId(demo.youtube_url) && <span className="ml-auto text-xs text-destructive/70">(Invalid Link)</span>}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                        {categoryGroup.demos.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No demos in this category.</p>}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
              <div className="flex-shrink-0 w-1 sm:w-px"></div>
            </div>
          </div>
        )}
      </section>
      {/* === END: EXERCISE DEMOS SECTION === */}

      {/* Community Section */}
      <section id="community" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 text-gray-900 dark:text-white">
              JOIN OUR <span className="text-gray-600 dark:text-gray-300">COMMUNITY</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Connect with fellow athletes, share your progress, and get motivated by others on their fitness journey
            </p>
          </motion.div>

          {/* User Feedback */}
          <div className="mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">What Our Users Say</h3>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card
                    key={i}
                    className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 animate-pulse"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
                      <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {displayFeedback.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-red-500 dark:hover:border-red-400 hover:shadow-lg hover:shadow-red-500/10 dark:hover:shadow-red-400/20 transition-all duration-300 h-full">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center mb-4">
                          <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 mr-2" />
                          <div className="flex">
                            {[...Array(item.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-3 h-3 sm:w-4 sm:h-4 fill-orange-500 dark:fill-orange-400 text-orange-500 dark:text-orange-400"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 line-clamp-4">
                          {item.comment}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Community Feed Preview */}
          <div className="mb-12 sm:mb-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
              <h3 className="text-2xl sm:text-3xl font-bold">Community Feed</h3>
              <Link href="/community">
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white w-full sm:w-auto"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  View All Posts
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardContent className="p-4 sm:p-6">
                  <form onSubmit={handleSubmitComment} className="space-y-4">
                    <Textarea
                      placeholder="Share your fitness journey, tips, or ask questions..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px] sm:min-h-[100px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 resize-none text-sm sm:text-base"
                      disabled={submittingComment}
                      maxLength={500}
                    />
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex flex-col space-y-1">
                        <p className="text-xs sm:text-sm text-gray-500">
                          {user ? "Posting as authenticated user" : "Posting as guest"} •{" "}
                          <button
                            type="button"
                            onClick={() => (window.location.href = "/auth")}
                            className="text-red-500 hover:text-red-600 underline"
                          >
                            {user ? "Switch account" : "Sign in for full features"}
                          </button>
                        </p>
                        {dbConnected === false && (
                          <p className="text-xs text-yellow-600 dark:text-yellow-400">
                            ⚠️ Database offline - comment will be saved locally
                          </p>
                        )}
                        <p className="text-xs text-gray-400">{newComment.length}/500 characters</p>
                      </div>
                      <Button
                        type="submit"
                        disabled={!newComment.trim() || submittingComment || newComment.length > 500}
                        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 w-full sm:w-auto"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {submittingComment ? "Posting..." : "Share"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {displayComments.slice(0, 4).map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-red-500 dark:hover:border-red-400 hover:shadow-lg hover:shadow-red-500/10 dark:hover:shadow-red-400/20 transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-white font-bold text-xs sm:text-sm">
                            {comment.user_id?.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
                            <span className="font-semibold text-sm sm:text-base truncate">
                              {comment.user_id?.startsWith("guest_")
                                ? "Guest User"
                                : comment.user_id?.startsWith("local_")
                                  ? "Local User"
                                  : comment.user_id?.startsWith("emergency_")
                                    ? "Emergency User"
                                    : comment.user_id?.startsWith("fallback_")
                                      ? "Fallback User"
                                      : `Athlete ${comment.user_id?.slice(0, 8)}`}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed break-words">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 text-gray-900 dark:text-white">
              DOWNLOAD <span className="text-gray-600 dark:text-gray-300">Athlytiq</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get the most advanced AI fitness tracker on all your devices. Start your transformation today.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "iOS",
                icon: Apple,
                description: "Download for iPhone and iPad",
                features: ["Apple Health Integration", "Apple Watch Support", "Siri Shortcuts"],
              },
              {
                name: "Android",
                icon: Smartphone,
                description: "Download for Android devices",
                features: ["Google Fit Integration", "Wear OS Support", "Google Assistant"],
              },
              {
                name: "Web App",
                icon: Globe,
                description: "Access from any browser",
                features: ["Cross-Platform Sync", "Offline Mode", "PWA Support"],
              },
            ].map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-red-500 dark:hover:border-red-400 hover:shadow-lg hover:shadow-red-500/10 dark:hover:shadow-red-400/20 transition-all duration-300 h-full">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-400 dark:to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                      <platform.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white dark:text-black" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">{platform.name}</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
                      {platform.description}
                    </p>
                    <ul className="space-y-2 mb-4 sm:mb-6">
                      {platform.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-900 dark:text-white mr-2 sm:mr-3 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-400 hover:text-white transition-all duration-300">
                      <Download className="w-4 h-4 mr-2" />
                      Download {platform.name}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Logo and Description */}
            <div className="sm:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 dark:text-white" />
                </div>
                <span className="font-bold text-lg sm:text-xl tracking-tight">Athlytiq</span>
              </div>
              <p className="text-sm sm:text-base text-gray-300 dark:text-gray-700 mb-4 max-w-md">
                Transform your fitness journey with AI-powered tracking, personalized workouts, intelligent nutrition,
                and a supportive community.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                  <div
                    key={social}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 dark:bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    <span className="text-white dark:text-gray-900 text-xs sm:text-sm font-bold">
                      {social[0].toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Quick Links</h4>
              <ul className="space-y-2">
                {["Home", "About", "Features", "Community", "Download"].map((link) => (
                  <li key={link}>
                    <button
                      onClick={() =>
                        document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="text-xs sm:text-sm text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-xs sm:text-sm text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="text-xs sm:text-sm text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="text-xs sm:text-sm text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-xs sm:text-sm text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900 transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 sm:mb-8"
          >
            <h4 className="font-semibold mb-4 sm:mb-6 text-center md:text-left text-sm sm:text-base">Contact Us</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: Mail,
                  title: "Email Us",
                  details: "support@Athlytiq.com",
                  description: "Response within 24 hours",
                },
                {
                  icon: Phone,
                  title: "Call Us",
                  details: "+1 (555) 123-4567",
                  description: "Mon-Fri, 9AM-6PM PST",
                },
                {
                  icon: MapPin,
                  title: "Visit Us",
                  details: "123 Fitness Street, SF",
                  description: "Silicon Valley HQ",
                },
              ].map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="bg-gray-800 dark:bg-gray-200 rounded-lg p-3 sm:p-4 border border-gray-700 dark:border-gray-300 hover:border-red-500 dark:hover:border-red-400 transition-all duration-300 h-full">
                    <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-start space-y-2 md:space-y-0 md:space-x-3 sm:md:space-x-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-400 dark:to-orange-400 rounded-xl flex items-center justify-center shrink-0">
                        <info.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-black" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold">{info.title}</h4>
                        <p className="text-white dark:text-gray-900 text-xs sm:text-sm font-medium">{info.details}</p>
                        <p className="text-gray-300 dark:text-gray-700 text-xs">{info.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="border-t border-gray-800 dark:border-gray-200 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-300 dark:text-gray-700 text-xs sm:text-sm">
              © 2024 Athlytiq. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 dark:text-gray-700 text-xs sm:text-sm">Download on:</span>
              <div className="flex space-x-2">
                <div className="bg-gray-800 dark:bg-gray-200 rounded-lg px-2 sm:px-3 py-1 sm:py-2 flex items-center space-x-1 sm:space-x-2">
                  <Apple className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">App Store</span>
                </div>
                <div className="bg-gray-800 dark:bg-gray-200 rounded-lg px-2 sm:px-3 py-1 sm:py-2 flex items-center space-x-1 sm:space-x-2">
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Google Play</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <FitnessChatbot/>
    </div>
  )
}
