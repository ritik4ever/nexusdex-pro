"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

declare global {
  interface Window {
    okxwallet?: {
      bitcoin?: any
      ethereum?: {
        isOkxWallet: boolean
        request: (args: { method: string; params?: any[] }) => Promise<any>
        on: (event: string, callback: (data: any) => void) => void
        removeListener: (event: string, callback: (data: any) => void) => void
      }
    }
  }
}

interface OKXWalletConnectorProps {
  onConnect: (address: string) => void
  onDisconnect: () => void
  isConnected: boolean
}

export function OKXWalletConnector({ onConnect, onDisconnect, isConnected }: OKXWalletConnectorProps) {
  const [isOKXAvailable, setIsOKXAvailable] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if OKX Wallet is available
    const checkOKXWallet = () => {
      if (typeof window !== "undefined" && window.okxwallet?.ethereum?.isOkxWallet) {
        setIsOKXAvailable(true)
      }
    }

    checkOKXWallet()

    // Check again after a short delay in case the wallet loads asynchronously
    const timer = setTimeout(checkOKXWallet, 1000)

    return () => clearTimeout(timer)
  }, [])

  const connectOKXWallet = async () => {
    if (!window.okxwallet?.ethereum) {
      toast({
        title: "OKX Wallet not found",
        description: "Please install OKX Wallet extension",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)

    try {
      // Request account access
      const accounts = await window.okxwallet.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        // Switch to X Layer network
        try {
          await window.okxwallet.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xC4" }], // 196 in hex
          })
        } catch (switchError: any) {
          // If the chain doesn't exist, add it
          if (switchError.code === 4902) {
            await window.okxwallet.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xC4",
                  chainName: "X Layer",
                  nativeCurrency: {
                    name: "OKB",
                    symbol: "OKB",
                    decimals: 18,
                  },
                  rpcUrls: ["https://rpc.xlayer.tech"],
                  blockExplorerUrls: ["https://www.oklink.com/xlayer"],
                },
              ],
            })
          }
        }

        onConnect(accounts[0])
        toast({
          title: "OKX Wallet Connected",
          description: "Successfully connected to X Layer",
        })
      }
    } catch (error: any) {
      console.error("Failed to connect OKX Wallet:", error)
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to OKX Wallet",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectOKXWallet = () => {
    onDisconnect()
    toast({
      title: "Wallet Disconnected",
      description: "OKX Wallet has been disconnected",
    })
  }

  if (!isOKXAvailable) {
    return (
      <Button
        variant="outline"
        onClick={() => window.open("https://www.okx.com/web3", "_blank")}
        className="w-full justify-start glass-card border-white/10 hover:border-white/20 text-white"
      >
        <div className="w-6 h-6 mr-3 bg-white/20 rounded-full flex items-center justify-center text-sm">⭕</div>
        Install OKX Wallet
      </Button>
    )
  }

  return (
    <Button
      onClick={isConnected ? disconnectOKXWallet : connectOKXWallet}
      disabled={isConnecting}
      variant={isConnected ? "destructive" : "ghost"}
      className="w-full justify-start glass-card border-white/10 hover:border-white/20 text-white"
    >
      <div className="w-6 h-6 mr-3 bg-white/20 rounded-full flex items-center justify-center text-sm">⭕</div>
      {isConnecting ? "Connecting..." : isConnected ? "Disconnect OKX" : "OKX Wallet"}
    </Button>
  )
}
