"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { PortfolioOverview } from "@/components/portfolio/portfolio-overview"
import { TokenBalances } from "@/components/portfolio/token-balances"
import { TransactionHistory } from "@/components/portfolio/transaction-history"

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <PortfolioOverview />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TokenBalances />
            <TransactionHistory />
          </div>
        </motion.div>
      </main>
    </div>
  )
}
