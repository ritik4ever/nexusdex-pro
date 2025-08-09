"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Sun, Moon, Menu, X, TrendingUp, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnhancedWalletConnect } from "@/components/wallet/enhanced-wallet-connect"
import { SimpleNetworkSelector } from "@/components/wallet/simple-network-selector"
import { useTheme } from "next-themes"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Markets", href: "/markets" },
    { name: "Trading", href: "/swap" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Analytics", href: "/analytics" },
  ]

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-white/10 backdrop-blur-2xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300">
                <TrendingUp className="w-7 h-7 text-black" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <Zap className="w-3 h-3 text-black" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-bold gradient-text">NexusDEX</span>
              <span className="text-sm font-bold text-yellow-400 ml-2 animate-glow">Pro</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-6 py-3 text-sm font-medium transition-all duration-300 rounded-xl ${
                  pathname === item.href
                    ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.name}
                {pathname === item.href && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-500/30"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="glass-card border-white/10 hover:border-cyan-500/30 p-3"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <SimpleNetworkSelector />
            <EnhancedWalletConnect />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden glass-card border-white/10 p-3"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 py-6"
          >
            <div className="space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-6 py-4 text-lg font-medium transition-all duration-300 rounded-xl ${
                    pathname === item.href
                      ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center space-x-4 px-6 pt-6 border-t border-white/10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="glass-card border-white/10"
                >
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
                <SimpleNetworkSelector />
              </div>
              <div className="px-6">
                <EnhancedWalletConnect />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  )
}
