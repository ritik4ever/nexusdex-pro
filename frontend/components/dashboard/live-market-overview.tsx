"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Zap, Globe, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePriceStore, livePriceService } from "@/lib/api/live-price-service"

export function LiveMarketOverview() {
  const { prices, isConnected } = usePriceStore()
  const [marketStats, setMarketStats] = useState({
    totalMarketCap: 2.1e12,
    totalVolume: 89.5e9,
    btcDominance: 42.1,
    activeTraders: 1.2e6,
  })

  useEffect(() => {
    livePriceService.connect()
    return () => livePriceService.disconnect()
  }, [])

  const mainCoins = ["BTC", "ETH", "OKB", "USDT"]
  const marketData = mainCoins
    .map((symbol) => {
      const price = prices[symbol]
      if (!price) return null

      return {
        symbol,
        name: getTokenName(symbol),
        price: price.price,
        change24h: price.changePct24h,
        volume: price.volume24h,
        marketCap: price.marketCap,
        icon: getTokenIcon(symbol),
      }
    })
    .filter(Boolean)

  function getTokenName(symbol: string): string {
    const names: Record<string, string> = {
      BTC: "Bitcoin",
      ETH: "Ethereum",
      OKB: "OKB Token",
      USDT: "Tether",
    }
    return names[symbol] || symbol
  }

  function getTokenIcon(symbol: string) {
    const icons: Record<string, any> = {
      BTC: DollarSign,
      ETH: BarChart3,
      OKB: Zap,
      USDT: Activity,
    }
    return icons[symbol] || Activity
  }

  return (
    <div className="space-y-8">
      {/* Market Stats Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
        >
          <div className="text-4xl font-bold neon-text mb-2">${(marketStats.totalMarketCap / 1e12).toFixed(1)}T</div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Global Market Cap</div>
          <div className="w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mt-3 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
        >
          <div className="text-4xl font-bold text-green-400 mb-2">${(marketStats.totalVolume / 1e9).toFixed(1)}B</div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">24h Volume</div>
          <div className="w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-3 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
        >
          <div className="text-4xl font-bold text-yellow-400 mb-2">{marketStats.btcDominance}%</div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">BTC Dominance</div>
          <div className="w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mt-3 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
        >
          <div className="text-4xl font-bold text-purple-400 mb-2">{(marketStats.activeTraders / 1e6).toFixed(1)}M</div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Active Traders</div>
          <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-3 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        </motion.div>
      </div>

      {/* Live Market Data */}
      <Card className="glass-card border-white/10">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
                <Globe className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold gradient-text">Live Market Data</CardTitle>
                <div className="text-gray-400 mt-2 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Real-time price tracking • Updated every 2 seconds
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
              <Badge
                variant={isConnected ? "default" : "destructive"}
                className={`text-sm px-4 py-2 ${isConnected ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}`}
              >
                {isConnected ? "🟢 LIVE" : "🔴 OFFLINE"}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketData.map((token, index) => (
              <motion.div
                key={token?.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 group hover:scale-105 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                      <token.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">{token?.symbol}</div>
                      <div className="text-sm text-gray-400">{token?.name}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-3xl font-bold text-white">
                    $
                    {token?.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: token?.price < 1 ? 4 : 2,
                    })}
                  </div>

                  <div
                    className={`flex items-center gap-2 text-lg font-semibold ${
                      token?.change24h >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {token?.change24h >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {token?.change24h >= 0 ? "+" : ""}
                    {token?.change24h.toFixed(2)}%
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Volume</span>
                      <span>${(token?.volume / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mt-1">
                      <span>Market Cap</span>
                      <span>${(token?.marketCap / 1000000000).toFixed(1)}B</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
