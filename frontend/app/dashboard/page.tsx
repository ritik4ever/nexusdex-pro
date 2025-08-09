"use client"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { PoweredByFooter } from "@/components/layout/powered-by-footer"

export default function DashboardPage() {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    {/* Hero Section */}
                    <div className="text-center py-8">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
                        >
                            Advanced DeFi Dashboard
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl text-gray-300 max-w-2xl mx-auto"
                        >
                            Real-time market data, yield farming, and portfolio management powered by X Layer blockchain
                        </motion.p>
                    </div>

                    {/* Temporary Dashboard Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="premium-glass border-premium shadow-premium p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-white mb-4">Market Overview</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">BTC/USDT</span>
                                    <span className="text-green-400">$43,250.50</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">ETH/USDT</span>
                                    <span className="text-green-400">$2,650.75</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">OKB/USDT</span>
                                    <span className="text-green-400">$52.45</span>
                                </div>
                            </div>
                        </div>

                        <div className="premium-glass border-premium shadow-premium p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-white mb-4">Portfolio</h3>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-2">$12,547.89</div>
                                <div className="text-green-400">+$234.56 (1.91%)</div>
                            </div>
                        </div>

                        <div className="premium-glass border-premium shadow-premium p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-white mb-4">Yield Farming</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">OKB-USDT LP</span>
                                    <span className="text-yellow-400">145.6% APY</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">ETH-USDC LP</span>
                                    <span className="text-yellow-400">89.3% APY</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6"
                    >
                        <div className="premium-glass border-premium shadow-premium p-6 rounded-2xl text-center">
                            <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
                            <div className="text-sm text-gray-400">Uptime</div>
                        </div>
                        <div className="premium-glass border-premium shadow-premium p-6 rounded-2xl text-center">
                            <div className="text-3xl font-bold text-green-400 mb-2">&lt;100ms</div>
                            <div className="text-sm text-gray-400">Latency</div>
                        </div>
                        <div className="premium-glass border-premium shadow-premium p-6 rounded-2xl text-center">
                            <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                            <div className="text-sm text-gray-400">Live Data</div>
                        </div>
                        <div className="premium-glass border-premium shadow-premium p-6 rounded-2xl text-center">
                            <div className="text-3xl font-bold text-orange-400 mb-2">10+</div>
                            <div className="text-sm text-gray-400">Features</div>
                        </div>
                    </motion.div>
                </motion.div>
            </main>
            <PoweredByFooter />
        </div>
    )
}
