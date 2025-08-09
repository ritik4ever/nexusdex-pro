"use client"

import { motion } from "framer-motion"
import { SwapCard } from "@/components/swap/swap-card"
import { Header } from "@/components/layout/header"

export default function SwapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <SwapCard />
        </motion.div>
      </main>
    </div>
  )
}
