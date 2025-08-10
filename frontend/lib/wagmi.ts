import { createConfig, http } from "wagmi"
import { mainnet, polygon } from "wagmi/chains"
import { metaMask, walletConnect, coinbaseWallet, injected } from "wagmi/connectors"

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

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

export const config = createConfig({
  chains: [xLayer, mainnet, polygon],
  connectors: [
    injected(), // For OKX Wallet and other injected wallets
    metaMask(),
    walletConnect({
      projectId: walletConnectProjectId || 'b784303c2b3f3697470757bb364829ad',
      metadata: {
        name: 'NexusDEX Pro',
        description: 'DeFi Trading Platform',
        url: 'https://nexusdx-pro-frontend.vercel.app',
        icons: ['https://nexusdx-pro-frontend.vercel.app/favicon.ico']
      }
    }),
    coinbaseWallet({
      appName: 'NexusDEX Pro',
    }),
  ],
  transports: {
    [xLayer.id]: http('https://rpc.xlayer.tech'),
    [mainnet.id]: http('https://eth.llamarpc.com'),
    [polygon.id]: http('https://polygon-rpc.com'),
  },
})