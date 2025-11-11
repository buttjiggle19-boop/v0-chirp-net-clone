"use client"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: "home" | "profile") => void
  showSearch: boolean
  setShowSearch: (show: boolean) => void
}

export default function Sidebar({ activeTab, setActiveTab, setShowSearch }: SidebarProps) {
  const navItems = [
    { id: "home", icon: "𓉞", label: "Home" },
    { id: "explore", icon: "🔍", label: "Explore" },
    { id: "messages", icon: "✉", label: "Messages" },
    { id: "bookmarks", icon: "🔖", label: "Bookmarks" },
    { id: "profile", icon: "☻", label: "Profile" },
  ]

  return (
    <aside className="w-64 border-r border-border flex flex-col py-4 px-4 sticky top-0 h-screen overflow-y-auto">
      {/* Logo */}
      <div className="mb-8">
        <button className="text-2xl font-bold text-primary hover-dark p-2 rounded-full w-10 h-10 flex items-center justify-center">
          PP
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-4 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === "home" || item.id === "profile") {
                setActiveTab(item.id as "home" | "profile")
              } else if (item.id === "explore") {
                setShowSearch(true)
              }
            }}
            className={`flex items-center gap-4 px-4 py-3 rounded-full text-xl font-semibold transition-colors w-full hover-dark ${
              activeTab === item.id ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="hidden xl:inline">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Post Button */}
      <button className="w-full bg-primary text-primary-foreground text-lg font-bold py-3 rounded-full hover:bg-primary/90 transition-all duration-200">
        Post
      </button>
    </aside>
  )
}
