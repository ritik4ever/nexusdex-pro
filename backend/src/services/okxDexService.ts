import axios, { AxiosInstance } from 'axios'

interface OKXDexConfig {
    apiKey: string
    apiSecret?: string
    passphrase?: string
    baseURL: string
}

class OKXDexService {
    private api: AxiosInstance
    private config: OKXDexConfig

    constructor() {
        this.config = {
            apiKey: process.env.OKX_API_KEY || '',
            apiSecret: process.env.OKX_API_SECRET || '',
            passphrase: process.env.OKX_PASSPHRASE || '',
            baseURL: 'https://www.okx.com/api/v5/dex/aggregator',
        }

        this.api = axios.create({
            baseURL: this.config.baseURL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'OK-ACCESS-KEY': this.config.apiKey,
            },
        })

        this.setupInterceptors()
    }

    private setupInterceptors() {
        this.api.interceptors.request.use(
            (config) => {
                console.log(`OKX API Request: ${config.method?.toUpperCase()} ${config.url}`)
                return config
            },
            (error) => {
                console.error('OKX API Request Error:', error)
                return Promise.reject(error)
            }
        )

        this.api.interceptors.response.use(
            (response) => {
                console.log(`OKX API Response: ${response.status} ${response.config.url}`)
                return response
            },
            (error) => {
                console.error('OKX API Response Error:', error.response?.data || error.message)
                return Promise.reject(error)
            }
        )
    }

    async getSupportedChains() {
        try {
            const response = await this.api.get('/supported/chain')
            return response.data
        } catch (error) {
            console.error('Error fetching supported chains:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            throw new Error(`Failed to fetch supported chains: ${errorMessage}`)
        }
    }

    async getAllTokens(chainId: number) {
        try {
            const response = await this.api.get('/all-tokens', {
                params: { chainId },
            })
            return response.data
        } catch (error) {
            console.error('Error fetching tokens:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            throw new Error(`Failed to fetch tokens: ${errorMessage}`)
        }
    }

    async getQuote(params: {
        chainId: number
        fromTokenAddress: string
        toTokenAddress: string
        amount: string
        slippage?: number
    }) {
        try {
            const response = await this.api.get('/quote', { params })
            return response.data
        } catch (error) {
            console.error('Error getting quote:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            throw new Error(`Failed to get quote: ${errorMessage}`)
        }
    }

    async getSwapData(params: {
        chainId: number
        fromTokenAddress: string
        toTokenAddress: string
        amount: string
        userWalletAddress: string
        slippage?: number
    }) {
        try {
            const response = await this.api.get('/swap', { params })
            return response.data
        } catch (error) {
            console.error('Error getting swap data:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            throw new Error(`Failed to get swap data: ${errorMessage}`)
        }
    }

    async getApproveTransaction(params: {
        chainId: number
        tokenContractAddress: string
        approveAmount: string
    }) {
        try {
            const response = await this.api.get('/approve-transaction', { params })
            return response.data
        } catch (error) {
            console.error('Error getting approve transaction:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            throw new Error(`Failed to get approve transaction: ${errorMessage}`)
        }
    }

    async getTokenPrices(tokens: string[], chainId: number) {
        try {
            // Use backend proxy to avoid CORS issues
            const response = await axios.get('https://www.okx.com/api/v5/market/tickers', {
                params: { instType: 'SPOT' },
                headers: {
                    'OK-ACCESS-KEY': this.config.apiKey,
                },
            })
            return response.data
        } catch (error) {
            console.error('Error fetching token prices:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            throw new Error(`Failed to fetch token prices: ${errorMessage}`)
        }
    }
}

export default new OKXDexService()