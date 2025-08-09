"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ImageIcon, TrendingUp, TrendingDown, RefreshCw, Crown, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface NFTCollection {
  name: string
  floorPrice: number
  volume24h: number
  change24h: number
  owners: number
  items: number
  logoUrl: string
  isVerified: boolean
  rank: number
}

export function NFTCollections() {
  const [collections, setCollections] = useState<NFTCollection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadNFTData = () => {
      const mockCollections: NFTCollection[] = [
        {
          name: "Bored Ape Yacht Club",
          floorPrice: 12.5 + (Math.random() - 0.5) * 2,
          volume24h: 1234.56 + (Math.random() - 0.5) * 200,
          change24h: (Math.random() - 0.5) * 20,
          owners: 5432,
          items: 10000,
          logoUrl: "/nft-bayc.png",
          isVerified: true,
          rank: 1,
        },
        {
          name: "CryptoPunks",
          floorPrice: 45.8 + (Math.random() - 0.5) * 5,
          volume24h: 2345.67 + (Math.random() - 0.5) * 300,
          change24h: (Math.random() - 0.5) * 15,
          owners: 3456,
          items: 10000,
          logoUrl: "/nft-punks.png",
          isVerified: true,
          rank: 2,
        },
        {
          name: "Azuki",
          floorPrice: 8.9 + (Math.random() - 0.5) * 1.5,
          volume24h: 567.89 + (Math.random() - 0.5) * 100,
          change24h: (Math.random() - 0.5) * 25,
          owners: 4321,
          items: 10000,
          logoUrl: "/nft-azuki.png",
          isVerified: true,
          rank: 3,
        },
        {
          name: "Pudgy Penguins",
          floorPrice: 6.2 + (Math.random() - 0.5) * 1,
          volume24h: 432.1 + (Math.random() - 0.5) * 80,
          change24h: (Math.random() - 0.5) * 18,
          owners: 3210,
          items: 8888,
          logoUrl: "/nft-penguins.png",
          isVerified: true,
          rank: 4,
        },
      ]

      setCollections(mockCollections)
      setIsLoading(false)
    }

    loadNFTData()
    const interval = setInterval(loadNFTData, 30000)

    return () => clearInterval(interval)
  }, [])

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setCollections((prev) =>
        prev.map((collection) => ({
          ...collection,
          floorPrice: collection.floorPrice + (Math.random() - 0.5) * 0.5,
          volume24h: collection.volume24h + (Math.random() - 0.5) * 50,
          change24h: (Math.random() - 0.5) * 20,
        })),
      )
      setIsLoading(false)
    }, 1000)
  }

  if (isLoading) {
    return (
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-3xl font-bold gradient-text">Top NFT Collections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-4 p-6 rounded-2xl bg-white/5">
              <div className="w-12 h-12 bg-gray-600 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-600 rounded w-3/4" />
                <div className="h-4 bg-gray-700 rounded w-1/2" />
              </div>
              <div className="space-y-2">
                <div className="h-5 bg-gray-600 rounded w-16" />
                <div className="h-4 bg-gray-700 rounded w-12" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-white/10">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20">
              <ImageIcon className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold gradient-text">Top NFT Collections</CardTitle>
              <div className="text-gray-400 mt-2 flex items-center gap-2">
                <Crown className="w-4 h-4" />
                OpenSea • Real-time floor prices
              </div>
            </div>
          </div>
          <Button
            size="sm"
            onClick={refreshData}
            variant="ghost"
            className="glass-card border-white/10 hover:border-purple-500/30 px-4 py-2"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {collections.map((collection, index) => (
          <motion.div
            key={collection.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 group hover:scale-[1.02] hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                    <ImageIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-black border border-white/20 rounded-full flex items-center justify-center text-xs font-bold text-gray-300">
                    {collection.rank}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-lg">{collection.name}</span>
                    {collection.isVerified && (
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-2 py-1">
                        <Crown className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {Math.abs(collection.change24h) > 15 && (
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-2 py-1">
                        <Zap className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <div className="text-gray-400 mt-1">
                    {collection.items.toLocaleString()} items • {collection.owners.toLocaleString()} owners
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Vol: {collection.volume24h.toFixed(1)} ETH</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-white mb-2">{collection.floorPrice.toFixed(2)} ETH</div>
                <div
                  className={`flex items-center justify-end gap-2 text-lg font-bold ${
                    collection.change24h >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {collection.change24h >= 0 ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                  {collection.change24h >= 0 ? "+" : ""}
                  {collection.change24h.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500 mt-1">${(collection.floorPrice * 2650).toFixed(0)} USD</div>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
