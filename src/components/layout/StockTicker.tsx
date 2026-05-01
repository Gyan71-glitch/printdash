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
          setStocks(data)
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
    <div className="w-full overflow-hidden bg-[#001D3D] text-white border-y border-[#003566] py-1 md:py-1.5 flex items-center text-[11px] md:text-[12px] font-sans font-bold select-none uppercase tracking-tighter relative z-10">
      <div className="max-w-[1600px] mx-auto w-full flex items-center px-4 md:px-8">
        <div className="bg-[#003566] px-3 md:px-4 py-1 z-20 flex items-center gap-1.5 md:gap-2 border-r border-[#001D3D] flex-shrink-0 min-w-[90px] md:min-w-[120px] justify-center mr-3 md:mr-4">
          <span className="text-yellow-400">MARKET</span>
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
              <div key={`${stock.symbol}-${i}`} className="flex items-center mx-4 md:mx-6 gap-2 md:gap-3">
                <span className="text-white text-[10px] md:text-[12px]">{stock.symbol}</span>
                <span className="text-zinc-100 font-mono text-[10px] md:text-[12px]">{stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className={cn(
                  "flex items-center text-[9px] md:text-[11px]",
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
    </div>
  )
}
