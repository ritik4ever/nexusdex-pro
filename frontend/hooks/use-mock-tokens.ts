import { useQuery } from "@tanstack/react-query"

export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

const MOCK_TOKENS: Token[] = [
  {
    address: "0x0000000000000000000000000000000000000000",
    symbol: "OKB",
    name: "OKB Token",
    decimals: 18,
    logoURI: "/okb-token.png",
  },
  {
    address: "0x1111111111111111111111111111111111111111",
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    logoURI: "/usdt-token.png",
  },
  {
    address: "0x2222222222222222222222222222222222222222",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoURI: "/usdc-token.png",
  },
  {
    address: "0x3333333333333333333333333333333333333333",
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    logoURI: "/placeholder-aemrs.png",
  },
]

export function useMockTokens() {
  return useQuery({
    queryKey: ["mock-tokens"],
    queryFn: () => Promise.resolve(MOCK_TOKENS),
    staleTime: 5 * 60 * 1000,
  })
}
