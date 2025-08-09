import { Request, Response } from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import web3Service from '../services/web3Service'
import okxDexService from '../services/okxDexService'

export const getTokenBalances = asyncHandler(async (req: Request, res: Response) => {
    const { address, chainId } = req.query

    if (!address || !chainId) {
        return res.status(400).json({
            success: false,
            error: 'Address and chainId are required',
        })
    }

    try {
        // Get all tokens for the chain
        const tokensResponse = await okxDexService.getAllTokens(Number(chainId))
        const tokens = tokensResponse.data || []

        // Get balances for each token
        const balances = await Promise.allSettled(
            tokens.slice(0, 20).map(async (token: any) => { // Limit to first 20 tokens for performance
                try {
                    const balance = await web3Service.getTokenBalance(
                        token.tokenContractAddress,
                        String(address),
                        Number(chainId)
                    )

                    if (parseFloat(balance) > 0) {
                        return {
                            token: {
                                symbol: token.tokenSymbol,
                                name: token.tokenName,
                                address: token.tokenContractAddress,
                                decimals: token.decimals,
                                logoURI: token.tokenLogoUrl || '',
                                chainId: Number(chainId),
                            },
                            balance,
                            balanceFormatted: parseFloat(balance).toFixed(6),
                            valueUSD: 0, // Would calculate from price API
                        }
                    }
                    return null
                } catch (error) {
                    console.error(`Error getting balance for ${token.tokenSymbol}:`, error)
                    return null
                }
            })
        )

        const validBalances = balances
            .filter((result): result is PromiseFulfilledResult<any> =>
                result.status === 'fulfilled' && result.value !== null
            )
            .map(result => result.value)

        res.status(200).json({
            success: true,
            data: validBalances,
        })
    } catch (error) {
        console.error('Error fetching token balances:', error)
        res.status(500).json({
            success: false,
            error: 'Failed to fetch token balances',
        })
    }
})

export const getTransactionHistory = asyncHandler(async (req: Request, res: Response) => {
    const { address, chainId, limit } = req.query

    if (!address || !chainId) {
        return res.status(400).json({
            success: false,
            error: 'Address and chainId are required',
        })
    }

    const transactions = await web3Service.getTransactionHistory(
        String(address),
        Number(chainId),
        Number(limit) || 50
    )

    res.status(200).json({
        success: true,
        data: transactions,
    })
})

export const getPortfolioSummary = asyncHandler(async (req: Request, res: Response) => {
    const { address, chainId } = req.query

    if (!address || !chainId) {
        return res.status(400).json({
            success: false,
            error: 'Address and chainId are required',
        })
    }

    // This would aggregate portfolio data
    const summary = {
        totalValue: 0,
        totalChange24h: 0,
        activeTokens: 0,
        topPerformers: [],
        recentTransactions: [],
    }

    res.status(200).json({
        success: true,
        data: summary,
    })
})