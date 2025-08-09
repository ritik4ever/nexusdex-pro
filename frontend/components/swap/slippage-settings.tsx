"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTradingStore } from "@/lib/stores/trading-store"

const presetSlippages = [0.1, 0.5, 1.0, 3.0]

export function SlippageSettings() {
  const { slippage, setSlippage } = useTradingStore()

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3"
    >
      <Label className="text-sm font-medium">Slippage Tolerance</Label>

      <div className="flex items-center space-x-2">
        {presetSlippages.map((preset) => (
          <Button
            key={preset}
            variant={slippage === preset ? "default" : "outline"}
            size="sm"
            onClick={() => setSlippage(preset)}
            className="text-xs"
          >
            {preset}%
          </Button>
        ))}

        <div className="flex items-center space-x-1">
          <Input
            type="number"
            value={slippage}
            onChange={(e) => setSlippage(Number.parseFloat(e.target.value) || 0)}
            className="w-16 h-8 text-xs"
            min="0"
            max="50"
            step="0.1"
          />
          <span className="text-xs text-gray-500">%</span>
        </div>
      </div>

      {slippage > 5 && (
        <div className="text-xs text-amber-600 dark:text-amber-400">
          ⚠️ High slippage tolerance may result in unfavorable trades
        </div>
      )}
    </motion.div>
  )
}
