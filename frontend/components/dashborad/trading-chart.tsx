"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, RefreshCw, Star, Flame } from "lucide-react"
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
    <Card className="premium-glass border-premium shadow-premium" data-testid="top-cryptos">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <CardTitle className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Top Cryptocurrencies
              </CardTitle>
              <div className="text-xs text-gray-400 mt-1">Live market data • Updated every 2s</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              {isConnected ? "Live" : "Offline"}
            </Badge>
            <Button
              size="sm"
              onClick={() => livePriceService.connect()}
              variant="ghost"
              className="text-xs hover:bg-white/10"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {cryptoList.map((crypto, index) => (
          <motion.div
            key={crypto.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            data-testid={`crypto-item-${crypto.symbol.toLowerCase()}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {crypto.symbol.charAt(0)}
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-gray-300">
                    {crypto.rank}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="font-semibold text-white"
                      data-testid={`crypto-symbol-${crypto.symbol.toLowerCase()}`}
                    >
                      {crypto.symbol}
                    </span>
                    {crypto.isHot && (
                      <Badge
                        variant="destructive"
                        className="text-xs px-1.5 py-0.5 bg-gradient-to-r from-orange-500 to-red-500"
                      >
                        <Flame className="w-3 h-3 mr-1" />
                        Hot
                      </Badge>
                    )}
                    {crypto.rank <= 3 && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                  </div>
                  <div className="text-sm text-gray-400">{crypto.name}</div>
                  <div className="text-xs text-gray-500">Vol: ${(crypto.volume24h / 1000000).toFixed(1)}M</div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className="text-lg font-bold text-white"
                  data-testid={`crypto-price-${crypto.symbol.toLowerCase()}`}
                >
                  $
                  {crypto.price.toLocaleString(undefined, {
                    minimumFractionDigits: crypto.price < 1 ? 4 : 2,
                    maximumFractionDigits: crypto.price < 1 ? 4 : 2,
                  })}
                </div>
                <div
                  className={`flex items-center justify-end gap-1 text-sm font-semibold ${crypto.changePct24h >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  data-testid={`crypto-change-${crypto.symbol.toLowerCase()}`}
                >
                  {crypto.changePct24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {crypto.changePct24h >= 0 ? "+" : ""}
                  {crypto.changePct24h.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500">MCap: ${(crypto.marketCap / 1000000000).toFixed(1)}B</div>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
