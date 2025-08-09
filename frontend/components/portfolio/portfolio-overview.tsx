"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePortfolio } from "@/hooks/use-portfolio"
import { Skeleton } from "@/components/ui/skeleton"

export function PortfolioOverview() {
  const { data: portfolio, isLoading } = usePortfolio()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const stats = [
    {
      title: "Total Value",
      value: `$${portfolio?.totalValue.toLocaleString() || "0"}`,
      icon: DollarSign,
      change: null,
    },
    {
      title: "Total P&L",
      value: `$${portfolio?.totalPnL.toLocaleString() || "0"}`,
      icon: portfolio?.totalPnL >= 0 ? TrendingUp : TrendingDown,
      change: `${portfolio?.totalPnLPercentage.toFixed(2) || "0"}%`,
      positive: portfolio?.totalPnL >= 0,
    },
    {
      title: "Active Positions",
      value: portfolio?.balances.length.toString() || "0",
      icon: Activity,
      change: null,
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
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/20 dark:border-gray-700/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change && (
                <p className={`text-xs ${stat.positive ? "text-green-600" : "text-red-600"}`}>
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
