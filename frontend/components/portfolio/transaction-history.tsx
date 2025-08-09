"use client"

import { motion } from "framer-motion"
import { ExternalLink, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTransactionHistory } from "@/hooks/use-transaction-history"
import { Skeleton } from "@/components/ui/skeleton"

export function TransactionHistory() {
  const { data: transactions, isLoading } = useTransactionHistory()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/20 dark:border-gray-700/20">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions?.slice(0, 10).map((tx, index) => (
          <motion.div
            key={tx.hash}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  tx.type === "swap" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                }`}
              >
                {tx.type === "swap" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
              </div>
              <div>
                <div className="font-medium capitalize">{tx.type.replace("_", " ")}</div>
                <div className="text-sm text-gray-500">{new Date(tx.timestamp * 1000).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`px-2 py-1 rounded-full text-xs ${
                  tx.status === "success"
                    ? "bg-green-100 text-green-800"
                    : tx.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {tx.status}
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
