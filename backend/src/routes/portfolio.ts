import { Router } from 'express'
import {
    getTokenBalances,
    getTransactionHistory,
    getPortfolioSummary,
} from '../controllers/portfolioController'

const router = Router()

router.get('/balances', getTokenBalances)
router.get('/transactions', getTransactionHistory)
router.get('/summary', getPortfolioSummary)

export default router