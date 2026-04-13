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
    <div className="w-full overflow-hidden bg-black text-zinc-100 dark:bg-zinc-950 border-b border-zinc-800 py-1.5 flex text-[13px] font-mono select-none">
      <motion.div
        className="flex whitespace-nowrap min-w-max items-center"
        animate={{
          x: ["0%", "-50%"]
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 35
        }}
      >
        {[...stocks, ...stocks].map((stock, i) => {
          const isPositive = stock.change >= 0;
          return (
            <div key={`${stock.symbol}-${i}`} className="flex items-center mx-6 gap-2">
              <span className="font-bold text-white drop-shadow-md">{stock.symbol}</span>
              <span className="text-zinc-300">{stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className={cn(
                "flex items-center font-bold tracking-tight",
                isPositive ? "text-emerald-500" : "text-red-500"
              )}>
                {isPositive ? <TrendingUp className="w-[14px] h-[14px] mr-1" /> : <TrendingDown className="w-[14px] h-[14px] mr-1" />}
                {Math.abs(stock.changePercent).toFixed(2)}%
              </span>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
