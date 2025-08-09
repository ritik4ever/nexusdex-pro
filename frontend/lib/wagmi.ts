import { createConfig, http } from "wagmi"
import { mainnet } from "wagmi/chains"

// Define X Layer chain
export const xLayer = {
  id: 196,
  name: "X Layer",
  nativeCurrency: {
    decimals: 18,
    name: "OKB",
    symbol: "OKB",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.xlayer.tech"],
    },
  },
  blockExplorers: {
    default: { name: "X Layer Explorer", url: "https://www.oklink.com/xlayer" },
  },
} as const

export const config = createConfig({
  chains: [xLayer, mainnet],
  transports: {
    [xLayer.id]: http(),
    [mainnet.id]: http(),
  },
})
