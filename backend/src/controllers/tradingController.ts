import { Request, Response } from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import okxDexService from '../services/okxDexService'
import web3Service from '../services/web3Service'
import Joi from 'joi'

const quoteSchema = Joi.object({
    chainId: Joi.number().required(),
    fromTokenAddress: Joi.string().required(),
    toTokenAddress: Joi.string().required(),
    amount: Joi.string().required(),
    slippage: Joi.number().min(0).max(50).default(1),
})

const swapSchema = Joi.object({
    chainId: Joi.number().required(),
    fromTokenAddress: Joi.string().required(),
    toTokenAddress: Joi.string().required(),
    amount: Joi.string().required(),
    userWalletAddress: Joi.string().required(),
    slippage: Joi.number().min(0).max(50).default(1),
})

export const getSupportedChains = asyncHandler(async (req: Request, res: Response) => {
    const chains = await okxDexService.getSupportedChains()

    res.status(200).json({
        success: true,
        data: chains,
    })
})

export const getAllTokens = asyncHandler(async (req: Request, res: Response) => {
    const { chainId } = req.query

    if (!chainId) {
        return res.status(400).json({
            success: false,
            error: 'Chain ID is required',
        })
    }

    const tokens = await okxDexService.getAllTokens(Number(chainId))

    res.status(200).json({
        success: true,
        data: tokens,
    })
})

export const getQuote = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = quoteSchema.validate(req.query)

    if (error) {
        return res.status(400).json({
            success: false,
            error: error.details[0].message,
        })
    }

    const quote = await okxDexService.getQuote(value)

    res.status(200).json({
        success: true,
        data: quote,
    })
})

export const getSwapData = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = swapSchema.validate(req.body)

    if (error) {
        return res.status(400).json({
            success: false,
            error: error.details[0].message,
        })
    }

    const swapData = await okxDexService.getSwapData(value)

    res.status(200).json({
        success: true,
        data: swapData,
    })
})

export const getApproveTransaction = asyncHandler(async (req: Request, res: Response) => {
    const { chainId, tokenContractAddress, approveAmount } = req.query

    if (!chainId || !tokenContractAddress || !approveAmount) {
        return res.status(400).json({
            success: false,
            error: 'Missing required parameters',
        })
    }

    const approveData = await okxDexService.getApproveTransaction({
        chainId: Number(chainId),
        tokenContractAddress: String(tokenContractAddress),
        approveAmount: String(approveAmount),
    })

    res.status(200).json({
        success: true,
        data: approveData,
    })
})

export const simulateTransaction = asyncHandler(async (req: Request, res: Response) => {
    const { to, data, value, from, chainId } = req.body

    if (!to || !data || !from || !chainId) {
        return res.status(400).json({
            success: false,
            error: 'Missing required parameters for simulation',
        })
    }

    const result = await web3Service.simulateTransaction(to, data, value || '0', from, chainId)

    res.status(200).json({
        success: true,
        data: result,
    })
})