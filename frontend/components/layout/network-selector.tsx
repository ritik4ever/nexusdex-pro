"use client"

import { ChevronDown, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAccount, useChainId, useSwitchChain } from "wagmi"

export function NetworkSelector() {
  const chainId = useChainId()
  const { isConnected } = useAccount()
  const { switchChain } = useSwitchChain()

  const networks = [{ id: 196, name: "X Layer", icon: "🔗" }]

  const currentNetwork = networks.find((n) => n.id === chainId)

  if (!isConnected) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Wifi className="h-4 w-4" />
          <span className="hidden sm:inline">{currentNetwork?.name || "Unknown"}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {networks.map((network) => (
          <DropdownMenuItem key={network.id} onClick={() => switchChain({ chainId: network.id })} className="gap-2">
            <span>{network.icon}</span>
            {network.name}
            {chainId === network.id && <span className="ml-auto text-green-500">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
