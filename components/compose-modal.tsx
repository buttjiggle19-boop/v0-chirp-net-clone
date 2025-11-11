"use client"

import type React from "react"

import { useState, useRef } from "react"

interface ComposeModalProps {
  onClose: () => void
}

export default function ComposeModal({ onClose }: ComposeModalProps) {
  const [content, setContent] = useState("")
  const [media, setMedia] = useState<Array<{ type: "image" | "video"; url: string }>>([])
  const [isBot, setIsBot] = useState(false)
  const [botName, setBotName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCompose = () => {
    if (content.trim()) {
      const savedProfile = localStorage.getItem("x_profile")
      const profile = savedProfile
        ? JSON.parse(savedProfile)
        : { name: "You", handle: "yourhandle", avatar: "●", verified: false }

      const authorName = isBot && botName.trim() ? botName : profile.name
      const authorHandle = isBot && botName.trim() ? botName.toLowerCase().replace(/\s+/g, "") : profile.handle

      const newPost = {
        id: Date.now().toString(),
        author: {
          name: authorName,
          handle: authorHandle,
          avatar: profile.avatar,
          verified: profile.verified && !isBot,
        },
        content,
        media: media.length > 0 ? media : undefined,
        timestamp: Date.now(),
        views: Math.floor(Math.random() * 1000),
        replies: 0,
        retweets: 0,
        likes: 0,
        liked: false,
        isBot,
        comments: [],
      }

      const saved = localStorage.getItem("x_posts")
      const posts = saved ? JSON.parse(saved) : []
      localStorage.setItem("x_posts", JSON.stringify([newPost, ...posts]))

      setContent("")
      setMedia([])
      setIsBot(false)
      setBotName("")
      onClose()
      window.location.reload()
    }
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.size > 5000000) {
          alert("File size must be less than 5MB")
          return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
          const url = event.target?.result as string
          setMedia((prev) => [
            ...prev,
            {
              type: file.type.startsWith("video") ? "video" : "image",
              url,
            },
          ])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-background rounded-2xl w-full max-w-2xl mx-4 border border-border shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-background">
          <button onClick={onClose} className="text-primary hover:bg-primary/10 p-2 rounded-full transition text-lg">
            ✕
          </button>
          <button
            onClick={handleCompose}
            disabled={!content.trim()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-bold disabled:opacity-50 hover:bg-primary/90 transition-all duration-200"
          >
            Post
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg flex-shrink-0 border border-primary/30">
              ●
            </div>
            <div className="flex-1">
              {isBot && (
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder="Bot name"
                  className="w-full text-lg text-foreground bg-card/30 border border-border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:border-primary transition"
                />
              )}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={280}
                placeholder="What's happening!?"
                className="w-full text-2xl text-foreground bg-transparent outline-none resize-none"
                rows={6}
                autoFocus
              />
              <p className="text-sm text-muted-foreground mt-4">{content.length}/280</p>
            </div>
          </div>

          {/* Media Preview */}
          {media.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2 max-h-96 overflow-y-auto rounded-2xl border border-border overflow-hidden">
              {media.map((item, idx) => (
                <div key={idx} className="relative bg-card group">
                  {item.type === "image" ? (
                    <img
                      src={item.url || "/placeholder.svg"}
                      alt="Upload preview"
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <video src={item.url} className="w-full h-48 object-cover" />
                  )}
                  <button
                    onClick={() => removeMedia(idx)}
                    className="absolute top-2 right-2 bg-black/75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-black/90"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 border border-border rounded-lg bg-card/30">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isBot}
                onChange={(e) => setIsBot(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-foreground font-semibold">Post as Bot</span>
            </label>
          </div>

          {/* Action Bar */}
          <div className="flex justify-between mt-6 pt-4 border-t border-border text-primary">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-primary/10 rounded-full transition text-lg"
              title="Add image"
            >
              🖼
            </button>
            <button className="p-2 hover:bg-primary/10 rounded-full transition text-lg" title="Add video">
              🎬
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
