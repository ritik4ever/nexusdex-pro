"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TokenSelector } from "./token-selector"
import type { Token } from "@/hooks/use-mock-tokens"

interface TokenInputProps {
  label: string
  token: Token | null
  amount: string
  onAmountChange: (amount: string) => void
  onTokenSelect: (token: Token) => void
  readOnly?: boolean
}

export function TokenInput({ label, token, amount, onAmountChange, onTokenSelect, readOnly = false }: TokenInputProps) {
  const [showTokenSelector, setShowTokenSelector] = useState(false)

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</Label>
      <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="flex-1">
          <Input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="border-0 bg-transparent text-2xl font-semibold p-0 focus-visible:ring-0"
            readOnly={readOnly}
          />
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            ${(Number.parseFloat(amount || "0") * 1.0).toFixed(2)}
          </div>
        </div>
        <Button variant="outline" onClick={() => setShowTokenSelector(true)} className="gap-2 min-w-[120px]">
          {token ? (
            <>
              {token.logoURI && (
                <img src={token.logoURI || "/placeholder.svg"} alt={token.symbol} className="w-5 h-5 rounded-full" />
              )}
              <span>{token.symbol}</span>
            </>
          ) : (
            <span>Select Token</span>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <TokenSelector
        open={showTokenSelector}
        onClose={() => setShowTokenSelector(false)}
        onSelect={(token) => {
          onTokenSelect(token)
          setShowTokenSelector(false)
        }}
      />
    </div>
  )
}
