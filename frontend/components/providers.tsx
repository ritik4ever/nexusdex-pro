"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit"
import { config } from "@/lib/wagmi"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { useThemeStore } from "@/lib/stores/theme-store"
import "@rainbow-me/rainbowkit/styles.css"

const queryClient = new QueryClient()

function RainbowKitThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore()

  return (
    <RainbowKitProvider theme={theme === "dark" ? darkTheme() : lightTheme()} showRecentTransactions={true}>
      {children}
    </RainbowKitProvider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitThemeProvider>
            {children}
            <Toaster />
          </RainbowKitThemeProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  )
}
