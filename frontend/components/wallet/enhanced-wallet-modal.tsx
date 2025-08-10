"use client"

import { motion } from "framer-motion"
import { X, ExternalLink, Star, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Wallet {
  name: string
  icon: string
  description: string
  isRecommended?: boolean
  isInstalled?: boolean
  downloadUrl?: string
  checkInstalled?: () => boolean
}

interface EnhancedWalletModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (walletName: string) => void
  isConnecting: boolean
}

export function EnhancedWalletModal({ isOpen, onClose, onConnect, isConnecting }: EnhancedWalletModalProps) {
  const { toast } = useToast()

  const checkMetaMask = () => {
    return typeof window !== "undefined" && !!(window as any).ethereum?.isMetaMask
  }

  const checkOKXWallet = () => {
    return typeof window !== "undefined" && !!(window as any).okxwallet
  }

  const checkCoinbaseWallet = () => {
    return typeof window !== "undefined" && !!(window as any).ethereum?.isCoinbaseWallet
  }

  const wallets: Wallet[] = [
    {
      name: "OKX Wallet",
      icon: "⭕",
      description: "Native wallet for X Layer blockchain with seamless integration",
      isRecommended: true,
      isInstalled: checkOKXWallet(),
      downloadUrl: "https://www.okx.com/web3",
      checkInstalled: checkOKXWallet,
    },
    {
      name: "MetaMask",
      icon: "🦊",
      description: "Popular Ethereum wallet with broad DeFi support",
      isInstalled: checkMetaMask(),
      downloadUrl: "https://metamask.io/download/",
      checkInstalled: checkMetaMask,
    },
    {
      name: "WalletConnect",
      icon: "🔗",
      description: "Connect with 300+ wallets via QR code scanning",
      isInstalled: true, // WalletConnect doesn't require installation
    },
    {
      name: "Coinbase Wallet",
      icon: "🔵",
      description: "Self-custody wallet from Coinbase exchange",
      isInstalled: checkCoinbaseWallet(),
      downloadUrl: "https://www.coinbase.com/wallet",
      checkInstalled: checkCoinbaseWallet,
    },
  ]

  const handleWalletClick = async (wallet: Wallet) => {
    // Re-check installation status for dynamic wallets
    if (wallet.checkInstalled && !wallet.checkInstalled()) {
      if (wallet.downloadUrl) {
        window.open(wallet.downloadUrl, "_blank")
        toast({
          title: "Install Required",
          description: `Please install ${wallet.name} and refresh the page`,
          variant: "destructive"
        })
      }
      return
    }

    if (!wallet.isInstalled && wallet.downloadUrl) {
      window.open(wallet.downloadUrl, "_blank")
      toast({
        title: "Install Required",
        description: `Please install ${wallet.name} and refresh the page`,
        variant: "destructive"
      })
      return
    }

    // Special handling for OKX Wallet
    if (wallet.name === "OKX Wallet" && !checkOKXWallet()) {
      toast({
        title: "OKX Wallet Not Detected",
        description: "Please install OKX Wallet extension and refresh the page",
        variant: "destructive"
      })
      return
    }

    try {
      await onConnect(wallet.name)
    } catch (error) {
      console.error(`Failed to connect to ${wallet.name}:`, error)
      toast({
        title: "Connection Failed",
        description: `Could not connect to ${wallet.name}. Please try again.`,
        variant: "destructive"
      })
    }
  }

  const addXLayerToMetaMask = async () => {
    if (!(window as any).ethereum) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask first",
        variant: "destructive"
      })
      return
    }

    try {
      await (window as any).ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0xC4', // 196 in hex
          chainName: 'X Layer',
          nativeCurrency: {
            name: 'OKB',
            symbol: 'OKB',
            decimals: 18
          },
          rpcUrls: ['https://rpc.xlayer.tech'],
          blockExplorerUrls: ['https://www.oklink.com/xlayer']
        }]
      })

      toast({
        title: "Network Added",
        description: "X Layer network has been added to MetaMask",
      })
    } catch (error) {
      console.error('Failed to add X Layer network:', error)
      toast({
        title: "Failed to Add Network",
        description: "Could not add X Layer to MetaMask",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-transparent border-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-card border border-white/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <DialogTitle className="text-2xl font-bold text-white">Connect Wallet</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-3">
            {wallets.map((wallet, index) => {
              const currentlyInstalled = wallet.checkInstalled ? wallet.checkInstalled() : wallet.isInstalled

              return (
                <motion.div
                  key={wallet.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    onClick={() => handleWalletClick(wallet)}
                    disabled={isConnecting}
                    variant="ghost"
                    className={`w-full p-4 h-auto glass-card border border-white/10 hover:border-white/20 text-white ${wallet.isRecommended ? "border-primary/30 bg-primary/5" : ""
                      } ${!currentlyInstalled ? "opacity-75" : ""}`}
                  >
                    <div className="flex items-center space-x-4 w-full">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">
                          {wallet.icon}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{wallet.name}</span>
                            {wallet.isRecommended && (
                              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                                <Star className="w-3 h-3 mr-1" />
                                Recommended
                              </Badge>
                            )}
                            {!currentlyInstalled && (
                              <AlertCircle className="w-4 h-4 text-orange-400" />
                            )}
                          </div>
                          <p className="text-xs text-gray-300 mt-1">
                            {currentlyInstalled ? wallet.description : `Install ${wallet.name} to continue`}
                          </p>
                        </div>
                      </div>
                      {!currentlyInstalled && <ExternalLink className="w-4 h-4 text-gray-400" />}
                    </div>
                  </Button>
                </motion.div>
              )
            })}
          </div>

          {/* Add X Layer network helper */}
          <div className="mt-4">
            <Button
              onClick={addXLayerToMetaMask}
              variant="outline"
              size="sm"
              className="w-full text-xs glass-card border-white/10 hover:border-white/20 text-white"
            >
              Add X Layer to MetaMask
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-blue-400 text-xs">ℹ</span>
              </div>
              <div className="text-sm text-blue-200">
                <p className="font-medium mb-1">New to Web3 wallets?</p>
                <p className="text-xs text-blue-300">
                  We recommend OKX Wallet for the best experience on X Layer blockchain.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

export default EnhancedWalletModal