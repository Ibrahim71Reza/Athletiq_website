// components/header.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { Menu, X, User, LogOut } from "lucide-react" // Removed Dumbbell
import { supabase } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Optionally redirect or update UI further, e.g., router.push('/')
  }

  const scrollToSection = (sectionId: string) => {
    // Check if current page is the homepage before trying to scroll
    if (window.location.pathname === '/') {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
    } else {
        // If not on homepage, navigate to homepage with hash
        window.location.href = `/#${sectionId}`;
    }
    setIsMenuOpen(false);
  }

  const iconButtonClasses = "h-11 w-11 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/80 dark:hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-95";
  const iconSize = 22;

  // Define navigation items
  const navItems = [
    { id: "home", label: "Home", type: "scroll" },
    { id: "about", label: "About", type: "scroll" },
    { id: "features", label: "Features", type: "scroll" },
    { path: "/food-scanner", label: "Food Scanner", type: "link" }, // New link
    { id: "exercise-demos", label: "Demos", type: "scroll" }, // Assuming section on homepage
    { id: "community", label: "Community", type: "scroll" },
    { id: "download", label: "Download", type: "scroll" },
  ];


  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand Name */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-1.5 bg-card dark:bg-gray-800 rounded-lg group-hover:scale-105 transition-transform duration-200 shadow-sm">
              <img src="/light_logo.png" alt="Athlytiq Logo" className="h-9 w-auto sm:h-10" />
            </div>
            <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent tracking-tight">
              Athlytiq
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-5 lg:space-x-7">
            {navItems.map((item) => (
              item.type === "link" && item.path ? (
                <Link key={item.label} href={item.path} legacyBehavior passHref>
                  <a className="text-base lg:text-lg font-semibold text-muted-foreground hover:text-primary dark:hover:text-primary-light transition-colors duration-200 relative group py-1">
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary dark:bg-primary-light transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                  </a>
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => item.id && scrollToSection(item.id)}
                  className="text-base lg:text-lg font-semibold text-muted-foreground hover:text-primary dark:hover:text-primary-light transition-colors duration-200 relative group py-1"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary dark:bg-primary-light transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                </button>
              )
            ))}
          </nav>

          {/* Right-side actions */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <ThemeToggle /> {/* Ensure this is styled consistently */}
            {user ? (
              <>
                <Link href="/profile" aria-label="View Profile">
                  <Button variant="ghost" size="icon" className={iconButtonClasses}>
                    <User size={iconSize} />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleSignOut} 
                  className={iconButtonClasses}
                  aria-label="Sign Out"
                >
                  <LogOut size={iconSize} />
                </Button>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/auth">
                  <Button variant="ghost" className="px-3.5 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent/80 dark:hover:bg-accent/50 rounded-md transition-colors h-11">
                    Sign In
                  </Button>
                </Link>
                <Link href="/download">
                  <Button className="px-5 py-2 h-11 text-base rounded-md shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90 font-medium">
                    Download App
                  </Button>
                </Link>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className={`md:hidden ${iconButtonClasses} ml-1.5`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={iconSize + 4} /> : <Menu size={iconSize + 4} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="md:hidden mt-3.5 pb-4 border-t border-border animate-in fade-in-20 slide-in-from-top-5 duration-300">
            <nav className="flex flex-col space-y-1.5 pt-3">
              {navItems.map((item) => (
                item.type === "link" && item.path ? (
                  <Link key={item.label} href={item.path} legacyBehavior passHref>
                    <a onClick={() => setIsMenuOpen(false)} className="px-4 py-3 text-left text-lg font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors w-full block">
                      {item.label}
                    </a>
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    onClick={() => item.id && scrollToSection(item.id)}
                    className="px-4 py-3 text-left text-lg font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors w-full"
                  >
                    {item.label}
                  </button>
                )
              ))}
              {!user && (
                <div className="flex flex-col space-y-2.5 pt-3.5 mt-2.5 border-t border-border">
                  <Link href="/auth" className="w-full">
                    <Button variant="ghost" className="w-full justify-start px-4 py-3 text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/download" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-primary via-red-500 to-orange-500 hover:opacity-90 text-white text-lg font-medium py-3" onClick={() => setIsMenuOpen(false)}>
                      Download App
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}