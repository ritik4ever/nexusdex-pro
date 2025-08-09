"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { TopCryptos } from "@/components/dashboard/top-cryptos"
import { NFTCollections } from "@/components/dashboard/nft-collections"
import { PoweredByFooter } from "@/components/layout/powered-by-footer"
import { livePriceService } from "@/lib/api/live-price-service"
import { TrendingUp, BarChart3, Zap, Globe } from "lucide-react"

export default function MarketsPage() {
  useEffect(() => {
    livePriceService.connect()
    return () => {
      livePriceService.disconnect()
    }
  }, [])

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
              <Globe className="w-8 h-8 text-cyan-400 mr-3 animate-pulse" />
              <span className="text-cyan-400 font-semibold text-lg">GLOBAL MARKETS</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl font-bold gradient-text mb-6 animate-glow"
            >
              Market Overview
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Real-time cryptocurrency and NFT market data with professional analytics and insights
            </motion.p>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
            >
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-400 mb-2">+2.3%</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Market Trend</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
            >
              <BarChart3 className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-3xl font-bold neon-text mb-2">1,247</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Active Pairs</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
            >
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Live Updates</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
            >
              <Globe className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-purple-400 mb-2">Global</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Coverage</div>
            </motion.div>
          </div>

          {/* Markets Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TopCryptos />
            <NFTCollections />
          </div>
        </motion.div>
      </main>
      <PoweredByFooter />
    </div>
  )
}
