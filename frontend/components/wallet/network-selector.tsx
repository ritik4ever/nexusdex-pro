"use client"

import { useState } from "react"
import { useAccount, useSwitchChain } from "wagmi"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, ChevronDown, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const SUPPORTED_NETWORKS = [
  {
    id: 196,
    name: "X Layer",
    rpcUrl: "https://rpc.xlayer.tech",
    isSupported: true,
  },
]

export function NetworkSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { chain, isConnected } = useAccount()
  const { switchChain, isPending } = useSwitchChain()
  const { toast } = useToast()

  const currentNetwork = SUPPORTED_NETWORKS.find((n) => n.id === chain?.id)
  const isWrongNetwork = isConnected && !currentNetwork

  const handleNetworkSwitch = async (networkId: number) => {
    try {
      await switchChain({ chainId: networkId })
      setIsOpen(false)
      toast({
        title: "Network switched",
        description: `Successfully switched to ${SUPPORTED_NETWORKS.find((n) => n.id === networkId)?.name}`,
      })
    } catch (error) {
      toast({
        title: "Network switch failed",
        description: "Please try switching networks manually in your wallet",
        variant: "destructive",
      })
    }
  }

  if (!isConnected) {
    return null
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`glass-card border-white/20 hover:border-white/30 text-white bg-white/10 backdrop-blur-md ${
          isWrongNetwork ? "border-red-400/50 bg-red-500/20" : ""
        }`}
      >
        {isWrongNetwork ? <AlertTriangle className="w-4 h-4 mr-2 text-red-400" /> : <Globe className="w-4 h-4 mr-2" />}
        {isPending ? "Switching..." : currentNetwork?.name || "Wrong Network"}
        <ChevronDown className="w-4 h-4 ml-2" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 glass-card border border-white/20 rounded-xl p-4 z-50"
          >
            <h3 className="text-sm font-semibold mb-3 text-white">Select Network</h3>
            <div className="space-y-2">
              {SUPPORTED_NETWORKS.map((network) => (
                <Button
                  key={network.id}
                  onClick={() => handleNetworkSwitch(network.id)}
                  disabled={isPending || chain?.id === network.id}
                  variant="ghost"
                  className={`w-full justify-start glass-card border-white/10 hover:border-white/20 text-white ${
                    chain?.id === network.id ? "bg-primary/20 border-primary/30" : ""
                  }`}
                >
                  <div
                    className={`w-2 h-2 mr-3 rounded-full ${chain?.id === network.id ? "bg-green-400" : "bg-gray-400"}`}
                  ></div>
                  {network.name}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
