"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePortfolio } from "@/hooks/use-portfolio"
import { Skeleton } from "@/components/ui/skeleton"

export function TokenBalances() {
  const { data: portfolio, isLoading } = usePortfolio()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Token Balances</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
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
    <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/20 dark:border-gray-700/20">
      <CardHeader>
        <CardTitle>Token Balances</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {portfolio?.balances.map((balance, index) => (
          <motion.div
            key={balance.token.address}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
          >
            <div className="flex items-center space-x-3">
              {balance.token.logoURI ? (
                <img
                  src={balance.token.logoURI || "/placeholder.svg"}
                  alt={balance.token.symbol}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {balance.token.symbol.charAt(0)}
                </div>
              )}
              <div>
                <div className="font-medium">{balance.token.symbol}</div>
                <div className="text-sm text-gray-500">{balance.token.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">{Number.parseFloat(balance.balance).toFixed(4)}</div>
              <div className="text-sm text-gray-500">${balance.balanceUSD.toFixed(2)}</div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
