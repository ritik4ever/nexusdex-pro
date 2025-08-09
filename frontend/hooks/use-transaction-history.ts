import { useQuery } from "@tanstack/react-query"
import { useAccount } from "wagmi"
import { tradingApi } from "@/lib/api"

export function useTransactionHistory() {
  const { address, isConnected } = useAccount()

  return useQuery({
    queryKey: ["transaction-history", address],
    queryFn: () => tradingApi.getTransactionHistory(address!),
    enabled: !!(isConnected && address),
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}
