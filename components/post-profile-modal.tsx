"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface Author {
  name: string
  handle: string
  avatar: string
  verified: boolean
}

interface PostProfileModalProps {
  author: Author
  onClose: () => void
  onFollowClick?: () => void
}

export default function PostProfileModal({ author, onClose, onFollowClick }: PostProfileModalProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    onFollowClick?.()
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-start justify-center pt-20 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-2xl w-full max-w-sm border border-border shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="p-4 border-b border-border flex justify-end">
          <button onClick={onClose} className="text-foreground hover:bg-primary/10 p-2 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-primary/30 to-primary/10"></div>

        {/* Profile Info */}
        <div className="px-6 pb-6 -mt-12 relative">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/50 to-primary/20 border-4 border-background flex items-center justify-center text-4xl mb-4">
            {author.avatar}
          </div>

          {/* Name and Handle */}
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {author.name}
            {author.verified && (
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.5 12.5c0-1.58-.875-2.954-2.147-3.6.029-.2.029-.41 0-.61C19.875 6.5 19 5.116 19 3.5 19 2.12 20.12 1 21.5 1S24 2.12 24 3.5c0 5.231-3.271 9.652-8 11.682-1.231.74-2.605.742-3.953.737zm-15.298-12.087A3.5 3.5 0 0 0 7.364 4.5H4.5C3.12 4.5 2 5.62 2 7v10c0 1.38 1.12 2.5 2.5 2.5h12c1.38 0 2.5-1.12 2.5-2.5V7c0-1.38-1.12-2.5-2.5-2.5h-2.364a3.5 3.5 0 0 0-6.788 0z" />
              </svg>
            )}
          </h2>
          <p className="text-muted-foreground mb-4">@{author.handle}</p>

          {/* Follow Button */}
          <button
            onClick={handleFollow}
            className={`w-full py-2 px-4 font-bold rounded-full transition ${
              isFollowing
                ? "border-2 border-primary text-primary hover:bg-primary/10"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      </div>
    </div>
  )
}
