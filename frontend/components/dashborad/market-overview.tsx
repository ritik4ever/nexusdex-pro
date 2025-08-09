"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Zap, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePriceStore, livePriceService } from "@/lib/api/live-price-service"

export function MarketOverview() {
  const { prices, isConnected } = usePriceStore()

  useEffect(() => {
    livePriceService.connect()
    return () => livePriceService.disconnect()
  }, [])

  const mainCoins = ["BTC", "ETH", "OKB"]
  const stats = mainCoins
    .map((symbol) => {
      const price = prices[symbol]
      if (!price) return null

      return {
        title: symbol,
        value: `$${price.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: `${price.changePct24h >= 0 ? "+" : ""}${price.changePct24h.toFixed(2)}%`,
        isPositive: price.changePct24h >= 0,
        icon: symbol === "BTC" ? DollarSign : symbol === "ETH" ? BarChart3 : Zap,
        volume: price.volume24h,
        marketCap: price.marketCap,
      }
    })
    .filter(Boolean)

  return (
    <Card className="premium-glass border-premium shadow-premium" data-testid="market-overview">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Global Market
            </span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              {isConnected ? "Live" : "Offline"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat?.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105"
              data-testid={`market-stat-${stat?.title.toLowerCase()}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                    <stat.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stat?.title}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white" data-testid={`price-${stat?.title.toLowerCase()}`}>
                    {stat?.value}
                  </div>

                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${stat?.isPositive ? "text-green-400" : "text-red-400"
                      }`}
                    data-testid={`change-${stat?.title.toLowerCase()}`}
                  >
                    {stat?.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {stat?.change}
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Vol: ${(stat?.volume / 1000000).toFixed(1)}M</span>
                      <span>MCap: ${(stat?.marketCap / 1000000000).toFixed(1)}B</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Market Summary */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-400">24h</div>
              <div className="text-xs text-gray-400">Update Interval</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">+2.3%</div>
              <div className="text-xs text-gray-400">Market Trend</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">$2.1T</div>
              <div className="text-xs text-gray-400">Total Market Cap</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-400">42.1%</div>
              <div className="text-xs text-gray-400">BTC Dominance</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
