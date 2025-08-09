"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { EnhancedWalletModal } from "./enhanced-wallet-modal"

interface WalletState {
    isConnected: boolean
    address: string | null
    chainId: number | null
    balance: {
        OKB: number
        ETH: number
        USDT: number
    }
}

export function EnhancedWalletConnect() {
    const [isOpen, setIsOpen] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showBalance, setShowBalance] = useState(true)
    const [wallet, setWallet] = useState<WalletState>({
        isConnected: false,
        address: null,
        chainId: null,
        balance: { OKB: 0, ETH: 0, USDT: 0 },
    })
    const [isConnecting, setIsConnecting] = useState(false)
    const { toast } = useToast()

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    const connectWallet = async (walletName: string) => {
        setIsConnecting(true)

        // Simulate wallet connection with realistic balances
        setTimeout(() => {
            let mockAddress: string
            let mockBalance: { OKB: number; ETH: number; USDT: number }

            switch (walletName) {
                case "OKX Wallet":
                    mockAddress = "0x8ba1f109551bD432803012645Hac136c22C501e5"
                    mockBalance = { OKB: 150.5, ETH: 1.75, USDT: 32.33 }
                    break
                case "MetaMask":
                    mockAddress = "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"
                    mockBalance = { OKB: 89.2, ETH: 2.1, USDT: 156.78 }
                    break
                default:
                    mockAddress = "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"
                    mockBalance = { OKB: 45.8, ETH: 0.95, USDT: 89.45 }
            }

            setWallet({
                isConnected: true,
                address: mockAddress,
                chainId: 196,
                balance: mockBalance,
            })
            setIsConnecting(false)
            setShowModal(false)
            toast({
                title: "Wallet Connected",
                description: `Connected to ${walletName} on X Layer`,
            })
        }, 2000) // Longer delay to show connecting state
    }

    const disconnectWallet = () => {
        setWallet({
            isConnected: false,
            address: null,
            chainId: null,
            balance: { OKB: 0, ETH: 0, USDT: 0 },
        })
        setIsOpen(false)
        toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected",
        })
    }

    const copyAddress = () => {
        if (wallet.address) {
            navigator.clipboard.writeText(wallet.address)
            toast({
                title: "Address copied",
                description: "Wallet address copied to clipboard",
            })
        }
    }

    if (wallet.isConnected && wallet.address) {
        return (
            <div className="relative">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className="glass-card border-white/20 hover:border-white/30 text-white bg-white/10 backdrop-blur-md"
                >
                    <Wallet className="w-4 h-4 mr-2" />
                    {formatAddress(wallet.address)}
                    <ChevronDown className="w-4 h-4 ml-2" />
                </Button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-80 glass-card border border-white/20 rounded-xl p-6 z-50"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-300">Connected to X Layer</span>
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <code className="text-sm bg-white/10 px-2 py-1 rounded flex-1">{formatAddress(wallet.address)}</code>
                                    <Button size="sm" variant="ghost" onClick={copyAddress} className="p-1 h-auto">
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => window.open(`https://www.oklink.com/xlayer/address/${wallet.address}`, "_blank")}
                                        className="p-1 h-auto"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                    </Button>
                                </div>

                                <div className="border-t border-white/10 pt-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-white">Wallet Balance</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowBalance(!showBalance)}
                                            className="p-1 h-auto"
                                        >
                                            {showBalance ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        {Object.entries(wallet.balance).map(([token, balance]) => (
                                            <div key={token} className="flex items-center justify-between text-sm">
                                                <span className="text-gray-300">{token}</span>
                                                <span className="text-white font-medium">{showBalance ? balance.toFixed(4) : "****"}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button onClick={disconnectWallet} variant="destructive" size="sm" className="w-full">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Disconnect
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }

    return (
        <div className="relative">
            <Button
                onClick={() => setShowModal(true)}
                disabled={isConnecting}
                className="glass-card border-white/20 hover:border-white/30 text-white bg-white/10 backdrop-blur-md"
            >
                <Wallet className="w-4 h-4 mr-2" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>

            <EnhancedWalletModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConnect={connectWallet}
                isConnecting={isConnecting}
            />
        </div>
    )
}

export default EnhancedWalletConnect
