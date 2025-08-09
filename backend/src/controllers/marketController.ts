import { Request, Response } from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import okxDexService from '../services/okxDexService'

export const getTokenPrices = asyncHandler(async (req: Request, res: Response) => {
    const { tokens, chainId } = req.body

    if (!tokens || !chainId) {
        return res.status(400).json({
            success: false,
            error: 'Tokens array and chainId are required',
        })
    }

    try {
        const prices = await okxDexService.getTokenPrices(tokens, chainId)

        res.status(200).json({
            success: true,
            data: prices,
        })
    } catch (error) {
        console.error('Error fetching token prices:', error)
        res.status(500).json({
            success: false,
            error: 'Failed to fetch token prices',
        })
    }
})

export const getMarketData = asyncHandler(async (req: Request, res: Response) => {
    const { symbol } = req.params

    if (!symbol) {
        return res.status(400).json({
            success: false,
            error: 'Symbol is required',
        })
    }

    // Mock market data - would integrate with real price feeds
    const marketData = {
        symbol: symbol.toUpperCase(),
        price: Math.random() * 1000,
        change24h: (Math.random() - 0.5) * 20,
        volume24h: Math.random() * 1000000,
        marketCap: Math.random() * 1000000000,
        high24h: Math.random() * 1000,
        low24h: Math.random() * 1000,
        lastUpdated: new Date().toISOString(),
    }

    res.status(200).json({
        success: true,
        data: marketData,
    })
})

export const getPriceChart = asyncHandler(async (req: Request, res: Response) => {
    const { symbol, timeframe } = req.params
    const { resolution } = req.query

    if (!symbol || !timeframe) {
        return res.status(400).json({
            success: false,
            error: 'Symbol and timeframe are required',
        })
    }

    // Mock chart data - would integrate with real price feeds
    const now = Date.now()
    const intervals = {
        '1h': 60,
        '24h': 24 * 60,
        '7d': 7 * 24 * 60,
        '30d': 30 * 24 * 60,
    }

    const interval = intervals[timeframe as keyof typeof intervals] || 60
    const dataPoints = 100
    const step = (interval * 60 * 1000) / dataPoints

    const chartData = Array.from({ length: dataPoints }, (_, i) => {
        const timestamp = now - (dataPoints - i) * step
        const basePrice = 100
        const randomVariation = (Math.random() - 0.5) * 10
        const trend = Math.sin(i * 0.1) * 5

        return {
            timestamp,
            price: basePrice + randomVariation + trend,
            volume: Math.random() * 1000000,
        }
    })

    res.status(200).json({
        success: true,
        data: chartData,
    })
})