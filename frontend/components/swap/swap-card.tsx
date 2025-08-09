"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpDown, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EnhancedTokenInput } from "./enhanced-token-input"
import { SlippageSettings } from "./slippage-settings"
import { SwapButton } from "./swap-button"
import { useTradingStore } from "@/lib/stores/trading-store"
import { useMockQuote } from "@/hooks/use-mock-quote"

export function SwapCard() {
  const [showSettings, setShowSettings] = useState(false)
  const { fromToken, toToken, fromAmount, toAmount, swapTokens, setFromAmount, setToAmount, setFromToken, setToToken } =
    useTradingStore()

  const { data: quote, isLoading: quoteLoading } = useMockQuote(fromToken?.address, toToken?.address, fromAmount)

  // Mock balance for demonstration
  const mockBalance = fromToken?.symbol === "OKB" ? 150.5 : fromToken?.symbol === "ETH" ? 1.75 : 32.33

  return (
    <Card className="w-full max-w-md mx-auto glass-card border-white/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold gradient-text">Token Swap</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className="rounded-full hover:bg-white/10"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {showSettings && <SlippageSettings />}

        <div className="space-y-4">
          <EnhancedTokenInput
            label="From"
            token={fromToken}
            amount={fromAmount}
            onAmountChange={setFromAmount}
            onTokenSelect={setFromToken}
            showMaxButton={true}
            maxBalance={mockBalance}
          />

          <div className="flex justify-center">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={swapTokens}
                className="rounded-full bg-white/5 hover:bg-white/10 border border-white/20"
              >
                <ArrowUpDown className="h-6 w-6" />
              </Button>
            </motion.div>
          </div>

          <EnhancedTokenInput
            label="To"
            token={toToken}
            amount={quote?.amountOut || ""}
            onAmountChange={setToAmount}
            onTokenSelect={setToToken}
            readOnly
          />
        </div>

        {quote && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="glass-card p-4 space-y-3 text-sm"
          >
            <div className="flex justify-between">
              <span className="text-gray-400">Price Impact</span>
              <span className={quote.priceImpact > 5 ? "text-red-400" : "text-green-400"}>
                {quote.priceImpact.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Gas Estimate</span>
              <span className="text-white">{quote.gasEstimate} OKB</span>
            </div>
          </motion.div>
        )}

        <SwapButton />
      </CardContent>
    </Card>
  )
}
