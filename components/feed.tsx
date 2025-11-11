"use client"

import { useState, useEffect } from "react"
import PostComponent from "./post"
import PostDetail from "./post-detail"
import { simulateRealTimeEngagement, simulateTimePassedEngagement } from "@/lib/engagement-simulator"

interface Post {
  id: string
  author: {
    name: string
    handle: string
    avatar: string
    verified: boolean
  }
  content: string
  media?: Array<{
    type: "image" | "video"
    url: string
  }>
  timestamp: number
  views: number
  replies: number
  retweets: number
  likes: number
  liked: boolean
  lastUpdated?: number
  isBot?: boolean
  comments?: Array<any>
}

interface FeedProps {
  onCompose: () => void
}

export default function Feed({ onCompose }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [userFollowers, setUserFollowers] = useState<number>(100)

  useEffect(() => {
    const profile = localStorage.getItem("x_profile")
    if (profile) {
      setUserProfile(JSON.parse(profile))
      setUserFollowers(JSON.parse(profile).followers || 100)
    }
  }, [])

  useEffect(() => {
    loadPosts()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const followers = userProfile ? userFollowers : 100
      const monthlyViewers = posts.reduce((total, post) => total + post.views * 0.05, 0)

      setPosts((prevPosts) => {
        const updated = prevPosts.map((post) => {
          const isUserPost = post.author.handle === (userProfile?.handle || "")
          const postFollowers = isUserPost ? followers : Math.max(100, followers * 0.3)
          const postMonthlyViewers = post.views * 0.05

          const simulated = simulateRealTimeEngagement({
            currentMetrics: {
              views: post.views,
              likes: post.likes,
              retweets: post.retweets,
              replies: post.replies,
            },
            followers: postFollowers,
            monthlyViewers: postMonthlyViewers,
          })

          return {
            ...post,
            ...simulated,
            lastUpdated: Date.now(),
          }
        })

        localStorage.setItem("x_posts", JSON.stringify(updated))
        return updated
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [userProfile, userFollowers])

  const loadPosts = () => {
    const saved = localStorage.getItem("x_posts")
    const profile = localStorage.getItem("x_profile")
    const lastSession = localStorage.getItem("x_last_session")
    const now = Date.now()

    if (profile) {
      setUserProfile(JSON.parse(profile))
      setUserFollowers(JSON.parse(profile).followers || 100)
    }

    if (saved) {
      let posts = JSON.parse(saved) as Post[]
      const followers = userProfile ? userFollowers : 100

      if (lastSession) {
        const timePassed = now - Number(lastSession)

        if (timePassed > 300000) {
          posts = posts.map((post) => {
            const isUserPost = post.author.handle === (profile ? JSON.parse(profile).handle : "")
            const postFollowers = isUserPost ? followers : Math.max(100, followers * 0.3)
            const postMonthlyViewers = post.views * 0.05

            const updated = simulateTimePassedEngagement(
              {
                currentMetrics: {
                  views: post.views,
                  likes: post.likes,
                  retweets: post.retweets,
                  replies: post.replies,
                },
                followers: postFollowers,
                monthlyViewers: postMonthlyViewers,
              },
              timePassed,
            )

            return {
              ...post,
              ...updated,
              lastUpdated: now,
            }
          })

          localStorage.setItem("x_posts", JSON.stringify(posts))
        }
      }

      setPosts(posts)
    } else {
      const startingViews = userFollowers * 0.02
      const defaultPosts: Post[] = [
        {
          id: "1",
          author: {
            name: "Urban Vibes",
            handle: "urbanvibes",
            avatar: "●",
            verified: false,
          },
          content: '@lucidpp really snapped on "JJ" fr fr. Album of the year incoming?',
          timestamp: Date.now() - 60000,
          views: Math.floor(startingViews * 5),
          replies: 283,
          retweets: 135,
          likes: Math.floor(startingViews * 0.3),
          liked: false,
          comments: [],
        },
        {
          id: "2",
          author: {
            name: "LucidPP",
            handle: "lucidpp",
            avatar: "●",
            verified: true,
          },
          content: "im famous!",
          timestamp: Date.now() - 120000,
          views: Math.floor(startingViews * 8),
          replies: 0,
          retweets: Math.floor(startingViews * 0.15),
          likes: Math.floor(startingViews * 0.5),
          liked: false,
          comments: [],
        },
        {
          id: "3",
          author: {
            name: "Street Heat",
            handle: "streetheat",
            avatar: "●",
            verified: false,
          },
          content: '@lucidpp\'s new track "JJ" is on repeat! This is the one',
          timestamp: Date.now() - 3600000,
          views: Math.floor(startingViews * 3),
          replies: 21,
          retweets: Math.floor(startingViews * 0.08),
          likes: Math.floor(startingViews * 0.12),
          liked: false,
          comments: [],
        },
      ]
      setPosts(defaultPosts)
      localStorage.setItem("x_posts", JSON.stringify(defaultPosts))
    }

    localStorage.setItem("x_last_session", now.toString())
  }

  const updatePost = (updatedPost: Post) => {
    const updated = posts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    setPosts(updated)
    localStorage.setItem("x_posts", JSON.stringify(updated))
  }

  return (
    <>
      <div className="divide-y divide-border">
        {/* Compose Section */}
        <div className="p-4 border-b border-border hover-card cursor-pointer transition" onClick={onCompose}>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg flex-shrink-0 border border-primary/30">
              ●
            </div>
            <div className="flex-1">
              <p className="text-xl text-muted-foreground">What's happening!?</p>
            </div>
          </div>
        </div>

        {/* Posts */}
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostComponent key={post.id} post={post} onUpdate={updatePost} onClick={() => setSelectedPostId(post.id)} />
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">No posts yet. Be the first to post!</div>
        )}
      </div>

      {selectedPostId && (
        <PostDetail postId={selectedPostId} onClose={() => setSelectedPostId(null)} onUpdate={updatePost} />
      )}
    </>
  )
}
