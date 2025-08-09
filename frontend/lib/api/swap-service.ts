import { create } from "zustand"

export interface SwapQuote {
  amountOut: string
  priceImpact: number
  route: string[]
  gasEstimate: string
  exchangeRate: number
}

export interface SwapTransaction {
  hash: string
  status: "pending" | "success" | "failed"
  fromToken: string
  toToken: string
  fromAmount: string
  toAmount: string
  timestamp: number
}

interface SwapStore {
  quotes: Record<string, SwapQuote>
  transactions: SwapTransaction[]
  isSwapping: boolean
  addQuote: (key: string, quote: SwapQuote) => void
  addTransaction: (tx: SwapTransaction) => void
  setSwapping: (swapping: boolean) => void
}

export const useSwapStore = create<SwapStore>((set) => ({
  quotes: {},
  transactions: [],
  isSwapping: false,
  addQuote: (key, quote) =>
    set((state) => ({
      quotes: { ...state.quotes, [key]: quote },
    })),
  addTransaction: (tx) =>
    set((state) => ({
      transactions: [tx, ...state.transactions],
    })),
  setSwapping: (swapping) => set({ isSwapping: swapping }),
}))

class SwapService {
  async getQuote(fromToken: string, toToken: string, amount: string): Promise<SwapQuote> {
    try {
      // In a real app, this would call a DEX aggregator API like 1inch or 0x
      // For demo purposes, we'll simulate realistic quotes

      const fromAmount = Number.parseFloat(amount)
      if (fromAmount <= 0) {
        throw new Error("Invalid amount")
      }

      // Simulate price lookup and slippage calculation
      const exchangeRate = this.getExchangeRate(fromToken, toToken)
      const slippage = Math.random() * 0.005 + 0.001 // 0.1% to 0.6% slippage
      const priceImpact = Math.random() * 2 // 0-2% price impact

      const amountOut = (fromAmount * exchangeRate * (1 - slippage)).toFixed(6)
      const gasEstimate = (Math.random() * 0.01 + 0.005).toFixed(6) // 0.005-0.015 ETH

      const quote: SwapQuote = {
        amountOut,
        priceImpact,
        route: [fromToken, toToken],
        gasEstimate,
        exchangeRate,
      }

      return quote
    } catch (error) {
      console.error("Failed to get swap quote:", error)
      throw error
    }
  }

  private getExchangeRate(fromToken: string, toToken: string): number {
    // Mock exchange rates - in production, this would come from real price feeds
    const prices: Record<string, number> = {
      BTC: 43250,
      ETH: 2650,
      OKB: 52.45,
      USDT: 1.0,
      USDC: 1.0,
    }

    const fromPrice = prices[fromToken] || 1
    const toPrice = prices[toToken] || 1

    return fromPrice / toPrice
  }

  async executeSwap(
    fromToken: string,
    toToken: string,
    fromAmount: string,
    toAmount: string,
    userAddress: string,
  ): Promise<SwapTransaction> {
    try {
      useSwapStore.getState().setSwapping(true)

      // Simulate transaction execution
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`

      const transaction: SwapTransaction = {
        hash: txHash,
        status: "pending",
        fromToken,
        toToken,
        fromAmount,
        toAmount,
        timestamp: Date.now(),
      }

      useSwapStore.getState().addTransaction(transaction)

      // Simulate transaction confirmation after 3 seconds
      setTimeout(() => {
        const success = Math.random() > 0.1 // 90% success rate
        const updatedTx: SwapTransaction = {
          ...transaction,
          status: success ? "success" : "failed",
        }

        useSwapStore.getState().addTransaction(updatedTx)
        useSwapStore.getState().setSwapping(false)
      }, 3000)

      return transaction
    } catch (error) {
      useSwapStore.getState().setSwapping(false)
      console.error("Failed to execute swap:", error)
      throw error
    }
  }
}

export const swapService = new SwapService()
