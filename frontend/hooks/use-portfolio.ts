import { useQuery } from "@tanstack/react-query"
import { useAccount } from "wagmi"
import { tradingApi } from "@/lib/api"

export function usePortfolio() {
  const { address, isConnected } = useAccount()

  return useQuery({
    queryKey: ["portfolio", address],
    queryFn: () => tradingApi.getPortfolioBalances(address!),
    enabled: !!(isConnected && address),
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}
