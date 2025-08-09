"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { BarChart3, TrendingUp, Maximize2, Activity, Zap, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { usePriceStore } from "@/lib/api/live-price-service"

export function AdvancedTradingChart() {
  const [timeframe, setTimeframe] = useState("1H")
  const [selectedPair, setSelectedPair] = useState("BTC")
  const [chartData, setChartData] = useState<any[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { prices } = usePriceStore()

  useEffect(() => {
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
    <Card className={`glass-card border-white/10 ${isFullscreen ? "fixed inset-4 z-50" : ""}`}>
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500/20 to-blue-500/20">
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold gradient-text">{selectedPair}/USDT Professional Chart</CardTitle>
              <div className="flex items-center gap-3 mt-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Activity className="w-3 h-3 mr-1" />
                  Real-time
                </Badge>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                  <Zap className="w-3 h-3 mr-1" />
                  Advanced
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  <Target className="w-3 h-3 mr-1" />
                  Pro Tools
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {tradingPairs.map((pair) => (
                <Button
                  key={pair}
                  size="sm"
                  variant={selectedPair === pair ? "default" : "ghost"}
                  onClick={() => setSelectedPair(pair)}
                  className={`text-sm px-4 py-2 ${
                    selectedPair === pair
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold"
                      : "glass-card border-white/10 hover:border-cyan-500/30"
                  }`}
                >
                  {pair}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {timeframes.map((tf) => (
                <Button
                  key={tf}
                  size="sm"
                  variant={timeframe === tf ? "default" : "ghost"}
                  onClick={() => setTimeframe(tf)}
                  className={`text-sm px-4 py-2 ${
                    timeframe === tf
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold"
                      : "glass-card border-white/10 hover:border-green-500/30"
                  }`}
                >
                  {tf}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="glass-card border-white/10 hover:border-cyan-500/30 p-3"
            >
              <Maximize2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-8 mt-6">
          <div className="text-5xl font-bold neon-text">
            ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div
            className={`flex items-center text-2xl font-bold ${priceChange >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            <TrendingUp className={`w-6 h-6 mr-3 ${priceChange < 0 ? "rotate-180" : ""}`} />
            {priceChange >= 0 ? "+" : ""}${priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
          </div>
          <div className="text-lg text-gray-400">
            24h Vol: ${(prices[selectedPair]?.volume24h / 1000000 || 0).toFixed(1)}M
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className={`${isFullscreen ? "h-[calc(100vh-300px)]" : "h-96"} mb-6`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ffff" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00ffff" stopOpacity={0} />
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
                  border: "1px solid rgba(0,255,255,0.3)",
                  borderRadius: "12px",
                  color: "white",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0,255,255,0.2)",
                }}
                formatter={(value: any, name: string) => [
                  name === "price" ? `$${Number(value).toLocaleString()}` : value,
                  name === "price" ? "Price" : "Volume",
                ]}
                labelStyle={{ color: "#00ffff" }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#00ffff"
                strokeWidth={3}
                fill="url(#priceGradient)"
                dot={false}
                activeDot={{
                  r: 8,
                  stroke: "#00ffff",
                  strokeWidth: 3,
                  fill: "#000000",
                  filter: "drop-shadow(0 0 10px #00ffff)",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Technical Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 text-center">
            <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">RSI (14)</div>
            <div className="text-2xl font-bold text-cyan-400">67.3</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">MACD</div>
            <div className="text-2xl font-bold text-green-400">+124.5</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Support</div>
            <div className="text-2xl font-bold text-yellow-400">${(currentPrice * 0.95).toFixed(0)}</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Resistance</div>
            <div className="text-2xl font-bold text-red-400">${(currentPrice * 1.05).toFixed(0)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
