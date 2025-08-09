"use client"

import { motion } from "framer-motion"

export function PoweredByFooter() {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 py-8 border-t border-white/10"
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Powered by</span>
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">O</span>
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">OKX</span>
                            </div>
                            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">X</span>
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">X Layer</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-gray-400">Built on X Layer blockchain • Real-time data from OKX API</div>
                </div>
            </div>
        </motion.footer>
    )
}
