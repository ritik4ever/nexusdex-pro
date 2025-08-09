"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, RefreshCw, Star, Flame, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usePriceStore, livePriceService } from "@/lib/api/live-price-service"

export function TopCryptos() {
  const { prices, isConnected } = usePriceStore()

  useEffect(() => {
    if (!isConnected) {
      livePriceService.connect()
    }
  }, [isConnected])

  const cryptoList = Object.entries(prices)
    .map(([symbol, price]) => ({
      symbol,
      name: getTokenName(symbol),
      price: price.price,
      changePct24h: price.changePct24h,
      volume24h: price.volume24h,
      marketCap: price.marketCap,
      logoUrl: getTokenLogo(symbol),
      isHot: Math.abs(price.changePct24h) > 5,
      rank: getTokenRank(symbol),
    }))
    .sort((a, b) => b.marketCap - a.marketCap)
    .slice(0, 10)

  function getTokenName(symbol: string): string {
    const names: Record<string, string> = {
      BTC: "Bitcoin",
      ETH: "Ethereum",
      OKB: "OKB Token",
      USDT: "Tether",
      USDC: "USD Coin",
      BNB: "BNB",
      ADA: "Cardano",
      SOL: "Solana",
      MATIC: "Polygon",
      AVAX: "Avalanche",
    }
    return names[symbol] || symbol
  }

  function getTokenLogo(symbol: string): string {
    return `/crypto-${symbol.toLowerCase()}.png`
  }

  function getTokenRank(symbol: string): number {
    const ranks: Record<string, number> = {
      BTC: 1,
      ETH: 2,
      USDT: 3,
      BNB: 4,
      USDC: 5,
      SOL: 6,
      ADA: 7,
      AVAX: 8,
      MATIC: 9,
      OKB: 10,
    }
    return ranks[symbol] || 99
  }

  return (
    <Card className="glass-card border-white/10">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500/20 to-red-500/20">
              <Flame className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold gradient-text">Top Cryptocurrencies</CardTitle>
              <div className="text-gray-400 mt-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Live market data • Updated every 2s
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant={isConnected ? "default" : "destructive"}
              className={`text-sm px-4 py-2 ${isConnected ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}`}
            >
              {isConnected ? "🟢 LIVE" : "🔴 OFFLINE"}
            </Badge>
            <Button
              size="sm"
              onClick={() => livePriceService.connect()}
              variant="ghost"
              className="glass-card border-white/10 hover:border-cyan-500/30 px-4 py-2"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {cryptoList.map((crypto, index) => (
          <motion.div
            key={crypto.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-6 group hover:scale-[1.02] hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                    {crypto.symbol.charAt(0)}
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-black border border-white/20 rounded-full flex items-center justify-center text-xs font-bold text-gray-300">
                    {crypto.rank}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-lg">{crypto.symbol}</span>
                    {crypto.isHot && (
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-2 py-1">
                        <Flame className="w-3 h-3 mr-1" />
                        Hot
                      </Badge>
                    )}
                    {crypto.rank <= 3 && <Star className="w-5 h-5 text-yellow-400 fill-current" />}
                  </div>
                  <div className="text-gray-400 mt-1">{crypto.name}</div>
                  <div className="text-sm text-gray-500 mt-1">Vol: ${(crypto.volume24h / 1000000).toFixed(1)}M</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-white mb-2">
                  $
                  {crypto.price.toLocaleString(undefined, {
                    minimumFractionDigits: crypto.price < 1 ? 4 : 2,
                    maximumFractionDigits: crypto.price < 1 ? 4 : 2,
                  })}
                </div>
                <div
                  className={`flex items-center justify-end gap-2 text-lg font-bold ${
                    crypto.changePct24h >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {crypto.changePct24h >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  {crypto.changePct24h >= 0 ? "+" : ""}
                  {crypto.changePct24h.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-500 mt-1">MCap: ${(crypto.marketCap / 1000000000).toFixed(1)}B</div>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
