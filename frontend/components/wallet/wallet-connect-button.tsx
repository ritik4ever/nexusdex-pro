"use client"

import { useState } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { motion, AnimatePresence } from "framer-motion"
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function WalletConnectButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { toast } = useToast()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
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

  if (isConnected && address) {
    return (
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="glass-card border-white/20 hover:border-white/30 text-white bg-white/10 backdrop-blur-md"
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
              className="absolute right-0 mt-2 w-64 glass-card border border-white/20 rounded-xl p-4 z-50"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Connected</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>

                <div className="flex items-center space-x-2">
                  <code className="text-sm bg-white/10 px-2 py-1 rounded">{formatAddress(address)}</code>
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

                <Button
                  onClick={() => {
                    disconnect()
                    setIsOpen(false)
                  }}
                  variant="destructive"
                  size="sm"
                  className="w-full"
                >
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
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="glass-card border-white/20 hover:border-white/30 text-white bg-white/10 backdrop-blur-md"
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isPending ? "Connecting..." : "Connect Wallet"}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-64 glass-card border border-white/20 rounded-xl p-4 z-50"
          >
            <h3 className="text-lg font-semibold mb-4 text-white">Connect Wallet</h3>
            <div className="space-y-2">
              {connectors.map((connector) => (
                <Button
                  key={connector.uid}
                  onClick={() => {
                    connect({ connector })
                    setIsOpen(false)
                  }}
                  disabled={isPending}
                  variant="ghost"
                  className="w-full justify-start glass-card border-white/10 hover:border-white/20 text-white"
                >
                  <div className="w-6 h-6 mr-3 bg-white/20 rounded-full flex items-center justify-center">
                    <Wallet className="w-3 h-3" />
                  </div>
                  {connector.name}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
