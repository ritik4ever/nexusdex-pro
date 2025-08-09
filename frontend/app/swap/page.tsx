"use client"

import { motion } from "framer-motion"
import { ProductionSwapCard } from "@/components/swap/production-swap-card"
import { Header } from "@/components/layout/header"
import { PoweredByFooter } from "@/components/layout/powered-by-footer"
import { Zap, ArrowUpDown, Shield } from "lucide-react"

export default function SwapPage() {
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
              <ArrowUpDown className="w-8 h-8 text-cyan-400 mr-3 animate-pulse" />
              <span className="text-cyan-400 font-semibold text-lg">PRODUCTION SWAP</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl font-bold gradient-text mb-6 animate-glow"
            >
              Professional Trading
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Swap tokens with real-time OKX pricing, production-grade execution, and institutional security
            </motion.p>
          </div>

          {/* Swap Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-md mx-auto"
          >
            <ProductionSwapCard />
          </motion.div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="premium-glass p-6 text-center"
            >
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Real-Time Pricing</h3>
              <p className="text-gray-400">Live prices from OKX API with 10-second updates</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="premium-glass p-6 text-center"
            >
              <ArrowUpDown className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Smart Routing</h3>
              <p className="text-gray-400">Optimal execution with minimal slippage</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="premium-glass p-6 text-center"
            >
              <Shield className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Production Ready</h3>
              <p className="text-gray-400">Enterprise-grade security and reliability</p>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <PoweredByFooter />
    </div>
  )
}
