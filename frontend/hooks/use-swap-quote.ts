import { useQuery } from "@tanstack/react-query"
import { tradingApi } from "@/lib/api"

export function useSwapQuote(tokenIn?: string, tokenOut?: string, amountIn?: string) {
  return useQuery({
    queryKey: ["swap-quote", tokenIn, tokenOut, amountIn],
    queryFn: () => tradingApi.getQuote(tokenIn!, tokenOut!, amountIn!),
    enabled: !!(tokenIn && tokenOut && amountIn && Number.parseFloat(amountIn) > 0),
    refetchInterval: 10000, // Refetch every 10 seconds
  })
}
