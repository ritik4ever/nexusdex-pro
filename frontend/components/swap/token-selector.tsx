"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMockTokens, type Token } from "@/hooks/use-mock-tokens"
import { Skeleton } from "@/components/ui/skeleton"

interface TokenSelectorProps {
  open: boolean
  onClose: () => void
  onSelect: (token: Token) => void
}

export function TokenSelector({ open, onClose, onSelect }: TokenSelectorProps) {
  const [search, setSearch] = useState("")
  const { data: tokens, isLoading } = useMockTokens()

  const filteredTokens = tokens?.filter(
    (token) =>
      token.symbol.toLowerCase().includes(search.toLowerCase()) ||
      token.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select a Token</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tokens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))
              : filteredTokens?.map((token) => (
                  <Button
                    key={token.address}
                    variant="ghost"
                    onClick={() => onSelect(token)}
                    className="w-full justify-start p-3 h-auto"
                  >
                    <div className="flex items-center space-x-3">
                      {token.logoURI ? (
                        <img
                          src={token.logoURI || "/placeholder.svg"}
                          alt={token.symbol}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                          {token.symbol.charAt(0)}
                        </div>
                      )}
                      <div className="text-left">
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-sm text-gray-500">{token.name}</div>
                      </div>
                    </div>
                  </Button>
                ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
