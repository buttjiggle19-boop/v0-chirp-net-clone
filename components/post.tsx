"use client"

import type React from "react"
import { useState } from "react"
import PostProfileModal from "./post-profile-modal"

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
}

interface PostProps {
  post: Post
  onUpdate: (post: Post) => void
  onClick?: () => void
}

export default function Post({ post, onUpdate, onClick }: PostProps) {
  const [localPost, setLocalPost] = useState(post)
  const [likeAnimation, setLikeAnimation] = useState(false)
  const [likeParticles, setLikeParticles] = useState<Array<{ id: number }>>([])
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [actionClicked, setActionClicked] = useState({
    reply: false,
    retweet: false,
    like: false,
  })

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "now"
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return `${days}d`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(0) + "K"
    return num.toString()
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (actionClicked.like) return

    setLikeAnimation(true)
    setActionClicked((prev) => ({ ...prev, like: true }))

    const newParticles = Array.from({ length: 3 }).map((_, i) => ({ id: i }))
    setLikeParticles(newParticles)
    setTimeout(() => setLikeParticles([]), 600)

    setTimeout(() => setLikeAnimation(false), 600)

    const updated = {
      ...localPost,
      liked: !localPost.liked,
      likes: localPost.liked ? localPost.likes - 1 : localPost.likes + 1,
    }
    setLocalPost(updated)
    onUpdate(updated)
  }

  const handleRetweet = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (actionClicked.retweet) return

    setActionClicked((prev) => ({ ...prev, retweet: true }))
    const updated = {
      ...localPost,
      retweets: localPost.retweets + 1,
    }
    setLocalPost(updated)
    onUpdate(updated)
  }

  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (actionClicked.reply) return
    setActionClicked((prev) => ({ ...prev, reply: true }))
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowProfileModal(true)
  }

  return (
    <>
      <article
        className={`p-4 hover:bg-card/30 transition cursor-pointer border-b border-border group ${
          localPost.liked ? "like-highlight" : ""
        }`}
        onClick={onClick}
      >
        <div className="flex gap-3">
          {/* Avatar */}
          <button
            onClick={handleAuthorClick}
            className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary/50 to-primary/20 flex items-center justify-center border border-primary/30 text-lg group-hover:shadow-lg transition-shadow hover:shadow-primary/50"
          >
            {localPost.author.avatar}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleAuthorClick}
                className="font-bold text-foreground hover:underline group-hover:text-primary transition"
              >
                {localPost.author.name}
              </button>
              {localPost.author.verified && (
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.5 12.5c0-1.58-.875-2.954-2.147-3.6.029-.2.029-.41 0-.61C19.875 6.5 19 5.116 19 3.5 19 2.12 20.12 1 21.5 1S24 2.12 24 3.5c0 5.231-3.271 9.652-8 11.682-1.231.74-2.605.742-3.953.737zm-15.298-12.087A3.5 3.5 0 0 0 7.364 4.5H4.5C3.12 4.5 2 5.62 2 7v10c0 1.38 1.12 2.5 2.5 2.5h12c1.38 0 2.5-1.12 2.5-2.5V7c0-1.38-1.12-2.5-2.5-2.5h-2.364a3.5 3.5 0 0 0-6.788 0z" />
                </svg>
              )}
              {localPost.isBot && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Bot</span>
              )}
              <span className="text-muted-foreground">@{localPost.author.handle}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground text-sm">{getTimeAgo(localPost.timestamp)}</span>
            </div>

            {/* Text Content */}
            <p className="text-foreground mt-2 text-base break-words whitespace-pre-wrap text-balance">
              {localPost.content}
            </p>

            {/* Media */}
            {localPost.media && localPost.media.length > 0 && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-border">
                {localPost.media.map((item, idx) => (
                  <div key={idx}>
                    {item.type === "image" && (
                      <img
                        src={item.url || "/placeholder.svg"}
                        alt="Post media"
                        className="w-full max-h-96 object-cover"
                      />
                    )}
                    {item.type === "video" && <video src={item.url} controls className="w-full max-h-96" />}
                  </div>
                ))}
              </div>
            )}

            {/* Views with Green Glow */}
            {localPost.views > 0 && (
              <p className="text-muted-foreground text-sm mt-3 border-t border-border pt-3 transition-all duration-300">
                {formatNumber(localPost.views)} views
              </p>
            )}

            {/* Engagement Bar */}
            <div className="flex justify-between mt-3 text-muted-foreground text-sm max-w-md [&>button]:flex [&>button]:items-center [&>button]:gap-2 [&>button]:group/btn [&>button]:hover:text-primary [&>button]:transition">
              <button onClick={handleReply} className="group/reply relative" disabled={actionClicked.reply}>
                <span
                  className={`group-hover/reply:bg-primary/10 p-2 rounded-full transition text-lg ${actionClicked.reply ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  💬
                </span>
                <span className="group-hover/reply:bg-primary/10 px-2 py-1 rounded text-xs">
                  {formatNumber(localPost.replies)}
                </span>
              </button>

              <button onClick={handleRetweet} className="group/retweet relative" disabled={actionClicked.retweet}>
                <span
                  className={`group-hover/retweet:bg-success/10 p-2 rounded-full transition text-lg ${actionClicked.retweet ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  ↻
                </span>
                <span className="group-hover/retweet:bg-success/10 px-2 py-1 rounded text-xs">
                  {formatNumber(localPost.retweets)}
                </span>
              </button>

              <button
                onClick={handleLike}
                className={`group/like relative ${localPost.liked ? "text-destructive" : ""} ${
                  likeAnimation ? "scale-125" : ""
                } transition-transform disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={actionClicked.like}
              >
                <span
                  className={`p-2 rounded-full transition relative text-lg ${
                    localPost.liked ? "text-destructive" : "group-hover/like:bg-destructive/10"
                  }`}
                >
                  {localPost.liked ? "❤" : "♡"}
                  {likeAnimation && <div className="absolute inset-0 animate-green-glow rounded-full"></div>}
                </span>
                {likeParticles.map((particle) => (
                  <div
                    key={particle.id}
                    className="absolute text-destructive text-lg animate-float-up pointer-events-none"
                    style={{
                      left: `${30 + (particle.id - 1) * 10}px`,
                      top: "20px",
                    }}
                  >
                    ❤
                  </div>
                ))}
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    localPost.liked ? "text-destructive" : "group-hover/like:bg-destructive/10"
                  }`}
                >
                  {formatNumber(localPost.likes)}
                </span>
              </button>

              <button onClick={handleShare} className="group/share">
                <span className="group-hover/share:bg-primary/10 p-2 rounded-full transition text-lg">⬆</span>
              </button>
            </div>
          </div>
        </div>
      </article>

      {showProfileModal && <PostProfileModal author={localPost.author} onClose={() => setShowProfileModal(false)} />}
    </>
  )
}
