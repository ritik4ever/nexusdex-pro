import { create } from "zustand"

export interface LivePrice {
  symbol: string
  price: number
  change24h: number
  changePct24h: number
  volume24h: number
  marketCap: number
  high24h: number
  low24h: number
  lastUpdate: number
}

interface PriceStore {
  prices: Record<string, LivePrice>
  isConnected: boolean
  updatePrice: (symbol: string, price: LivePrice) => void
  setConnectionStatus: (status: boolean) => void
}

export const usePriceStore = create<PriceStore>((set) => ({
  prices: {},
  isConnected: false,
  updatePrice: (symbol, price) =>
    set((state) => ({
      prices: { ...state.prices, [symbol]: price },
    })),
  setConnectionStatus: (status) => set({ isConnected: status }),
}))

class LivePriceService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect() {
    try {
      // Using a mock WebSocket simulation since we can't connect to real exchanges in this environment
      this.simulateLivePrices()
      usePriceStore.getState().setConnectionStatus(true)
    } catch (error) {
      console.error("Failed to connect to price feed:", error)
      this.handleReconnect()
    }
  }

  private simulateLivePrices() {
    const symbols = ["BTC", "ETH", "OKB", "USDT", "USDC", "BNB", "ADA", "SOL", "MATIC", "AVAX"]
    const basePrices: Record<string, number> = {
      BTC: 43250,
      ETH: 2650,
      OKB: 52.45,
      USDT: 1.0,
      USDC: 1.0,
      BNB: 315.8,
      ADA: 0.485,
      SOL: 98.75,
      MATIC: 0.89,
      AVAX: 36.2,
    }

    // Update prices every 2 seconds with realistic fluctuations
    setInterval(() => {
      symbols.forEach((symbol) => {
        const basePrice = basePrices[symbol]
        const volatility = symbol === "BTC" ? 0.002 : symbol === "ETH" ? 0.003 : 0.005
        const change = (Math.random() - 0.5) * volatility
        const newPrice = basePrice * (1 + change)

        const change24h = (Math.random() - 0.5) * 0.1 * basePrice
        const changePct24h = (change24h / basePrice) * 100

        const livePrice: LivePrice = {
          symbol,
          price: newPrice,
          change24h,
          changePct24h,
          volume24h: Math.random() * 1000000000,
          marketCap: newPrice * (Math.random() * 100000000 + 10000000),
          high24h: newPrice * (1 + Math.random() * 0.05),
          low24h: newPrice * (1 - Math.random() * 0.05),
          lastUpdate: Date.now(),
        }

        usePriceStore.getState().updatePrice(symbol, livePrice)
        basePrices[symbol] = newPrice // Update base price for next iteration
      })
    }, 2000)
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++
        this.connect()
      }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts))
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    usePriceStore.getState().setConnectionStatus(false)
  }
}

export const livePriceService = new LivePriceService()
