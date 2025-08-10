"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Eye, EyeOff } from "lucide-react"
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { EnhancedWalletModal } from "./enhanced-wallet-modal"

export function EnhancedWalletConnect() {
  const [isOpen, setIsOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showBalance, setShowBalance] = useState(true)

  // Real Wagmi hooks
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })

  const { toast } = useToast()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const connectWallet = async (walletName: string) => {
    try {
      // Find the connector based on wallet name
      let connector

      switch (walletName) {
        case "MetaMask":
          connector = connectors.find(c => c.name === "MetaMask")
          break
        case "WalletConnect":
          connector = connectors.find(c => c.name === "WalletConnect")
          break
        case "Coinbase Wallet":
          connector = connectors.find(c => c.name === "Coinbase Wallet")
          break
        case "OKX Wallet":
          // Try to connect to OKX Wallet (if available)
          if (typeof window !== "undefined" && (window as any).okxwallet) {
            // Use injected connector for OKX
            connector = connectors.find(c => c.name === "Injected")
          } else {
            toast({
              title: "OKX Wallet Not Found",
              description: "Please install OKX Wallet extension",
              variant: "destructive"
            })
            return
          }
          break
        default:
          connector = connectors[0] // Default to first available
      }

      if (connector) {
        await connect({ connector })
        setShowModal(false)
        toast({
          title: "Wallet Connected",
          description: `Connected to ${walletName}${chain ? ` on ${chain.name}` : ''}`,
        })
      } else {
        toast({
          title: "Wallet Not Available",
          description: `${walletName} is not available`,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Connection error:", error)
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${walletName}`,
        variant: "destructive"
      })
    }
  }

  const disconnectWallet = () => {
    disconnect()
    setIsOpen(false)
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  // Check if we're on the correct network
  const isCorrectNetwork = chain?.id === 196

  if (isConnected && address) {
    return (
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`glass-card border-white/20 hover:border-white/30 text-white bg-white/10 backdrop-blur-md ${!isCorrectNetwork ? 'border-red-400/50 bg-red-500/20' : ''
            }`}
        >
          <Wallet className="w-4 h-4 mr-2" />
          {formatAddress(address)}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-80 glass-card border border-white/20 rounded-xl p-6 z-50"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">
                    Connected to {chain?.name || 'Unknown Network'}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-green-400' : 'bg-red-400'}`}></div>
                </div>

                {!isCorrectNetwork && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                    <p className="text-sm text-red-300">
                      Please switch to X Layer network for full functionality
                    </p>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <code className="text-sm bg-white/10 px-2 py-1 rounded flex-1">{formatAddress(address)}</code>
                  <Button size="sm" variant="ghost" onClick={copyAddress} className="p-1 h-auto">
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(`https://www.oklink.com/xlayer/address/${address}`, "_blank")}
                    className="p-1 h-auto"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white">Wallet Balance</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBalance(!showBalance)}
                      className="p-1 h-auto"
                    >
                      {showBalance ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{chain?.nativeCurrency?.symbol || 'ETH'}</span>
                      <span className="text-white font-medium">
                        {showBalance
                          ? balance
                            ? `${parseFloat(balance.formatted).toFixed(4)}`
                            : '0.0000'
                          : '****'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <Button onClick={disconnectWallet} variant="destructive" size="sm" className="w-full">
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setShowModal(true)}
        disabled={isPending}
        className="glass-card border-white/20 hover:border-white/30 text-white bg-white/10 backdrop-blur-md"
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isPending ? "Connecting..." : "Connect Wallet"}
      </Button>

      <EnhancedWalletModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConnect={connectWallet}
        isConnecting={isPending}
      />
    </div>
  )
}

export default EnhancedWalletConnect