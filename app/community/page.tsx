"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { supabase, type Comment, createCommentWithProfile, fetchCommentsWithProfiles } from "@/lib/supabase"
import { ArrowLeft, Send, Search, Filter, MessageCircle, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function CommunityPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const commentsPerPage = 12

  useEffect(() => {
    fetchComments()
    checkUser()
  }, [])

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

  const fetchComments = async () => {
    try {
      setLoading(true)
      const { data: commentsData, error } = await fetchCommentsWithProfiles(50)

      if (error) {
        console.error("Error fetching comments:", error)
        setComments(mockComments)
      } else {
        setComments(commentsData || mockComments)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
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

      setNewComment("")
      await fetchComments() // Refresh comments after posting
      alert("Comment posted successfully!")
    } catch (error) {
      console.error("Unexpected error:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setSubmittingComment(false)
    }
  }

  // Mock comments data
  const mockComments = [
    {
      id: "1",
      user_id: "athlete1",
      content: "Just completed my first marathon training with Athlytiq! The AI coaching made all the difference. 🏃‍♂️",
      user_name: "Marathon Runner",
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "2",
      user_id: "athlete2",
      content: "The nutrition recommendations helped me lose 20 pounds while gaining muscle. Incredible results! 💪",
      user_name: "Fitness Enthusiast",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: "3",
      user_id: "athlete3",
      content: "Form analysis feature caught my deadlift technique issues. Prevented injury and improved my PR!",
      user_name: "Powerlifter",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: "4",
      user_id: "athlete4",
      content: "Community challenges keep me motivated. Love competing with athletes worldwide! 🌍",
      user_name: "Global Athlete",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
    {
      id: "5",
      user_id: "athlete5",
      content: "Food scanning is so accurate! Scanned my homemade smoothie and got perfect macro breakdown.",
      user_name: "Health Coach",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
    {
      id: "6",
      user_id: "athlete6",
      content: "Recovery tracking helped me optimize my sleep and training schedule. Game changer! 😴",
      user_name: "Recovery Expert",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
  ]

  // Filter comments based on search term
  const filteredComments = comments.filter((comment) =>
    comment.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage)
  const startIndex = (currentPage - 1) * commentsPerPage
  const paginatedComments = filteredComments.slice(startIndex, startIndex + commentsPerPage)

  const stats = [
    { icon: MessageCircle, label: "Total Comments", value: filteredComments.length.toString() },
    { icon: Users, label: "Active Users", value: "500+" },
    { icon: TrendingUp, label: "This Week", value: "127" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                  <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    Community Feed
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  Share your fitness journey and connect with fellow athletes
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card border-border hover:border-red-500/20 transition-colors">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Post Comment Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Share Your Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <Textarea
                    placeholder="Share your fitness journey, tips, or ask questions..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px] bg-background border-border resize-none"
                    disabled={submittingComment}
                  />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {user ? "Posting as authenticated user" : "Posting as guest"} •{" "}
                      <button
                        type="button"
                        onClick={() => (window.location.href = "/auth")}
                        className="text-red-500 hover:text-red-600 underline"
                      >
                        {user ? "Switch account" : "Sign in for full features"}
                      </button>
                    </p>
                    <Button
                      type="submit"
                      disabled={!newComment.trim() || submittingComment}
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

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Comments Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-card border-border animate-pulse">
                  <CardContent className="p-4 sm:p-6">
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="h-20 bg-muted rounded mb-4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {paginatedComments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-card border-border hover:border-red-500/20 hover:shadow-lg transition-all duration-300 h-full">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-white font-bold text-xs sm:text-sm">
                            {comment.user_name ? comment.user_name.charAt(0).toUpperCase() : "U"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
                            <span className="font-semibold text-sm sm:text-base truncate">
                              {comment.user_name || "Anonymous User"}
                            </span>
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm sm:text-base text-foreground leading-relaxed break-words">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-full sm:w-auto"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground px-4 whitespace-nowrap">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="w-full sm:w-auto"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
