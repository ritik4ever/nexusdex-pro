"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { BarChart3, TrendingUp, Maximize2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { usePriceStore } from "@/lib/api/live-price-service"

export function TradingChart() {
  const [timeframe, setTimeframe] = useState("1H")
  const [selectedPair, setSelectedPair] = useState("BTC")
  const [chartData, setChartData] = useState<any[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { prices } = usePriceStore()

  useEffect(() => {
    // Generate realistic chart data
    const generateChartData = () => {
      const intervals = timeframe === "1H" ? 60 : timeframe === "24H" ? 24 : 7
      const data = []
      const currentPrice = prices[selectedPair]?.price || 43250

      for (let i = intervals; i >= 0; i--) {
        const time = new Date(Date.now() - i * (timeframe === "1H" ? 60000 : timeframe === "24H" ? 3600000 : 86400000))
        const volatility = 0.02
        const change = (Math.random() - 0.5) * volatility
        const price = currentPrice * (1 + change * (i / intervals))

        data.push({
          time:
            timeframe === "7D"
              ? time.toLocaleDateString("en-US", { weekday: "short" })
              : timeframe === "24H"
                ? time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                : time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          price: price,
          volume: Math.random() * 1000 + 500,
        })
      }
      return data
    }

    setChartData(generateChartData())
  }, [timeframe, selectedPair, prices])

  const currentPrice = prices[selectedPair]?.price || 0
  const priceChange = prices[selectedPair]?.change24h || 0
  const priceChangePercent = prices[selectedPair]?.changePct24h || 0

  const timeframes = ["1H", "24H", "7D"]
  const tradingPairs = ["BTC", "ETH", "OKB"]

  return (
    <Card
      className={`premium-glass border-premium shadow-premium ${isFullscreen ? "fixed inset-4 z-50" : ""}`}
      data-testid="trading-chart"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-green-500/20 to-blue-500/20">
              <BarChart3 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <CardTitle className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                {selectedPair}/USDT Advanced Chart
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">
                  Real-time
                </Badge>
                <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-400">
                  TradingView
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {tradingPairs.map((pair) => (
                <Button
                  key={pair}
                  size="sm"
                  variant={selectedPair === pair ? "default" : "ghost"}
                  onClick={() => setSelectedPair(pair)}
                  className={`text-xs ${selectedPair === pair ? "bg-gradient-to-r from-blue-500 to-purple-500" : ""}`}
                >
                  {pair}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {timeframes.map((tf) => (
                <Button
                  key={tf}
                  size="sm"
                  variant={timeframe === tf ? "default" : "ghost"}
                  onClick={() => setTimeframe(tf)}
                  className={`text-xs ${timeframe === tf ? "bg-gradient-to-r from-green-500 to-blue-500" : ""}`}
                >
                  {tf}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-gray-400 hover:text-white"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-4">
          <div className="text-3xl font-bold text-white" data-testid="current-price">
            ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div
            className={`flex items-center text-lg font-semibold ${priceChange >= 0 ? "text-green-400" : "text-red-400"}`}
            data-testid="price-change"
          >
            <TrendingUp className={`w-5 h-5 mr-2 ${priceChange < 0 ? "rotate-180" : ""}`} />
            {priceChange >= 0 ? "+" : ""}${priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
          </div>
          <div className="text-sm text-gray-400">
            24h Vol: ${(prices[selectedPair]?.volume24h / 1000000 || 0).toFixed(1)}M
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className={`${isFullscreen ? "h-[calc(100vh-200px)]" : "h-96"}`} data-testid="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="time"
                stroke="rgba(255,255,255,0.5)"
                fontSize={12}
                tick={{ fill: "rgba(255,255,255,0.7)" }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.5)"
                fontSize={12}
                tick={{ fill: "rgba(255,255,255,0.7)" }}
                domain={["dataMin - 100", "dataMax + 100"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.9)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  borderRadius: "12px",
                  color: "white",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                formatter={(value: any, name: string) => [
                  name === "price" ? `$${Number(value).toLocaleString()}` : value,
                  name === "price" ? "Price" : "Volume",
                ]}
                labelStyle={{ color: "#10b981" }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#priceGradient)"
                dot={false}
                activeDot={{
                  r: 6,
                  stroke: "#10b981",
                  strokeWidth: 2,
                  fill: "#ffffff",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Technical Indicators */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <div className="text-xs text-gray-400 uppercase tracking-wider">RSI (14)</div>
            <div className="text-lg font-bold text-blue-400">67.3</div>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
            <div className="text-xs text-gray-400 uppercase tracking-wider">MACD</div>
            <div className="text-lg font-bold text-green-400">+124.5</div>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="text-xs text-gray-400 uppercase tracking-wider">BB Upper</div>
            <div className="text-lg font-bold text-purple-400">${(currentPrice * 1.02).toFixed(0)}</div>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
            <div className="text-xs text-gray-400 uppercase tracking-wider">Support</div>
            <div className="text-lg font-bold text-orange-400">${(currentPrice * 0.95).toFixed(0)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
