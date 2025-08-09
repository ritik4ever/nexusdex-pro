"use client"

import { useEffect } from "react"
import { redirect } from "next/navigation"

export default function HomePage() {
  useEffect(() => {
    redirect("/dashboard")
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl font-bold gradient-text mb-4 animate-glow">NexusDEX Pro</div>
        <div className="text-gray-400 animate-pulse">Loading the future of DeFi...</div>
        <div className="mt-8">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
