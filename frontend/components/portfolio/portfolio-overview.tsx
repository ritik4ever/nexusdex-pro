"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePortfolio } from "@/hooks/use-portfolio"
import { Skeleton } from "@/components/ui/skeleton"

export function PortfolioOverview() {
  const { data: portfolio, isLoading } = usePortfolio()

  // Mock data for demo
  const mockPortfolio = {
    totalValue: 12547.89,
    totalPnL: 234.56,
    totalPnLPercentage: 1.91,
    balances: [
      { token: { symbol: "BTC", name: "Bitcoin" }, balance: "0.25", balanceUSD: 10800 },
      { token: { symbol: "ETH", name: "Ethereum" }, balance: "2.5", balanceUSD: 6625 },
      { token: { symbol: "OKB", name: "OKB Token" }, balance: "150", balanceUSD: 7875 },
    ],
  }

  const portfolioData = portfolio || mockPortfolio

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="glass-card border-white/10">
            <CardHeader>
              <Skeleton className="h-4 w-24 bg-gray-600" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2 bg-gray-600" />
              <Skeleton className="h-4 w-20 bg-gray-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const stats = [
    {
      title: "Total Value",
      value: `$${portfolioData.totalValue.toLocaleString()}`,
      icon: DollarSign,
      change: null,
      color: "text-cyan-400",
    },
    {
      title: "Total P&L",
      value: `$${portfolioData.totalPnL.toLocaleString()}`,
      icon: portfolioData.totalPnL >= 0 ? TrendingUp : TrendingDown,
      change: `${portfolioData.totalPnLPercentage.toFixed(2)}%`,
      positive: portfolioData.totalPnL >= 0,
      color: portfolioData.totalPnL >= 0 ? "text-green-400" : "text-red-400",
    },
    {
      title: "Active Positions",
      value: portfolioData.balances.length.toString(),
      icon: Activity,
      change: null,
      color: "text-purple-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="glass-card border-white/10 group hover:scale-105 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              {stat.change && (
                <p className={`text-sm mt-2 ${stat.positive ? "text-green-400" : "text-red-400"}`}>
                  {stat.positive ? "+" : ""}
                  {stat.change}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
