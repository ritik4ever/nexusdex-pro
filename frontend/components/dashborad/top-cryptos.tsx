"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMarketData } from "@/hooks/use-market-data"
import { Skeleton } from "@/components/ui/skeleton"

export function TopCryptos() {
  const { data: cryptos, isLoading, error, refetch } = useMarketData()

  if (error) {
    return (
      <Card className="glass-card border-white/20 border-red-200" data-testid="top-cryptos">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-red-600">Top Cryptocurrencies - Error</CardTitle>
            <Button size="sm" onClick={() => refetch()} variant="outline">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-red-500 text-sm">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="glass-card border-white/20" data-testid="top-cryptos">
        <CardHeader>
          <CardTitle>Top Cryptocurrencies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-white/20" data-testid="top-cryptos">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Top Cryptocurrencies</CardTitle>
          <Button size="sm" onClick={() => refetch()} variant="ghost" className="text-xs">
            <RefreshCw className="w-3 h-3 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {cryptos?.slice(0, 10).map((crypto, index) => (
          <motion.div
            key={crypto.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors cursor-pointer"
            data-testid={`crypto-item-${crypto.symbol.toLowerCase()}`}
          >
            <div className="flex items-center space-x-3">
              {crypto.logoUrl ? (
                <img
                  src={crypto.logoUrl || "/placeholder.svg"}
                  alt={crypto.symbol}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    e.currentTarget.nextElementSibling?.classList.remove("hidden")
                  }}
                />
              ) : null}
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold ${crypto.logoUrl ? "hidden" : ""}`}
              >
                {crypto.symbol.charAt(0)}
              </div>
              <div>
                <div className="font-medium" data-testid={`crypto-symbol-${crypto.symbol.toLowerCase()}`}>
                  {crypto.symbol}
                </div>
                <div className="text-xs text-gray-500">{crypto.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium" data-testid={`crypto-price-${crypto.symbol.toLowerCase()}`}>
                ${crypto.price.toLocaleString()}
              </div>
              <div
                className={`text-xs flex items-center ${crypto.changePct24h >= 0 ? "text-green-600" : "text-red-600"}`}
                data-testid={`crypto-change-${crypto.symbol.toLowerCase()}`}
              >
                {crypto.changePct24h >= 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {crypto.changePct24h >= 0 ? "+" : ""}
                {crypto.changePct24h.toFixed(2)}%
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
