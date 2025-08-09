"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowUpDown, Settings, Zap, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { TokenSelector } from "./token-selector"
import { SlippageSettings } from "./slippage-settings"
import { useTradingStore } from "@/lib/stores/trading-store"
import { swapService, useSwapStore } from "@/lib/api/swap-service"
import { usePriceStore } from "@/lib/api/okx-price-service"
import { useAccount } from "wagmi"

export function ProductionSwapCard() {
  const [showSettings, setShowSettings] = useState(false)
  const [showFromTokenSelector, setShowFromTokenSelector] = useState(false)
  const [showToTokenSelector, setShowToTokenSelector] = useState(false)
  const [quote, setQuote] = useState<any>(null)
  const [isLoadingQuote, setIsLoadingQuote] = useState(false)

  const { toast } = useToast()
  const { isConnected, address } = useAccount()
  const { prices } = usePriceStore()
  const { isSwapping } = useSwapStore()

  const { fromToken, toToken, fromAmount, setFromAmount, setFromToken, setToToken, slippage, swapTokens } =
    useTradingStore()

  // Get quote when inputs change
  useEffect(() => {
    const getQuote = async () => {
      if (fromToken && toToken && fromAmount && Number.parseFloat(fromAmount) > 0) {
        setIsLoadingQuote(true)
        try {
          const quoteResult = await swapService.getQuote(fromToken.symbol, toToken.symbol, fromAmount)
          setQuote(quoteResult)
        } catch (error) {
          console.error("Failed to get quote:", error)
          setQuote(null)
        } finally {
          setIsLoadingQuote(false)
        }
      } else {
        setQuote(null)
      }
    }

    const debounceTimer = setTimeout(getQuote, 500)
    return () => clearTimeout(debounceTimer)
  }, [fromToken, toToken, fromAmount])

  const handleSwap = async () => {
    if (!isConnected || !address || !fromToken || !toToken || !quote) {
      toast({
        title: "Cannot Execute Swap",
        description: "Please connect wallet and ensure all fields are filled",
        variant: "destructive",
      })
      return
    }

    try {
      const transaction = await swapService.executeSwap(
        fromToken.symbol,
        toToken.symbol,
        fromAmount,
        quote.amountOut,
        address,
      )

      toast({
        title: "Swap Initiated",
        description: `Transaction hash: ${transaction.hash}`,
      })
    } catch (error) {
      toast({
        title: "Swap Failed",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }

  const getTokenPrice = (symbol: string) => {
    return prices[symbol]?.price || 0
  }

  const fromTokenPrice = fromToken ? getTokenPrice(fromToken.symbol) : 0
  const toTokenPrice = toToken ? getTokenPrice(toToken.symbol) : 0
  const fromValueUSD = Number.parseFloat(fromAmount || "0") * fromTokenPrice
  const toValueUSD = Number.parseFloat(quote?.amountOut || "0") * toTokenPrice

  return (
    <Card className="w-full max-w-md mx-auto premium-glass border-white/20">
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

        {/* From Token */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">From</span>
            {fromToken && (
              <span className="text-xs text-gray-500">
                Balance: {(Math.random() * 100).toFixed(4)} {fromToken.symbol}
              </span>
            )}
          </div>

          <div className="swap-input">
            <div className="flex items-center justify-between mb-3">
              <Input
                type="number"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="border-0 bg-transparent text-3xl font-bold p-0 focus-visible:ring-0 text-white placeholder:text-gray-600"
              />
              <Button
                variant="outline"
                onClick={() => setShowFromTokenSelector(true)}
                className="gap-2 min-w-[140px] bg-black/40 border-white/20 hover:border-cyan-500/50"
              >
                {fromToken ? (
                  <>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {fromToken.symbol.charAt(0)}
                    </div>
                    <span className="text-white">{fromToken.symbol}</span>
                  </>
                ) : (
                  <span className="text-gray-400">Select Token</span>
                )}
              </Button>
            </div>
            <div className="text-sm text-gray-500">${fromValueUSD.toFixed(2)}</div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={swapTokens}
              className="rounded-full bg-black/60 hover:bg-black/80 border border-white/20 hover:border-cyan-500/50"
            >
              <ArrowUpDown className="h-6 w-6" />
            </Button>
          </motion.div>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-400">To</span>

          <div className="swap-input">
            <div className="flex items-center justify-between mb-3">
              <div className="text-3xl font-bold text-white">
                {isLoadingQuote ? (
                  <div className="animate-pulse bg-gray-600 h-8 w-24 rounded"></div>
                ) : (
                  quote?.amountOut || "0.0"
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => setShowToTokenSelector(true)}
                className="gap-2 min-w-[140px] bg-black/40 border-white/20 hover:border-cyan-500/50"
              >
                {toToken ? (
                  <>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {toToken.symbol.charAt(0)}
                    </div>
                    <span className="text-white">{toToken.symbol}</span>
                  </>
                ) : (
                  <span className="text-gray-400">Select Token</span>
                )}
              </Button>
            </div>
            <div className="text-sm text-gray-500">${toValueUSD.toFixed(2)}</div>
          </div>
        </div>

        {/* Quote Details */}
        {quote && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="premium-glass p-4 space-y-3 text-sm border-white/10"
          >
            <div className="flex justify-between">
              <span className="text-gray-400">Exchange Rate</span>
              <span className="text-white">
                1 {fromToken?.symbol} = {quote.exchangeRate.toFixed(6)} {toToken?.symbol}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Price Impact</span>
              <span className={quote.priceImpact > 5 ? "text-red-400" : "text-green-400"}>
                {quote.priceImpact.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Gas Estimate</span>
              <span className="text-white">{quote.gasEstimate} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Slippage Tolerance</span>
              <span className="text-white">{slippage}%</span>
            </div>

            {quote.priceImpact > 10 && (
              <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-xs">High price impact warning</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={!isConnected || !fromToken || !toToken || !quote || isSwapping}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSwapping ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              Swapping...
            </div>
          ) : !isConnected ? (
            "Connect Wallet"
          ) : !fromToken || !toToken ? (
            "Select Tokens"
          ) : !fromAmount || Number.parseFloat(fromAmount) <= 0 ? (
            "Enter Amount"
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Swap Tokens
            </div>
          )}
        </Button>

        {/* Live Price Updates */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          Live prices from OKX API
        </div>
      </CardContent>

      {/* Token Selectors */}
      <TokenSelector
        open={showFromTokenSelector}
        onClose={() => setShowFromTokenSelector(false)}
        onSelect={(token) => {
          setFromToken(token)
          setShowFromTokenSelector(false)
        }}
      />

      <TokenSelector
        open={showToTokenSelector}
        onClose={() => setShowToTokenSelector(false)}
        onSelect={(token) => {
          setToToken(token)
          setShowToTokenSelector(false)
        }}
      />
    </Card>
  )
}
