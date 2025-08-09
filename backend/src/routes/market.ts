import { Router } from 'express'
import {
    getTokenPrices,
    getMarketData,
    getPriceChart,
} from '../controllers/marketController'

const router = Router()

router.post('/prices', getTokenPrices)
router.get('/data/:symbol', getMarketData)
router.get('/chart/:symbol/:timeframe', getPriceChart)

export default router