"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/swap", label: "Swap" },
  { href: "/portfolio", label: "Portfolio" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={cn(
              "relative px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "text-blue-500 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
            )}
          >
            {item.label}
            {pathname === item.href && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-lg"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.div>
        </Link>
      ))}
    </nav>
  )
}
