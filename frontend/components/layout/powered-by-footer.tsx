"use client"

import { motion } from "framer-motion"
import { Zap, Shield, Globe } from "lucide-react"

export function PoweredByFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-20 py-12 border-t border-white/10"
    >
      <div className="container mx-auto px-4">
        <div className="glass-card p-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            <div className="flex items-center space-x-6">
              <span className="text-lg text-gray-400">Powered by</span>
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                    <span className="text-black text-lg font-bold">O</span>
                  </div>
                  <span className="text-lg font-semibold text-white">OKX</span>
                </div>
                <div className="w-px h-6 bg-white/20"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">X</span>
                  </div>
                  <span className="text-lg font-semibold text-white">X Layer</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Fast</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Global</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-400">
              Built on X Layer blockchain • Real-time data from OKX API •
              <span className="text-cyan-400 ml-1">NexusDEX Pro © 2025</span>
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
