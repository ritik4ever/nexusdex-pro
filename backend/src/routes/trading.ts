import { Router } from 'express'
import {
    getSupportedChains,
    getAllTokens,
    getQuote,
    getSwapData,
    getApproveTransaction,
    simulateTransaction,
} from '../controllers/tradingController'

const router = Router()

router.get('/chains', getSupportedChains)
router.get('/tokens', getAllTokens)
router.get('/quote', getQuote)
router.post('/swap', getSwapData)
router.get('/approve', getApproveTransaction)
router.post('/simulate', simulateTransaction)

export default router