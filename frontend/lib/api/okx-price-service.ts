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

class OKXPriceService {
  private intervalId: NodeJS.Timeout | null = null
  private readonly API_BASE = "https://www.okx.com/api/v5"

  async fetchPrices() {
    try {
      // Fetch ticker data from OKX API
      const symbols = ["BTC-USDT", "ETH-USDT", "OKB-USDT", "USDT-USD", "USDC-USDT"]

      const response = await fetch(`${this.API_BASE}/market/tickers?instType=SPOT`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.code === "0" && data.data) {
        // Process the data
        data.data.forEach((ticker: any) => {
          if (symbols.includes(ticker.instId)) {
            const symbol = ticker.instId.split("-")[0]
            const price = Number.parseFloat(ticker.last)
            const change24h = Number.parseFloat(ticker.open24h) - price
            const changePct24h = Number.parseFloat(ticker.changePct24h) * 100

            const livePrice: LivePrice = {
              symbol,
              price,
              change24h,
              changePct24h,
              volume24h: Number.parseFloat(ticker.volCcy24h) || 0,
              marketCap: this.calculateMarketCap(symbol, price),
              high24h: Number.parseFloat(ticker.high24h),
              low24h: Number.parseFloat(ticker.low24h),
              lastUpdate: Date.now(),
            }

            usePriceStore.getState().updatePrice(symbol, livePrice)
          }
        })

        usePriceStore.getState().setConnectionStatus(true)
      }
    } catch (error) {
      console.error("Failed to fetch OKX prices:", error)
      // Fallback to mock data if API fails
      this.generateMockPrices()
      usePriceStore.getState().setConnectionStatus(false)
    }
  }

  private calculateMarketCap(symbol: string, price: number): number {
    // Approximate market caps (in reality, you'd fetch supply data)
    const supplies: Record<string, number> = {
      BTC: 19700000,
      ETH: 120000000,
      OKB: 300000000,
      USDT: 91000000000,
      USDC: 25000000000,
    }

    return (supplies[symbol] || 1000000) * price
  }

  private generateMockPrices() {
    const mockData = [
      { symbol: "BTC", basePrice: 43250, volatility: 0.002 },
      { symbol: "ETH", basePrice: 2650, volatility: 0.003 },
      { symbol: "OKB", basePrice: 52.45, volatility: 0.005 },
      { symbol: "USDT", basePrice: 1.0, volatility: 0.001 },
      { symbol: "USDC", basePrice: 1.0, volatility: 0.001 },
    ]

    mockData.forEach(({ symbol, basePrice, volatility }) => {
      const change = (Math.random() - 0.5) * volatility
      const price = basePrice * (1 + change)
      const change24h = (Math.random() - 0.5) * 0.1 * basePrice
      const changePct24h = (change24h / basePrice) * 100

      const livePrice: LivePrice = {
        symbol,
        price,
        change24h,
        changePct24h,
        volume24h: Math.random() * 1000000000,
        marketCap: this.calculateMarketCap(symbol, price),
        high24h: price * (1 + Math.random() * 0.05),
        low24h: price * (1 - Math.random() * 0.05),
        lastUpdate: Date.now(),
      }

      usePriceStore.getState().updatePrice(symbol, livePrice)
    })
  }

  connect() {
    // Initial fetch
    this.fetchPrices()

    // Set up interval for regular updates
    this.intervalId = setInterval(() => {
      this.fetchPrices()
    }, 10000) // Update every 10 seconds
  }

  disconnect() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    usePriceStore.getState().setConnectionStatus(false)
  }
}

export const okxPriceService = new OKXPriceService()
