"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Post from "./post"

interface Comment {
  id: string
  author: {
    name: string
    handle: string
    avatar: string
  }
  content: string
  timestamp: number
  likes: number
  liked: boolean
  isBot?: boolean
  isPinned?: boolean
}

interface PostWithComments {
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
  comments?: Comment[]
}

interface PostDetailProps {
  postId: string
  onClose: () => void
  onUpdate: (post: PostWithComments) => void
}

export default function PostDetail({ postId, onClose, onUpdate }: PostDetailProps) {
  const [post, setPost] = useState<PostWithComments | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isComposingBot, setIsComposingBot] = useState(false)

  useEffect(() => {
    loadPostWithComments()
  }, [postId])

  const loadPostWithComments = () => {
    const saved = localStorage.getItem("x_posts")
    if (saved) {
      const posts = JSON.parse(saved)
      const foundPost = posts.find((p: PostWithComments) => p.id === postId)
      if (foundPost) {
        setPost(foundPost)
        setComments(foundPost.comments || [])
      }
    }
  }

  const getUserProfile = () => {
    const saved = localStorage.getItem("x_profile")
    return saved ? JSON.parse(saved) : { name: "You", handle: "yourhandle", avatar: "👤" }
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !post) return

    const profile = getUserProfile()
    const newCommentObj: Comment = {
      id: Date.now().toString(),
      author: {
        name: isComposingBot ? "Bot Comment" : profile.name,
        handle: isComposingBot ? "botcomment" : profile.handle,
        avatar: profile.avatar,
      },
      content: newComment,
      timestamp: Date.now(),
      likes: isComposingBot ? Math.floor(Math.random() * 1000) : 0,
      liked: false,
      isBot: isComposingBot,
    }

    const updatedComments = [newCommentObj, ...comments]
    setComments(updatedComments)
    setNewComment("")
    setIsComposingBot(false)

    const updatedPost = { ...post, comments: updatedComments }
    setPost(updatedPost)
    onUpdate(updatedPost)

    // Save to localStorage
    const saved = localStorage.getItem("x_posts")
    if (saved) {
      const posts = JSON.parse(saved)
      const updated = posts.map((p: PostWithComments) => (p.id === postId ? updatedPost : p))
      localStorage.setItem("x_posts", JSON.stringify(updated))
    }
  }

  const handlePinComment = (commentId: string) => {
    const updated = comments.map((c) =>
      c.id === commentId ? { ...c, isPinned: !c.isPinned } : { ...c, isPinned: false },
    )
    setComments(updated)

    if (post) {
      const updatedPost = { ...post, comments: updated }
      setPost(updatedPost)
      onUpdate(updatedPost)

      const saved = localStorage.getItem("x_posts")
      if (saved) {
        const posts = JSON.parse(saved)
        const postsList = posts.map((p: PostWithComments) => (p.id === postId ? updatedPost : p))
        localStorage.setItem("x_posts", JSON.stringify(postsList))
      }
    }
  }

  const handleLikeComment = (commentId: string) => {
    const updated = comments.map((c) =>
      c.id === commentId ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c,
    )
    setComments(updated)

    if (post) {
      const updatedPost = { ...post, comments: updated }
      onUpdate(updatedPost)

      const saved = localStorage.getItem("x_posts")
      if (saved) {
        const posts = JSON.parse(saved)
        const postsList = posts.map((p: PostWithComments) => (p.id === postId ? updatedPost : p))
        localStorage.setItem("x_posts", JSON.stringify(postsList))
      }
    }
  }

  if (!post) return null

  const profile = getUserProfile()
  const sortedComments = [...comments].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center backdrop-blur-sm overflow-y-auto">
      <div className="bg-background w-full max-w-2xl border-r border-l border-border animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border px-4 py-3 flex items-center gap-4">
          <button
            onClick={onClose}
            className="text-lg text-muted-foreground hover:text-primary hover:bg-primary/10 p-2 rounded-full transition"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold">Post</h2>
        </div>

        {/* Post */}
        <Post
          post={post}
          onUpdate={(updated) => {
            setPost(updated)
            onUpdate(updated)
          }}
        />

        {/* Post Stats */}
        <div className="border-t border-border p-4 flex justify-around text-center">
          <div className="hover-dark p-2 rounded cursor-pointer">
            <p className="text-xl font-bold text-foreground">{post.views.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Views</p>
          </div>
          <div className="hover-dark p-2 rounded cursor-pointer">
            <p className="text-xl font-bold text-foreground">{post.retweets.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Reposts</p>
          </div>
          <div className="hover-dark p-2 rounded cursor-pointer">
            <p className="text-xl font-bold text-foreground">{post.likes.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Likes</p>
          </div>
        </div>

        {/* Comment Section */}
        <div className="border-t border-border p-4">
          {profile.handle === post.author.handle && (
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm border border-primary/30">
                  {profile.avatar}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    maxLength={280}
                    placeholder="Post your reply"
                    className="w-full text-base text-foreground bg-transparent outline-none resize-none"
                    rows={3}
                  />
                  <div className="flex justify-between items-center mt-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isComposingBot}
                        onChange={(e) => setIsComposingBot(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-muted-foreground">Reply as Bot</span>
                    </label>
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-full font-bold disabled:opacity-50 hover:bg-primary/90 transition"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {sortedComments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No replies yet</p>
            ) : (
              sortedComments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-4 rounded-lg border ${comment.isPinned ? "border-success bg-success/5" : "border-border hover:bg-card/30"}`}
                >
                  {comment.isPinned && (
                    <div className="text-xs text-success mb-2 flex items-center gap-1">
                      <i className="fas fa-thumbtack"></i>
                      <span>Pinned by post author</span>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs border border-primary/30">
                      {comment.author.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{comment.author.name}</span>
                        <span className="text-muted-foreground text-xs">@{comment.author.handle}</span>
                        {comment.isBot && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Bot</span>
                        )}
                      </div>
                      <p className="text-sm text-foreground mt-1">{comment.content}</p>
                      <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                        <span>{new Date(comment.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex gap-4 mt-3 text-muted-foreground text-xs">
                        <button
                          onClick={() => handleLikeComment(comment.id)}
                          className={`hover:text-primary transition flex items-center gap-1 ${comment.liked ? "text-destructive" : ""}`}
                        >
                          <i className={`fas fa-heart ${comment.liked ? "fa-solid" : "fa-regular"}`}></i>
                          {comment.likes}
                        </button>
                        {profile.handle === post.author.handle && (
                          <button
                            onClick={() => handlePinComment(comment.id)}
                            className={`hover:text-primary transition flex items-center gap-1 ${comment.isPinned ? "text-success" : ""}`}
                          >
                            <i className="fas fa-thumbtack"></i>
                            {comment.isPinned ? "Pinned" : "Pin"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
