"use client"

import { useState } from "react"
import { Wallet, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { EnhancedWalletModal } from "./enhanced-wallet-modal"

// Mock wallet state
interface WalletState {
  isConnected: boolean
  address: string | null
  chainId: number | null
}

export function SimpleWalletConnect() {
  const [isOpen, setIsOpen] = useState(false)
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
  })
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const connectWallet = async (walletName: string) => {
    setIsConnecting(true)

    // Simulate wallet connection with different addresses for different wallets
    setTimeout(() => {
      let mockAddress: string

      switch (walletName) {
        case "OKX Wallet":
          mockAddress = "0x8ba1f109551bD432803012645Hac136c22C501e5"
          break
        case "MetaMask":
          mockAddress = "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"
          break
        case "WalletConnect":
          mockAddress = "0x1234567890123456789012345678901234567890"
          break
        case "Coinbase Wallet":
          mockAddress = "0x9876543210987654321098765432109876543210"
          break
        default:
          mockAddress = "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"
      }

      setWallet({
        isConnected: true,
        address: mockAddress,
        chainId: 196,
      })
      setIsConnecting(false)
      setIsOpen(false)
      toast({
        title: "Wallet Connected",
        description: `Connected to ${walletName}`,
      })
    }, 1500)
  }

  const disconnectWallet = () => {
    setWallet({
      isConnected: false,
      address: null,
      chainId: null,
    })
    setIsOpen(false)
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address)
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const wallets = [
    { name: "OKX Wallet", icon: "⭕" },
    { name: "MetaMask", icon: "🦊" },
    { name: "WalletConnect", icon: "🔗" },
    { name: "Coinbase Wallet", icon: "🔵" },
  ]

  if (wallet.isConnected && wallet.address) {
    return (
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="glass-card border-white/20 hover:border-white/30 text-white bg-white/10 backdrop-blur-md"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {formatAddress(wallet.address)}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>

        <EnhancedWalletModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConnect={connectWallet}
          isConnecting={isConnecting}
        />
      </div>
    )
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isConnecting}
        className="glass-card border-white/20 hover:border-white/30 text-white bg-white/10 backdrop-blur-md"
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>

      <EnhancedWalletModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConnect={connectWallet}
        isConnecting={isConnecting}
      />
    </div>
  )
}
