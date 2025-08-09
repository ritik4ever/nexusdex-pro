"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { PortfolioOverview } from "@/components/portfolio/portfolio-overview"
import { TokenBalances } from "@/components/portfolio/token-balances"
import { TransactionHistory } from "@/components/portfolio/transaction-history"
import { PoweredByFooter } from "@/components/layout/powered-by-footer"
import { Wallet } from "lucide-react"

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <div className="text-center py-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center mb-6"
            >
              <Wallet className="w-8 h-8 text-green-400 mr-3 animate-pulse" />
              <span className="text-green-400 font-semibold text-lg">PORTFOLIO TRACKER</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl font-bold gradient-text mb-6 animate-glow"
            >
              Your Portfolio
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Track your DeFi investments, monitor performance, and analyze your trading history
            </motion.p>
          </div>

          {/* Portfolio Content */}
          <PortfolioOverview />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TokenBalances />
            <TransactionHistory />
          </div>
        </motion.div>
      </main>
      <PoweredByFooter />
    </div>
  )
}
