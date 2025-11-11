"use client"

import { useState, useEffect } from "react"

interface TrendingTopic {
  id: string
  category: string
  hashtag: string
  postCount: number
}

export default function Trending() {
  const [trends, setTrends] = useState<TrendingTopic[]>([
    { id: "1", category: "Music", hashtag: "#LucidPPVibes", postCount: 45200 },
    { id: "2", category: "Entertainment", hashtag: "#HipHopHeat", postCount: 128500 },
    { id: "3", category: "Technology", hashtag: "#AITrends", postCount: 89300 },
    { id: "4", category: "Sports", hashtag: "#GameDay", postCount: 76400 },
    { id: "5", category: "News", hashtag: "#Breaking", postCount: 234100 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setTrends((prev) =>
        prev.map((trend) => ({
          ...trend,
          postCount: trend.postCount + Math.floor(Math.random() * 500),
        })),
      )
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-80 hidden xl:block bg-card/30 rounded-2xl border border-border p-4 sticky top-4 h-fit">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 px-4">
        <span className="text-2xl">🔥</span>
        <h2 className="text-xl font-bold">What's happening</h2>
      </div>

      {/* Trends List */}
      <div className="space-y-0 divide-y divide-border">
        {trends.map((trend) => (
          <button key={trend.id} className="w-full p-4 hover:bg-card/50 transition text-left group">
            <p className="text-muted-foreground text-xs group-hover:text-primary transition">{trend.category}</p>
            <h3 className="font-bold text-base group-hover:text-primary transition">{trend.hashtag}</h3>
            <p className="text-muted-foreground text-xs">{trend.postCount.toLocaleString()} posts</p>
          </button>
        ))}
      </div>
    </div>
  )
}
