"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PriceAlert {
    id: string
    symbol: string
    condition: "above" | "below"
    targetPrice: number
    currentPrice: number
    isActive: boolean
    createdAt: Date
}

export function PriceAlerts() {
    const [alerts, setAlerts] = useState<PriceAlert[]>([
        {
            id: "1",
            symbol: "BTC",
            condition: "above",
            targetPrice: 45000,
            currentPrice: 43250,
            isActive: true,
            createdAt: new Date(),
        },
        {
            id: "2",
            symbol: "ETH",
            condition: "below",
            targetPrice: 2500,
            currentPrice: 2650,
            isActive: true,
            createdAt: new Date(),
        },
    ])

    const [newAlert, setNewAlert] = useState({
        symbol: "",
        condition: "above" as const,
        targetPrice: "",
    })

    const addAlert = () => {
        if (newAlert.symbol && newAlert.targetPrice) {
            const alert: PriceAlert = {
                id: Date.now().toString(),
                symbol: newAlert.symbol,
                condition: newAlert.condition,
                targetPrice: Number.parseFloat(newAlert.targetPrice),
                currentPrice: 0, // Would be fetched from live prices
                isActive: true,
                createdAt: new Date(),
            }
            setAlerts([...alerts, alert])
            setNewAlert({ symbol: "", condition: "above", targetPrice: "" })
        }
    }

    const removeAlert = (id: string) => {
        setAlerts(alerts.filter((alert) => alert.id !== id))
    }

    return (
        <Card className="premium-glass border-premium shadow-premium">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20">
                            <Bell className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                            <CardTitle className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                Price Alerts
                            </CardTitle>
                            <div className="text-xs text-gray-400 mt-1">Get notified when prices hit your targets</div>
                        </div>
                    </div>
                    <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500">
                        {alerts.filter((a) => a.isActive).length} Active
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Add New Alert */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                    <h4 className="text-sm font-semibold text-white mb-3">Create New Alert</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <Select value={newAlert.symbol} onValueChange={(value) => setNewAlert({ ...newAlert, symbol: value })}>
                            <SelectTrigger className="bg-white/10 border-white/20">
                                <SelectValue placeholder="Token" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BTC">BTC</SelectItem>
                                <SelectItem value="ETH">ETH</SelectItem>
                                <SelectItem value="OKB">OKB</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={newAlert.condition}
                            onValueChange={(value: "above" | "below") => setNewAlert({ ...newAlert, condition: value })}
                        >
                            <SelectTrigger className="bg-white/10 border-white/20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="above">Above</SelectItem>
                                <SelectItem value="below">Below</SelectItem>
                            </SelectContent>
                        </Select>

                        <Input
                            type="number"
                            placeholder="Target Price"
                            value={newAlert.targetPrice}
                            onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                            className="bg-white/10 border-white/20"
                        />

                        <Button onClick={addAlert} className="bg-gradient-to-r from-blue-500 to-purple-500">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Alert
                        </Button>
                    </div>
                </div>

                {/* Active Alerts */}
                <div className="space-y-3">
                    {alerts.map((alert, index) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                                    {alert.condition === "above" ? (
                                        <TrendingUp className="w-5 h-5 text-white" />
                                    ) : (
                                        <TrendingDown className="w-5 h-5 text-white" />
                                    )}
                                </div>
                                <div>
                                    <div className="font-semibold text-white">
                                        {alert.symbol} {alert.condition} ${alert.targetPrice.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-400">Current: ${alert.currentPrice.toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={alert.isActive ? "default" : "secondary"}>
                                    {alert.isActive ? "Active" : "Inactive"}
                                </Badge>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeAlert(alert.id)}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
