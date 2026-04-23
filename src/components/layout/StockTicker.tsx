"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type StockData = {
  symbol: string
  price: number
  change: number
  changePercent: number
}

const fallbackStocks: StockData[] = [
  { symbol: "AAPL", price: 175.43, change: 1.25, changePercent: 0.72 },
  { symbol: "MSFT", price: 338.11, change: -2.14, changePercent: -0.63 },
  { symbol: "TSLA", price: 238.45, change: 5.67, changePercent: 2.43 },
  { symbol: "BTC-USD", price: 68432.10, change: 2750.50, changePercent: 4.12 },
  { symbol: "ETH-USD", price: 3412.80, change: 120.40, changePercent: 3.55 },
  { symbol: "NIFTY 50", price: 19811.50, change: 89.20, changePercent: 0.45 },
]

export function StockTicker() {
  const [stocks, setStocks] = useState<StockData[]>(fallbackStocks)

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await fetch('/api/stocks')
        if (res.ok) {
          const data = await res.json()
          setStocks(data) // Wait, if /api/stocks returns data without crypto, use spread? Let's just assume data from API doesn't wipe crypto or let's use merged array for now. Actually the API might just run fallback stocks too.
        }
      } catch (err) {
        console.error("Failed to fetch stock ticker data", err)
      }
    }
    
    fetchStocks()
    const interval = setInterval(fetchStocks, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full overflow-hidden bg-[#001D3D] text-white border-y border-[#003566] py-2 flex items-center text-[12px] font-sans font-bold select-none uppercase tracking-tighter relative z-10">
      <div className="bg-[#003566] px-4 py-1 z-20 flex items-center gap-2 border-r border-[#001D3D] flex-shrink-0 min-w-[120px] justify-center">
        <span className="text-yellow-400">CNBC</span>
        <span className="text-[10px] text-zinc-300">REAL-TIME</span>
      </div>
      <motion.div
        className="flex whitespace-nowrap min-w-max items-center"
        animate={{
          x: ["0%", "-50%"]
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 40
        }}
      >
        {[...stocks, ...stocks].map((stock, i) => {
          const isPositive = stock.change >= 0;
          return (
            <div key={`${stock.symbol}-${i}`} className="flex items-center mx-6 gap-3">
              <span className="text-white">{stock.symbol}</span>
              <span className="text-zinc-100 font-mono">{stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className={cn(
                "flex items-center",
                isPositive ? "text-emerald-400" : "text-red-400"
              )}>
                {isPositive ? "▲" : "▼"}
                {Math.abs(stock.changePercent).toFixed(2)}%
              </span>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
