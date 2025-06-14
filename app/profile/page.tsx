"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Save, ArrowLeft, Activity, Target } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Profile {
  id: string
  email: string
  full_name: string
  age: number
  weight: number
  height: number
  fitness_goal: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const getProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth")
          return
        }

        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (error && error.code !== "PGRST116") {
          throw error
        }

        if (data) {
          setProfile(data)
        } else {
          // Create new profile
          const newProfile = {
            id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name || "",
            age: 0,
            weight: 0,
            height: 0,
            fitness_goal: "",
          }
          setProfile(newProfile)
        }
      } catch (error) {
        console.error("Error loading profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [router, toast])

  // In app/profile/page.tsx
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !profile.id) {
      toast({ title: "Error", description: "Profile data is missing or user not fully loaded.", variant: "destructive" });
      return;
    }

    setSaving(true);

    try {
      const profileDataToSave = {
        // id: profile.id, // id is used in .eq() for upsert, not usually in the update payload itself unless it's part of composite key
        email: profile.email,
        full_name: profile.full_name,
        age: profile.age,
        weight: profile.weight,
        height: profile.height,
        fitness_goal: profile.fitness_goal,
        // updated_at: new Date().toISOString(), // Remove if using DB trigger
      };

      // Use .eq('id', profile.id) to specify which row to upsert
      const { data: upsertData, error: upsertError } = await supabase
        .from("profiles")
        .update(profileDataToSave) // Use update if you are sure profile exists from useEffect
        .eq('id', profile.id)       // and handle_new_user trigger creates it.
        .select()                 // Optionally select to get the updated row back
        .single();                // If expecting one row

      // If your useEffect guarantees a profile object (even a default one for new users)
      // that already has the user's ID, then an upsert might look like this:
      // const { data: upsertData, error: upsertError } = await supabase
      //  .from("profiles")
      //  .upsert({ ...profileDataToSave, id: profile.id }) // Pass ID for upsert
      //  .eq('id', profile.id) // Still good to have .eq for clarity on the WHERE condition of the UPDATE part
      //  .select()
      //  .single();


      if (upsertError) {
        console.error("Supabase upsert/update error:", upsertError);
        throw upsertError; 
      }

      toast({
        title: "Success!",
        description: "Profile updated successfully.",
      });
      // Optionally re-fetch profile or update state if 'select()' returned data
      if (upsertData) {
          setProfile(upsertData as Profile);
      }

    } catch (error: any) {
      console.error("Error saving profile (in catch):", error);
      let description = "Failed to save profile. Please try again.";
      if (error && error.message) {
        description = error.message;
        if (error.details) description += ` Details: ${error.details}`;
        if (error.hint) description += ` Hint: ${error.hint}`;
      }
      toast({
        title: "Error",
        description: description,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-muted rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
          <Link href="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Your Profile
            </span>
          </h1>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age || ""}
                    onChange={(e) => setProfile({ ...profile, age: Number.parseInt(e.target.value) || 0 })}
                    placeholder="Age"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={profile.weight || ""}
                    onChange={(e) => setProfile({ ...profile, weight: Number.parseFloat(e.target.value) || 0 })}
                    placeholder="Weight"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={profile.height || ""}
                    onChange={(e) => setProfile({ ...profile, height: Number.parseFloat(e.target.value) || 0 })}
                    placeholder="Height"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fitnessGoal">Fitness Goal</Label>
                <Select
                  value={profile.fitness_goal}
                  onValueChange={(value) => setProfile({ ...profile, fitness_goal: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your fitness goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="endurance">Improve Endurance</SelectItem>
                    <SelectItem value="strength">Build Strength</SelectItem>
                    <SelectItem value="general_fitness">General Fitness</SelectItem>
                    <SelectItem value="flexibility">Improve Flexibility</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              >
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Quick Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">BMI</span>
                  <span className="font-semibold">
                    {profile.weight && profile.height
                      ? (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Goal</span>
                  <span className="font-semibold capitalize">
                    {profile.fitness_goal?.replace("_", " ") || "Not set"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Next Steps</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>• Complete your profile information</p>
                <p>• Download the Athlytiq mobile app</p>
                <p>• Start tracking your workouts</p>
                <p>• Join the community discussions</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
