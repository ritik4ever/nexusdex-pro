"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Wallet, TrendingUp, Eye, EyeOff, RefreshCw, PieChart, Target, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { usePriceStore } from "@/lib/api/live-price-service"

export function WalletOverview() {
  const [showBalance, setShowBalance] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [walletData, setWalletData] = useState({
    totalBalance: 12547.89,
    totalBalanceChange: 234.56,
    totalBalanceChangePct: 1.91,
    tokens: [
      { symbol: "OKB", balance: 150.5, value: 7876.25, change: 1.25, price: 52.34, allocation: 62.5 },
      { symbol: "ETH", balance: 1.75, value: 4639.31, change: 1.17, price: 2651.03, allocation: 37.0 },
      { symbol: "USDT", balance: 32.33, value: 32.33, change: 0.01, price: 1.0, allocation: 0.5 },
    ],
  })

  const { prices } = usePriceStore()

  useEffect(() => {
    // Update wallet values based on live prices
    if (Object.keys(prices).length > 0) {
      setWalletData((prev) => ({
        ...prev,
        tokens: prev.tokens.map((token) => {
          const livePrice = prices[token.symbol]
          if (livePrice) {
            const newValue = token.balance * livePrice.price
            return {
              ...token,
              price: livePrice.price,
              value: newValue,
              change: livePrice.changePct24h,
            }
          }
          return token
        }),
      }))
    }
  }, [prices])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const totalValue = walletData.tokens.reduce((sum, token) => sum + token.value, 0)
  const totalChange = walletData.tokens.reduce((sum, token) => sum + (token.value * token.change) / 100, 0)
  const totalChangePct = (totalChange / totalValue) * 100

  return (
    <Card className="premium-glass border-premium shadow-premium" data-testid="wallet-overview">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-green-500/20">
              <Wallet className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <CardTitle className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Portfolio Overview
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">
                  Live Tracking
                </Badge>
                <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-400">
                  Auto-Sync
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="text-gray-400 hover:text-white hover:bg-white/10"
              data-testid="toggle-balance-visibility"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-gray-400 hover:text-white hover:bg-white/10"
              data-testid="refresh-wallet"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Total Balance */}
        <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20">
          <div className="text-4xl font-bold text-white mb-2" data-testid="total-balance">
            {showBalance ? `$${totalValue.toLocaleString()}` : "••••••"}
          </div>
          <div className="flex items-center justify-center gap-2 text-green-400" data-testid="balance-change">
            <TrendingUp className="w-5 h-5" />
            <span className="text-lg font-semibold">
              {showBalance ? `+$${totalChange.toFixed(2)} (${totalChangePct.toFixed(2)}%)` : "••••"}
            </span>
          </div>
          <div className="text-sm text-gray-400 mt-2">24h Portfolio Change</div>
        </div>

        {/* Asset Allocation */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-semibold text-white">Asset Allocation</h4>
          </div>

          {walletData.tokens.map((token, index) => (
            <motion.div
              key={token.symbol}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
              data-testid={`wallet-token-${token.symbol.toLowerCase()}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {token.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="font-semibold text-white"
                        data-testid={`token-symbol-${token.symbol.toLowerCase()}`}
                      >
                        {token.symbol}
                      </span>
                      {token.change > 5 && (
                        <Badge variant="default" className="text-xs px-1.5 py-0.5 bg-green-500/20 text-green-400">
                          <Zap className="w-3 h-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-400" data-testid={`token-balance-${token.symbol.toLowerCase()}`}>
                      {showBalance ? `${token.balance.toFixed(4)} ${token.symbol}` : "••••"}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="text-lg font-bold text-white"
                    data-testid={`token-value-${token.symbol.toLowerCase()}`}
                  >
                    {showBalance ? `$${token.value.toFixed(2)}` : "••••"}
                  </div>
                  <div
                    className={`text-sm font-semibold ${token.change >= 0 ? "text-green-400" : "text-red-400"}`}
                    data-testid={`token-change-${token.symbol.toLowerCase()}`}
                  >
                    {token.change >= 0 ? "+" : ""}
                    {token.change.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500">${token.price.toFixed(2)}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Allocation</span>
                  <span>{token.allocation}%</span>
                </div>
                <Progress value={token.allocation} className="h-2 bg-gray-700">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${token.allocation}%` }}
                  />
                </Progress>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Total Assets</span>
            </div>
            <div className="text-xl font-bold text-green-400">3</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">Performance</span>
            </div>
            <div className="text-xl font-bold text-purple-400">+{totalChangePct.toFixed(1)}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
