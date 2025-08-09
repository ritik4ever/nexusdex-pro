"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePortfolio } from "@/hooks/use-portfolio"
import { Skeleton } from "@/components/ui/skeleton"
import { Wallet } from "lucide-react"

export function TokenBalances() {
  const { data: portfolio, isLoading } = usePortfolio()

  // Mock data for demo
  const mockBalances = [
    {
      token: { address: "0x1", symbol: "BTC", name: "Bitcoin", logoURI: "/crypto-btc.png" },
      balance: "0.25",
      balanceUSD: 10800,
    },
    {
      token: { address: "0x2", symbol: "ETH", name: "Ethereum", logoURI: "/crypto-eth.png" },
      balance: "2.5",
      balanceUSD: 6625,
    },
    {
      token: { address: "0x3", symbol: "OKB", name: "OKB Token", logoURI: "/okb-token.png" },
      balance: "150",
      balanceUSD: 7875,
    },
  ]

  const balances = portfolio?.balances || mockBalances

  if (isLoading) {
    return (
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold gradient-text">Token Balances</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="w-12 h-12 rounded-full bg-gray-600" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-20 bg-gray-600" />
                <Skeleton className="h-3 w-16 bg-gray-700" />
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-4 w-16 bg-gray-600" />
                <Skeleton className="h-3 w-12 bg-gray-700" />
              </div>
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
          <div className="p-2 rounded-xl bg-gradient-to-r from-green-500/20 to-blue-500/20">
            <Wallet className="w-6 h-6 text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold gradient-text">Token Balances</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {balances.map((balance, index) => (
          <motion.div
            key={balance.token.address}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-4 group hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  {balance.token.symbol.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-white">{balance.token.symbol}</div>
                  <div className="text-sm text-gray-400">{balance.token.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white">{Number.parseFloat(balance.balance).toFixed(4)}</div>
                <div className="text-sm text-gray-400">${balance.balanceUSD.toFixed(2)}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
