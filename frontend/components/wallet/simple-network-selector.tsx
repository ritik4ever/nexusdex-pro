"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const NETWORKS = [
  {
    id: 196,
    name: "X Layer",
    icon: "🔗",
    isActive: true,
  },
  {
    id: 1,
    name: "Ethereum",
    icon: "⟠",
    isActive: false,
  },
]

export function SimpleNetworkSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentNetwork, setCurrentNetwork] = useState(NETWORKS[0])
  const { toast } = useToast()

  const switchNetwork = (network: (typeof NETWORKS)[0]) => {
    setCurrentNetwork(network)
    setIsOpen(false)
    toast({
      title: "Network switched",
      description: `Switched to ${network.name}`,
    })
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-card border-white/20 hover:border-white/30 text-white bg-white/10 backdrop-blur-md"
      >
        <Globe className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">{currentNetwork.name}</span>
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
              {NETWORKS.map((network) => (
                <Button
                  key={network.id}
                  onClick={() => switchNetwork(network)}
                  variant="ghost"
                  className={`w-full justify-start glass-card border-white/10 hover:border-white/20 text-white ${
                    currentNetwork.id === network.id ? "bg-primary/20 border-primary/30" : ""
                  }`}
                >
                  <span className="mr-3 text-lg">{network.icon}</span>
                  {network.name}
                  {currentNetwork.id === network.id && (
                    <div className="ml-auto w-2 h-2 bg-green-400 rounded-full"></div>
                  )}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
