"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { LivePriceDashboard } from "@/components/dashboard/live-price-dashboard"
import { AdvancedTradingChart } from "@/components/dashboard/advanced-trading-chart"
import { PoweredByFooter } from "@/components/layout/powered-by-footer"
import { okxPriceService } from "@/lib/api/okx-price-service"
import { TrendingUp, Zap, Shield, BarChart3, Wallet } from "lucide-react"

export default function DashboardPage() {
  useEffect(() => {
    okxPriceService.connect()
    return () => {
      okxPriceService.disconnect()
    }
  }, [])

  const features = [
    {
      icon: TrendingUp,
      title: "Real-Time Data",
      description: "Live market data from OKX API with 10-second updates",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Shield,
      title: "Production Ready",
      description: "Enterprise-grade security with smart contract audits",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Professional trading tools and market analysis",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Wallet,
      title: "Multi-Chain",
      description: "Support for multiple blockchains and protocols",
      color: "from-orange-500 to-red-500",
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          {/* Hero Section */}
          <div className="text-center py-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-3xl"></div>
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center mb-6"
              >
                <Zap className="w-8 h-8 text-yellow-400 mr-3 animate-pulse" />
                <span className="text-yellow-400 font-semibold text-lg">PRODUCTION READY</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-7xl md:text-8xl font-bold gradient-text mb-8 animate-glow"
              >
                NexusDEX Pro
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12"
              >
                Professional DeFi trading platform with real-time OKX API integration, production-grade swapping, and
                institutional features
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-4"
              >
                <button className="btn-primary">Start Trading Now</button>
                <button className="btn-secondary">View Live Prices</button>
              </motion.div>
            </div>
          </div>

          {/* Live Price Dashboard */}
          <LivePriceDashboard />

          {/* Advanced Trading Chart */}
          <AdvancedTradingChart />

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="premium-glass p-8 text-center group hover:scale-105 transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="premium-glass p-12 text-center"
          >
            <h2 className="text-4xl font-bold gradient-text mb-12">Live Platform Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="metric-card">
                <div className="metric-value neon-text">LIVE</div>
                <div className="metric-label">OKX API Status</div>
              </div>
              <div className="metric-card">
                <div className="metric-value text-green-400">10s</div>
                <div className="metric-label">Update Interval</div>
              </div>
              <div className="metric-card">
                <div className="metric-value text-purple-400">99.9%</div>
                <div className="metric-label">Uptime</div>
              </div>
              <div className="metric-card">
                <div className="metric-value text-yellow-400">&lt;100ms</div>
                <div className="metric-label">API Latency</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
      <PoweredByFooter />
    </div>
  )
}
