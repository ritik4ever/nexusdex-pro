"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sprout, Zap, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Farm {
  id: string
  name: string
  pair: string
  apy: number
  tvl: number
  rewards: string[]
  userStaked: number
  userRewards: number
  isActive: boolean
  lockPeriod?: number
}

export function YieldFarming() {
  const [farms] = useState<Farm[]>([
    {
      id: "1",
      name: "OKB-USDT LP",
      pair: "OKB/USDT",
      apy: 145.6,
      tvl: 2340000,
      rewards: ["OKB", "FARM"],
      userStaked: 1250.5,
      userRewards: 45.67,
      isActive: true,
    },
    {
      id: "2",
      name: "ETH-USDC LP",
      pair: "ETH/USDC",
      apy: 89.3,
      tvl: 5670000,
      rewards: ["ETH", "FARM"],
      userStaked: 890.25,
      userRewards: 23.45,
      isActive: true,
    },
    {
      id: "3",
      name: "BTC-ETH LP",
      pair: "BTC/ETH",
      apy: 67.8,
      tvl: 8900000,
      rewards: ["BTC", "ETH"],
      userStaked: 0,
      userRewards: 0,
      isActive: false,
      lockPeriod: 30,
    },
  ])

  const totalStaked = farms.reduce((sum, farm) => sum + farm.userStaked, 0)
  const totalRewards = farms.reduce((sum, farm) => sum + farm.userRewards, 0)

  return (
    <Card className="premium-glass border-premium shadow-premium">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20">
              <Sprout className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <CardTitle className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Yield Farming
              </CardTitle>
              <div className="text-xs text-gray-400 mt-1">Earn rewards by providing liquidity</div>
            </div>
          </div>
          <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-500">
            Active Farms: {farms.filter((f) => f.isActive).length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <div className="text-sm text-gray-400 mb-1">Total Staked</div>
            <div className="text-2xl font-bold text-green-400">${totalStaked.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
            <div className="text-sm text-gray-400 mb-1">Pending Rewards</div>
            <div className="text-2xl font-bold text-yellow-400">${totalRewards.toFixed(2)}</div>
          </div>
        </div>

        {/* Farm List */}
        <div className="space-y-4">
          {farms.map((farm, index) => (
            <motion.div
              key={farm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <Sprout className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{farm.name}</span>
                      {farm.apy > 100 && (
                        <Badge
                          variant="destructive"
                          className="text-xs px-1.5 py-0.5 bg-gradient-to-r from-orange-500 to-red-500"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          High APY
                        </Badge>
                      )}
                      {farm.lockPeriod && (
                        <Badge variant="outline" className="text-xs border-yellow-500/30 text-yellow-400">
                          <Lock className="w-3 h-3 mr-1" />
                          {farm.lockPeriod}d
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">
                      TVL: ${(farm.tvl / 1000000).toFixed(1)}M • Rewards: {farm.rewards.join(", ")}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">{farm.apy.toFixed(1)}%</div>
                  <div className="text-xs text-gray-400">APY</div>
                </div>
              </div>

              {farm.userStaked > 0 && (
                <div className="space-y-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Your Stake</span>
                    <span className="text-white font-medium">${farm.userStaked.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Pending Rewards</span>
                    <span className="text-green-400 font-medium">${farm.userRewards.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500">
                      Harvest
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Unstake
                    </Button>
                  </div>
                </div>
              )}

              {farm.userStaked === 0 && (
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500">
                    Stake LP Tokens
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Get LP Tokens
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
