import { NextResponse } from 'next/server';

export async function GET() {
  // In a real application, you would fetch from an API like Alpha Vantage, Yahoo Finance, etc.
  // Example: 
  // const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`)
  // const data = await res.json()

  const mockData = [
    { symbol: "AAPL", price: 175.43, change: 1.25, changePercent: 0.72 },
    { symbol: "MSFT", price: 338.11, change: -2.14, changePercent: -0.63 },
    { symbol: "TSLA", price: 238.45, change: 5.67, changePercent: 2.43 },
    { symbol: "NVDA", price: 460.18, change: 12.34, changePercent: 2.75 },
    { symbol: "AMZN", price: 138.23, change: 0.45, changePercent: 0.32 },
    { symbol: "GOOGL", price: 136.38, change: -1.02, changePercent: -0.74 },
    { symbol: "META", price: 312.44, change: 4.56, changePercent: 1.48 },
    { symbol: "BTC-USD", price: 68432.10, change: 2750.50, changePercent: 4.12 },
    { symbol: "ETH-USD", price: 3412.80, change: 120.40, changePercent: 3.55 },
    { symbol: "NIFTY 50", price: 19811.50, change: 89.20, changePercent: 0.45 },
  ];

  // Add some slight randomization to simulate live data changing
  const randomizedMockData = mockData.map(stock => ({
    ...stock,
    price: stock.price + (Math.random() * 2 - 1),
    change: stock.change + (Math.random() * 0.5 - 0.25),
  }));

  return NextResponse.json(randomizedMockData, {
    headers: {
      'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30',
    },
  });
}
