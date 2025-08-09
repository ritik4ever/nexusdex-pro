import { useQuery } from "@tanstack/react-query"
import { useChainId } from "wagmi"
import { tradingApi } from "@/lib/api"

export function useTokens() {
  const chainId = useChainId()

  return useQuery({
    queryKey: ["tokens", chainId],
    queryFn: () => tradingApi.getTokens(chainId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
