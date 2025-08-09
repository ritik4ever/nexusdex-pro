"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { YieldFarming } from "@/components/dashboard/yield-farming"
import { PriceAlerts } from "@/components/dashboard/price-alerts"
import { PoweredByFooter } from "@/components/layout/powered-by-footer"
import { livePriceService } from "@/lib/api/live-price-service"
import { BarChart3, TrendingUp, Target, Zap } from "lucide-react"

export default function AnalyticsPage() {
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
              <BarChart3 className="w-8 h-8 text-purple-400 mr-3 animate-pulse" />
              <span className="text-purple-400 font-semibold text-lg">ADVANCED ANALYTICS</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl font-bold gradient-text mb-6 animate-glow"
            >
              Analytics Hub
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Professional-grade analytics tools for yield farming, price alerts, and portfolio optimization
            </motion.p>
          </div>

          {/* Analytics Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
            >
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-400 mb-2">145.6%</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Max APY</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
            >
              <Target className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-3xl font-bold neon-text mb-2">12</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Active Alerts</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
            >
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-yellow-400 mb-2">$2.1K</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Total Staked</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
            >
              <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-purple-400 mb-2">94.2%</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Success Rate</div>
            </motion.div>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <YieldFarming />
            <PriceAlerts />
          </div>
        </motion.div>
      </main>
      <PoweredByFooter />
    </div>
  )
}
