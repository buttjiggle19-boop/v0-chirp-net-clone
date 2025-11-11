"use client"

import { useState, useEffect } from "react"
import PostComponent from "./post"
import EditProfileModal from "./edit-profile-modal"

interface UserProfile {
  name: string
  handle: string
  bio: string
  avatar: string
  verified: boolean
  followers: number
  following: number
  location?: string
  website?: string
  monthlyViewers?: number
  communities?: string[]
}

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
  isBot?: boolean
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "LucidPP",
    handle: "lucidpp",
    bio: "Hip Hop Artist 🎤",
    avatar: "☻",
    verified: true,
    followers: 181000,
    following: 0,
    monthlyViewers: 2400000,
    communities: [],
  })

  const [posts, setPosts] = useState<Post[]>([])
  const [showEdit, setShowEdit] = useState(false)

  useEffect(() => {
    const savedProfile = localStorage.getItem("x_profile")
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    } else {
      localStorage.setItem("x_profile", JSON.stringify(profile))
    }

    const savedPosts = localStorage.getItem("x_posts")
    if (savedPosts) {
      const allPosts = JSON.parse(savedPosts) as Post[]
      const userPosts = allPosts.filter((p) => p.author.handle === profile.handle)
      setPosts(userPosts)
    }

    const viewerInterval = setInterval(() => {
      setProfile((prev) => ({
        ...prev,
        monthlyViewers: (prev.monthlyViewers || 0) + Math.floor(Math.random() * 5000),
      }))
    }, 10000)

    return () => clearInterval(viewerInterval)
  }, [])

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile)
    localStorage.setItem("x_profile", JSON.stringify(newProfile))
    setShowEdit(false)
  }

  const updatePost = (updatedPost: Post) => {
    const updated = posts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    setPosts(updated)

    const allPosts = localStorage.getItem("x_posts")
    if (allPosts) {
      const parsed = JSON.parse(allPosts) as Post[]
      const updated2 = parsed.map((p) => (p.id === updatedPost.id ? updatedPost : p))
      localStorage.setItem("x_posts", JSON.stringify(updated2))
    }
  }

  return (
    <div>
      {/* Profile Header */}
      <div className="border-b border-border bg-card/20">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-primary/30 to-primary/10"></div>

        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="flex justify-between items-start mb-4 -mt-24 relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/50 to-primary/20 border-4 border-background flex items-center justify-center text-6xl animate-scale-in">
              {profile.avatar}
            </div>

            <button
              onClick={() => setShowEdit(true)}
              className="px-6 py-2 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary/10 transition"
            >
              Edit Profile
            </button>
          </div>

          {/* Name and Handle */}
          <div className="mb-2">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {profile.name}
              {profile.verified && (
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.5 12.5c0-1.58-.875-2.954-2.147-3.6.029-.2.029-.41 0-.61C19.875 6.5 19 5.116 19 3.5 19 2.12 20.12 1 21.5 1S24 2.12 24 3.5c0 5.231-3.271 9.652-8 11.682-1.231.74-2.605.742-3.953.737zm-15.298-12.087A3.5 3.5 0 0 0 7.364 4.5H4.5C3.12 4.5 2 5.62 2 7v10c0 1.38 1.12 2.5 2.5 2.5h12c1.38 0 2.5-1.12 2.5-2.5V7c0-1.38-1.12-2.5-2.5-2.5h-2.364a3.5 3.5 0 0 0-6.788 0z" />
                </svg>
              )}
            </h2>
            <p className="text-muted-foreground">@{profile.handle}</p>
          </div>

          {/* Bio */}
          <p className="text-foreground mb-4">{profile.bio}</p>

          {/* Location and Website */}
          {(profile.location || profile.website) && (
            <div className="flex gap-4 text-muted-foreground text-sm mb-4">
              {profile.location && <span>📍 {profile.location}</span>}
              {profile.website && <span>🔗 {profile.website}</span>}
            </div>
          )}

          {profile.monthlyViewers && (
            <div className="mb-4 p-3 bg-success/10 border border-success/30 rounded-lg">
              <p className="text-success text-sm font-semibold animate-pulse">
                📊 {(profile.monthlyViewers / 1000000).toFixed(1)}M monthly viewers
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="flex gap-4 text-sm border-t border-border pt-4">
            <div>
              <span className="font-bold text-foreground">{profile.following}</span>
              <span className="text-muted-foreground"> Following</span>
            </div>
            <div>
              <span className="font-bold text-foreground">{profile.followers.toLocaleString()}</span>
              <span className="text-muted-foreground"> Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* User's Posts */}
      <div className="divide-y divide-border">
        {posts.length > 0 ? (
          posts.map((post) => <PostComponent key={post.id} post={post} onUpdate={updatePost} />)
        ) : (
          <div className="p-8 text-center text-muted-foreground">No posts yet</div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEdit && <EditProfileModal profile={profile} onClose={() => setShowEdit(false)} onSave={updateProfile} />}
    </div>
  )
}
