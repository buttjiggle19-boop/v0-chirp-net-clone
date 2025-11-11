"use client"

import { useState, useEffect } from "react"
import Feed from "@/components/feed"
import Profile from "@/components/profile"
import Sidebar from "@/components/sidebar"
import Trending from "@/components/trending"
import ComposeModal from "@/components/compose-modal"
import SearchModal from "@/components/search-modal"
import SignupPage from "@/components/signup-page"
import ThemeToggle from "@/components/theme-toggle"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"home" | "profile">("home")
  const [showCompose, setShowCompose] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  useEffect(() => {
    const profile = localStorage.getItem("x_profile")
    setIsLoggedIn(!!profile)

    const savedTheme = (localStorage.getItem("pp_theme") as "light" | "dark") || "dark"
    setTheme(savedTheme)
    document.documentElement.classList.toggle("light", savedTheme === "light")
    document.documentElement.classList.toggle("dark", savedTheme === "dark")

    setIsLoading(false)
  }, [])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleSignup = (name: string, username: string) => {
    const profile = {
      name,
      handle: username.toLowerCase().replace(/\s+/g, ""),
      avatar: "☻",
      verified: false,
      bio: "",
      location: "",
      website: "",
      followers: 0,
      following: 0,
      monthlyViewers: 0,
      communities: [],
    }
    localStorage.setItem("x_profile", JSON.stringify(profile))
    setIsLoggedIn(true)
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("pp_theme", newTheme)
    document.documentElement.classList.toggle("light", newTheme === "light")
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-primary text-2xl">Loading...</div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <SignupPage onSignup={handleSignup} />
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar - Desktop only */}
      {!isMobile && (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
        />
      )}

      {/* Main Feed Area */}
      <main className="flex-1 flex flex-col border-x border-border max-w-2xl mx-auto w-full lg:w-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            {isMobile ? (
              <>
                <button
                  onClick={() => setShowSearch(true)}
                  className="text-primary text-xl hover-dark p-2 rounded-full"
                >
                  🔍
                </button>
                <h1 className="text-xl font-bold">Home</h1>
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
              </>
            ) : (
              <>
                <button className="text-2xl font-bold text-primary hover-dark p-2 rounded-full">PP</button>
                {activeTab === "home" && <h2 className="text-xl font-bold">Home</h2>}
                {activeTab === "profile" && <h2 className="text-xl font-bold">Profile</h2>}
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
              </>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "home" && <Feed onCompose={() => setShowCompose(true)} />}
          {activeTab === "profile" && <Profile />}
        </div>
      </main>

      {!isMobile && <Trending />}

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-3 flex items-center justify-around">
          <button
            onClick={() => setActiveTab("home")}
            className={`p-2 rounded-full transition-colors text-lg ${activeTab === "home" ? "text-primary" : "text-muted-foreground hover-dark"}`}
          >
            𓉞
          </button>
          <button
            onClick={() => setShowSearch(true)}
            className="p-2 rounded-full text-muted-foreground hover-dark text-lg"
          >
            🔍
          </button>
          <button
            onClick={() => setShowCompose(true)}
            className="p-2 rounded-full text-primary bg-primary/10 hover:bg-primary/20 transition text-lg"
          >
            ✎
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`p-2 rounded-full transition-colors text-lg ${activeTab === "profile" ? "text-primary" : "text-muted-foreground hover-dark"}`}
          >
            ☻
          </button>
        </div>
      )}

      {/* Floating Action Button - Desktop */}
      {!isMobile && (
        <button
          onClick={() => setShowCompose(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-2xl text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-110 animate-scale-in"
        >
          ✎
        </button>
      )}

      {/* Modals */}
      {showCompose && <ComposeModal onClose={() => setShowCompose(false)} />}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </div>
  )
}
