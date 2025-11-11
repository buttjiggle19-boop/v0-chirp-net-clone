"use client"

import type React from "react"
import { useState } from "react"

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
}

interface EditProfileModalProps {
  profile: UserProfile
  onClose: () => void
  onSave: (profile: UserProfile) => void
}

export default function EditProfileModal({ profile, onClose, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState(profile)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "followers" || name === "following" || name === "monthlyViewers" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleAvatarChange = (emoji: string) => {
    setFormData((prev) => ({
      ...prev,
      avatar: emoji,
    }))
  }

  const handleSave = () => {
    onSave(formData)
  }

  const emojis = ["👤", "🧑", "👨", "👩", "🤖", "👽", "🐱", "🦊", "🐻", "🦁"]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-background rounded-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-border shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background">
          <button onClick={onClose} className="text-2xl text-primary hover:bg-primary/10 p-2 rounded-full transition">
            ✕
          </button>
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition"
          >
            Save
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-bold mb-2">Avatar</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleAvatarChange(emoji)}
                  className={`text-3xl p-2 rounded-lg transition ${
                    formData.avatar === emoji ? "bg-primary/30 border-2 border-primary" : "hover:bg-card"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-bold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={50}
              className="w-full bg-input text-foreground border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition"
              placeholder="Your name"
            />
          </div>

          {/* Handle */}
          <div>
            <label className="block text-sm font-bold mb-1">Handle</label>
            <input
              type="text"
              name="handle"
              value={formData.handle}
              onChange={handleChange}
              maxLength={30}
              className="w-full bg-input text-foreground border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition"
              placeholder="@handle"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-bold mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              maxLength={160}
              rows={3}
              className="w-full bg-input text-foreground border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary resize-none transition"
              placeholder="Write a bio..."
            />
            <p className="text-xs text-muted-foreground mt-1">{formData.bio.length}/160</p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-bold mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              maxLength={30}
              className="w-full bg-input text-foreground border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition"
              placeholder="Add location"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-bold mb-1">Website</label>
            <input
              type="text"
              name="website"
              value={formData.website || ""}
              onChange={handleChange}
              maxLength={50}
              className="w-full bg-input text-foreground border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition"
              placeholder="Add website"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Monthly Viewers</label>
            <input
              type="number"
              name="monthlyViewers"
              value={formData.monthlyViewers || 0}
              onChange={handleChange}
              className="w-full bg-input text-foreground border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition"
              placeholder="0"
            />
          </div>

          {/* Followers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold mb-1">Followers</label>
              <input
                type="number"
                name="followers"
                value={formData.followers}
                onChange={handleChange}
                className="w-full bg-input text-foreground border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Following</label>
              <input
                type="number"
                name="following"
                value={formData.following}
                onChange={handleChange}
                className="w-full bg-input text-foreground border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
