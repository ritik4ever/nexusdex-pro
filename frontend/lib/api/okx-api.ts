import axios from "axios"

const OKX_API_BASE = "https://www.okx.com/api/v5"

export interface CryptoPrice {
    instId: string
    last: string
    lastSz: string
    askPx: string
    askSz: string
    bidPx: string
    bidSz: string
    open24h: string
    high24h: string
    low24h: string
    volCcy24h: string
    vol24h: string
    sodUtc0: string
    sodUtc8: string
    ts: string
    change24h: string
    changePct24h: string
}

export interface NFTCollection {
    collectionName: string
    floorPrice: string
    volume24h: string
    change24h: string
    logoUrl?: string
}

export interface MarketData {
    symbol: string
    name: string
    price: number
    change24h: number
    changePct24h: number
    volume24h: number
    marketCap: number
    logoUrl?: string
}

class OKXApiService {
    private api = axios.create({
        baseURL: OKX_API_BASE,
        timeout: 10000,
    })

    async getCryptoPrices(symbols: string[] = ["BTC-USDT", "ETH-USDT", "OKB-USDT"]): Promise<CryptoPrice[]> {
        try {
            const response = await this.api.get("/market/tickers", {
                params: {
                    instType: "SPOT",
                    instId: symbols.join(","),
                },
            })
            return response.data.data || []
        } catch (error) {
            console.error("Failed to fetch crypto prices:", error)
            // Return mock data for demo
            return this.getMockCryptoPrices()
        }
    }

    async getTopCryptos(limit = 20): Promise<MarketData[]> {
        try {
            // Since OKX API might have CORS issues, we'll use mock data
            return this.getMockMarketData()
        } catch (error) {
            console.error("Failed to fetch top cryptos:", error)
            return this.getMockMarketData()
        }
    }

    async getNFTCollections(): Promise<NFTCollection[]> {
        // Mock NFT data since OKX NFT API requires authentication
        return [
            {
                collectionName: "Bored Ape Yacht Club",
                floorPrice: "12.5",
                volume24h: "1,234.56",
                change24h: "+5.2%",
                logoUrl: "/nft-bayc.png",
            },
            {
                collectionName: "CryptoPunks",
                floorPrice: "45.8",
                volume24h: "2,345.67",
                change24h: "-2.1%",
                logoUrl: "/nft-punks.png",
            },
            {
                collectionName: "Azuki",
                floorPrice: "8.9",
                volume24h: "567.89",
                change24h: "+12.3%",
                logoUrl: "/nft-azuki.png",
            },
        ]
    }

    private getMockCryptoPrices(): CryptoPrice[] {
        return [
            {
                instId: "BTC-USDT",
                last: "43250.50",
                lastSz: "0.1",
                askPx: "43251.00",
                askSz: "1.2",
                bidPx: "43250.00",
                bidSz: "0.8",
                open24h: "42800.00",
                high24h: "43500.00",
                low24h: "42500.00",
                volCcy24h: "125000000",
                vol24h: "2890.5",
                sodUtc0: "42900.00",
                sodUtc8: "42950.00",
                ts: Date.now().toString(),
                change24h: "450.50",
                changePct24h: "0.0105",
            },
            {
                instId: "ETH-USDT",
                last: "2650.75",
                lastSz: "0.5",
                askPx: "2651.00",
                askSz: "2.1",
                bidPx: "2650.50",
                bidSz: "1.8",
                open24h: "2620.00",
                high24h: "2680.00",
                low24h: "2610.00",
                volCcy24h: "85000000",
                vol24h: "32100.8",
                sodUtc0: "2625.00",
                sodUtc8: "2630.00",
                ts: Date.now().toString(),
                change24h: "30.75",
                changePct24h: "0.0117",
            },
            {
                instId: "OKB-USDT",
                last: "52.45",
                lastSz: "10.0",
                askPx: "52.50",
                askSz: "50.0",
                bidPx: "52.40",
                bidSz: "45.0",
                open24h: "51.80",
                high24h: "52.80",
                low24h: "51.50",
                volCcy24h: "15000000",
                vol24h: "287500.0",
                sodUtc0: "51.90",
                sodUtc8: "51.95",
                ts: Date.now().toString(),
                change24h: "0.65",
                changePct24h: "0.0125",
            },
        ]
    }

    private getMockMarketData(): MarketData[] {
        return [
            {
                symbol: "BTC",
                name: "Bitcoin",
                price: 43250.5,
                change24h: 450.5,
                changePct24h: 1.05,
                volume24h: 28905000000,
                marketCap: 847000000000,
                logoUrl: "/crypto-btc.png",
            },
            {
                symbol: "ETH",
                name: "Ethereum",
                price: 2650.75,
                change24h: 30.75,
                changePct24h: 1.17,
                volume24h: 15200000000,
                marketCap: 318000000000,
                logoUrl: "/crypto-eth.png",
            },
            {
                symbol: "OKB",
                name: "OKB Token",
                price: 52.45,
                change24h: 0.65,
                changePct24h: 1.25,
                volume24h: 287500000,
                marketCap: 3147000000,
                logoUrl: "/okb-token.png",
            },
            {
                symbol: "USDT",
                name: "Tether",
                price: 1.0,
                change24h: 0.001,
                changePct24h: 0.1,
                volume24h: 45000000000,
                marketCap: 91000000000,
                logoUrl: "/usdt-token.png",
            },
            {
                symbol: "USDC",
                name: "USD Coin",
                price: 1.0,
                change24h: -0.001,
                changePct24h: -0.1,
                volume24h: 8500000000,
                marketCap: 25000000000,
                logoUrl: "/usdc-token.png",
            },
        ]
    }
}

export const okxApi = new OKXApiService()
