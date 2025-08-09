"use client"

import { motion } from "framer-motion"
import { ExternalLink, ArrowUpRight, ArrowDownLeft, History } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTransactionHistory } from "@/hooks/use-transaction-history"
import { Skeleton } from "@/components/ui/skeleton"

export function TransactionHistory() {
  const { data: transactions, isLoading } = useTransactionHistory()

  // Mock data for demo
  const mockTransactions = [
    {
      hash: "0x1234...5678",
      type: "swap" as const,
      tokenIn: { symbol: "ETH", name: "Ethereum" },
      tokenOut: { symbol: "USDT", name: "Tether" },
      amountIn: "1.5",
      amountOut: "3975.50",
      timestamp: Date.now() - 3600000,
      status: "success" as const,
    },
    {
      hash: "0x2345...6789",
      type: "add_liquidity" as const,
      amountIn: "1000",
      amountOut: "1000",
      timestamp: Date.now() - 7200000,
      status: "success" as const,
    },
    {
      hash: "0x3456...7890",
      type: "swap" as const,
      tokenIn: { symbol: "BTC", name: "Bitcoin" },
      tokenOut: { symbol: "ETH", name: "Ethereum" },
      amountIn: "0.1",
      amountOut: "1.63",
      timestamp: Date.now() - 10800000,
      status: "pending" as const,
    },
  ]

  const txHistory = transactions || mockTransactions

  if (isLoading) {
    return (
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold gradient-text">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="w-10 h-10 rounded-full bg-gray-600" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-24 bg-gray-600" />
                <Skeleton className="h-3 w-32 bg-gray-700" />
              </div>
              <Skeleton className="h-4 w-16 bg-gray-600" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20">
            <History className="w-6 h-6 text-purple-400" />
          </div>
          <CardTitle className="text-2xl font-bold gradient-text">Recent Transactions</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {txHistory.slice(0, 10).map((tx, index) => (
          <motion.div
            key={tx.hash}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-4 group hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === "swap" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {tx.type === "swap" ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                </div>
                <div>
                  <div className="font-bold text-white capitalize">{tx.type.replace("_", " ")}</div>
                  <div className="text-sm text-gray-400">{new Date(tx.timestamp).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    tx.status === "success"
                      ? "bg-green-500/20 text-green-400"
                      : tx.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {tx.status.toUpperCase()}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
