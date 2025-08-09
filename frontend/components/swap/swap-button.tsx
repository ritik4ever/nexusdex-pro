"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi"
import { useTradingStore } from "@/lib/stores/trading-store"
import { useToast } from "@/hooks/use-toast"
import { tradingApi } from "@/lib/api"

export function SwapButton() {
  const [isSwapping, setIsSwapping] = useState(false)
  const { isConnected, address } = useAccount()
  const { toast } = useToast()
  const { fromToken, toToken, fromAmount, slippage } = useTradingStore()

  const canSwap = isConnected && fromToken && toToken && fromAmount && Number.parseFloat(fromAmount) > 0

  const handleSwap = async () => {
    if (!canSwap || !address) return

    setIsSwapping(true)
    try {
      const result = await tradingApi.executeSwap({
        tokenIn: fromToken!.address,
        tokenOut: toToken!.address,
        amountIn: fromAmount,
        slippage,
        recipient: address,
      })

      toast({
        title: "Swap Initiated",
        description: `Transaction hash: ${result.txHash}`,
      })
    } catch (error) {
      toast({
        title: "Swap Failed",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSwapping(false)
    }
  }

  if (!isConnected) {
    return (
      <Button className="w-full" disabled>
        Connect Wallet
      </Button>
    )
  }

  return (
    <motion.div whileHover={{ scale: canSwap ? 1.02 : 1 }} whileTap={{ scale: 0.98 }}>
      <Button
        onClick={handleSwap}
        disabled={!canSwap || isSwapping}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3"
      >
        {isSwapping ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Swapping...
          </>
        ) : (
          "Swap"
        )}
      </Button>
    </motion.div>
  )
}
