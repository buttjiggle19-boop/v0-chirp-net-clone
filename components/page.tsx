"use client"

import { useState, useEffect } from "react"
import Feed from "@/components/feed"
import Profile from "@/components/profile"
import Sidebar from "@/components/sidebar"
import ComposeModal from "@/components/compose-modal"
import SearchModal from "@/components/search-modal"

export default function Page() {
  const [activeTab, setActiveTab] = useState<"home" | "profile">("home")
  const [showCompose, setShowCompose] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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
                <button onClick={() => setShowCompose(true)} className="text-primary hover-dark p-2 rounded-full">
                  +
                </button>
              </>
            ) : (
              <>
                <button className="text-primary text-2xl hover-dark p-2 rounded-full">𝕏</button>
                {activeTab === "home" && <h2 className="text-xl font-bold">Home</h2>}
                {activeTab === "profile" && <h2 className="text-xl font-bold">Profile</h2>}
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

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-3 flex items-center justify-around">
          <button
            onClick={() => setActiveTab("home")}
            className={`p-2 rounded-full transition-colors ${activeTab === "home" ? "text-primary" : "text-muted-foreground hover-dark"}`}
          >
            🏠
          </button>
          <button className="p-2 rounded-full text-muted-foreground hover-dark">🔎</button>
          <button
            onClick={() => setShowCompose(true)}
            className="p-2 rounded-full text-primary bg-primary/10 hover:bg-primary/20 transition"
          >
            ✎
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`p-2 rounded-full transition-colors ${activeTab === "profile" ? "text-primary" : "text-muted-foreground hover-dark"}`}
          >
            👤
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
