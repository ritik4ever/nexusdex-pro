import { useQuery } from "@tanstack/react-query"

export interface QuoteResponse {
  amountOut: string
  priceImpact: number
  route: string[]
  gasEstimate: string
}

export function useMockQuote(tokenIn?: string, tokenOut?: string, amountIn?: string) {
  return useQuery({
    queryKey: ["mock-quote", tokenIn, tokenOut, amountIn],
    queryFn: (): Promise<QuoteResponse> => {
      const amount = Number.parseFloat(amountIn || "0")
      return Promise.resolve({
        amountOut: (amount * 0.998).toFixed(6), // Simulate 0.2% slippage
        priceImpact: Math.random() * 2, // Random price impact 0-2%
        route: [tokenIn || "", tokenOut || ""],
        gasEstimate: "0.002",
      })
    },
    enabled: !!(tokenIn && tokenOut && amountIn && Number.parseFloat(amountIn) > 0),
    refetchInterval: 10000,
  })
}
