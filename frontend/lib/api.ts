import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
})

export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

export interface QuoteResponse {
  amountOut: string
  priceImpact: number
  route: string[]
  gasEstimate: string
}

export interface SwapRequest {
  tokenIn: string
  tokenOut: string
  amountIn: string
  slippage: number
  recipient: string
}

export interface Balance {
  token: Token
  balance: string
  balanceUSD: number
}

export interface PortfolioData {
  totalValue: number
  totalPnL: number
  totalPnLPercentage: number
  balances: Balance[]
}

export interface Transaction {
  hash: string
  type: "swap" | "add_liquidity" | "remove_liquidity"
  tokenIn?: Token
  tokenOut?: Token
  amountIn: string
  amountOut: string
  timestamp: number
  status: "pending" | "success" | "failed"
}

export const tradingApi = {
  getTokens: async (chainId: number): Promise<Token[]> => {
    const response = await api.get(`/trading/tokens?chainId=${chainId}`)
    return response.data
  },

  getQuote: async (tokenIn: string, tokenOut: string, amountIn: string): Promise<QuoteResponse> => {
    const response = await api.get("/trading/quote", {
      params: { tokenIn, tokenOut, amountIn },
    })
    return response.data
  },

  executeSwap: async (swapData: SwapRequest): Promise<{ txHash: string }> => {
    const response = await api.post("/trading/swap", swapData)
    return response.data
  },

  getPortfolioBalances: async (address: string): Promise<PortfolioData> => {
    const response = await api.get(`/portfolio/balances?address=${address}`)
    return response.data
  },

  getTransactionHistory: async (address: string): Promise<Transaction[]> => {
    const response = await api.get(`/portfolio/transactions?address=${address}`)
    return response.data
  },
}
