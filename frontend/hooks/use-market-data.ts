import { useQuery } from "@tanstack/react-query"
import { okxApi } from "@/lib/api/okx-api"

export function useMarketData() {
  return useQuery({
    queryKey: ["market-data"],
    queryFn: () => okxApi.getTopCryptos(),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
  })
}

export function useCryptoPrices() {
  return useQuery({
    queryKey: ["crypto-prices"],
    queryFn: () => okxApi.getCryptoPrices(),
    refetchInterval: 10000, // Refetch every 10 seconds
    staleTime: 5000, // Consider data stale after 5 seconds
  })
}

export function useNFTCollections() {
  return useQuery({
    queryKey: ["nft-collections"],
    queryFn: () => okxApi.getNFTCollections(),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  })
}
