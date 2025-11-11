"use client"

import { useState, useMemo } from "react"
import { Search, X } from "lucide-react"

interface SearchModalProps {
  onClose: () => void
}

export default function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")

  const trendingTopics = [
    { hashtag: "#LucidPPVibes", category: "Music", posts: 45200 },
    { hashtag: "#HipHopHeat", category: "Entertainment", posts: 128500 },
    { hashtag: "#AITrends", category: "Technology", posts: 89300 },
    { hashtag: "#GameDay", category: "Sports", posts: 76400 },
    { hashtag: "#Breaking", category: "News", posts: 234100 },
  ]

  const users = [
    { name: "LucidPP", handle: "lucidpp", avatar: "👤", verified: true, followers: 181000 },
    { name: "Urban Vibes", handle: "urbanvibes", avatar: "👤", verified: false, followers: 45200 },
    { name: "Street Heat", handle: "streetheat", avatar: "👤", verified: false, followers: 23400 },
  ]

  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return { topics: trendingTopics, users: [] }
    }

    const lowercaseQuery = query.toLowerCase()
    return {
      topics: trendingTopics.filter((t) => t.hashtag.toLowerCase().includes(lowercaseQuery)),
      users: users.filter(
        (u) => u.name.toLowerCase().includes(lowercaseQuery) || u.handle.toLowerCase().includes(lowercaseQuery),
      ),
    }
  }, [query])

  return (
    <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="fixed top-0 left-0 right-0 bg-background border-b border-border animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-4 p-4">
          <button onClick={onClose} className="text-primary hover:bg-primary/10 p-2 rounded-full transition">
            <X size={20} />
          </button>
          <div className="flex-1 flex items-center gap-3 bg-input rounded-full px-4 py-2">
            <Search size={20} className="text-muted-foreground" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search X"
              className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {query.trim() && (
          <div className="max-w-2xl mx-auto border-t border-border max-h-96 overflow-y-auto">
            {/* Users */}
            {filteredResults.users.length > 0 && (
              <div className="divide-y divide-border">
                <div className="p-4 text-sm font-bold text-muted-foreground">Users</div>
                {filteredResults.users.map((user) => (
                  <button
                    key={user.handle}
                    className="w-full p-4 hover:bg-card/30 transition text-left flex items-center gap-3 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/50 to-primary/20 border border-primary/30 flex items-center justify-center text-lg flex-shrink-0">
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-bold group-hover:text-primary">{user.name}</span>
                        {user.verified && (
                          <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.5 12.5c0-1.58-.875-2.954-2.147-3.6.029-.2.029-.41 0-.61C19.875 6.5 19 5.116 19 3.5 19 2.12 20.12 1 21.5 1S24 2.12 24 3.5c0 5.231-3.271 9.652-8 11.682-1.231.74-2.605.742-3.953.737zm-15.298-12.087A3.5 3.5 0 0 0 7.364 4.5H4.5C3.12 4.5 2 5.62 2 7v10c0 1.38 1.12 2.5 2.5 2.5h12c1.38 0 2.5-1.12 2.5-2.5V7c0-1.38-1.12-2.5-2.5-2.5h-2.364a3.5 3.5 0 0 0-6.788 0z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs">@{user.handle}</p>
                      <p className="text-muted-foreground text-xs mt-1">{user.followers.toLocaleString()} followers</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Topics */}
            {filteredResults.topics.length > 0 && (
              <div className="divide-y divide-border">
                <div className="p-4 text-sm font-bold text-muted-foreground">Trending Topics</div>
                {filteredResults.topics.map((topic, idx) => (
                  <button key={idx} className="w-full p-4 hover:bg-card/30 transition text-left group">
                    <p className="text-muted-foreground text-xs group-hover:text-primary">{topic.category}</p>
                    <p className="font-bold group-hover:text-primary">{topic.hashtag}</p>
                    <p className="text-muted-foreground text-xs">{topic.posts.toLocaleString()} posts</p>
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {filteredResults.users.length === 0 && filteredResults.topics.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">No results found for "{query}"</div>
            )}
          </div>
        )}

        {!query.trim() && (
          <div className="max-w-2xl mx-auto border-t border-border max-h-96 overflow-y-auto">
            <div className="p-4 text-sm font-bold text-muted-foreground">What's trending</div>
            <div className="divide-y divide-border">
              {trendingTopics.map((topic, idx) => (
                <button key={idx} className="w-full p-4 hover:bg-card/30 transition text-left group">
                  <p className="text-muted-foreground text-xs group-hover:text-primary">{topic.category}</p>
                  <p className="font-bold group-hover:text-primary">{topic.hashtag}</p>
                  <p className="text-muted-foreground text-xs">{topic.posts.toLocaleString()} posts</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
