import { create } from "zustand"

interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

interface TradingStore {
  fromToken: Token | null
  toToken: Token | null
  fromAmount: string
  toAmount: string
  slippage: number
  isLoading: boolean
  setFromToken: (token: Token | null) => void
  setToToken: (token: Token | null) => void
  setFromAmount: (amount: string) => void
  setToAmount: (amount: string) => void
  setSlippage: (slippage: number) => void
  setIsLoading: (loading: boolean) => void
  swapTokens: () => void
}

export const useTradingStore = create<TradingStore>((set, get) => ({
  fromToken: null,
  toToken: null,
  fromAmount: "",
  toAmount: "",
  slippage: 0.5,
  isLoading: false,
  setFromToken: (token) => set({ fromToken: token }),
  setToToken: (token) => set({ toToken: token }),
  setFromAmount: (amount) => set({ fromAmount: amount }),
  setToAmount: (amount) => set({ toAmount: amount }),
  setSlippage: (slippage) => set({ slippage }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  swapTokens: () => {
    const { fromToken, toToken } = get()
    set({
      fromToken: toToken,
      toToken: fromToken,
      fromAmount: "",
      toAmount: "",
    })
  },
}))
