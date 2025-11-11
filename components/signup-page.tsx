"use client"

import type React from "react"

import { useState } from "react"

interface SignupPageProps {
  onSignup: (name: string, username: string) => void
}

export default function SignupPage({ onSignup }: SignupPageProps) {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && username.trim()) {
      onSignup(name, username)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-primary mb-2">PicPopper</h1>
          <p className="text-muted-foreground text-lg">Share your moments</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose your username"
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || !username.trim()}
            className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all duration-200"
          >
            Get Started
          </button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-6">Your data is saved locally on your device</p>
      </div>
    </div>
  )
}
