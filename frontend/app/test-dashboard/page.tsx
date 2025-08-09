"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { DashboardTest } from "@/components/dashboard/dashboard-test"
import { MarketOverview } from "@/components/dashboard/market-overview"
import { TradingChart } from "@/components/dashboard/trading-chart"
import { TopCryptos } from "@/components/dashboard/top-cryptos"
import { NFTCollections } from "@/components/dashboard/nft-collections"
import { WalletOverview } from "@/components/dashboard/wallet-overview"
import { PoweredByFooter } from "@/components/layout/powered-by-footer"

export default function TestDashboardPage() {
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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Dashboard Component Testing
            </h1>
          </div>

          {/* Test Results */}
          <DashboardTest />

          {/* Live Components */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Live Dashboard Components</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <MarketOverview />
                <TradingChart />
              </div>
              <div className="space-y-8">
                <WalletOverview />
                <TopCryptos />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <NFTCollections />
            </div>
          </div>
        </motion.div>
      </main>
      <PoweredByFooter />
    </div>
  )
}
