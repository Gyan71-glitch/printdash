"use client"

import React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface AdBannerProps {
  type: "leaderboard" | "sidebar" | "in-feed"
  className?: string
}

// Educollege Leaderboard Banner
function EducollegeBanner() {
  return (
    <div
      className="w-full h-full relative overflow-hidden cursor-pointer"
      style={{ background: "linear-gradient(110deg, #f4f0ff 0%, #ede5ff 45%, #6d28d9 45%, #4c1d95 100%)" }}
    >
      {/* Warm sunset glow on purple side */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[55%]"
        style={{ background: "radial-gradient(ellipse at 85% 50%, rgba(251,191,36,0.35) 0%, transparent 65%)" }}
      />

      {/* Diagonal separator line */}
      <div
        className="absolute top-0 bottom-0 w-1"
        style={{ left: "45%", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)", transform: "skewX(-3deg)" }}
      />

      {/* Dot grid decoration — sits at the center-right of the light side */}
      <div className="absolute grid grid-cols-3 gap-[5px] opacity-25" style={{ top: "20%", left: "32%" }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="w-[3px] h-[3px] rounded-full bg-purple-600" />
        ))}
      </div>

      {/* Arrow */}
      <div className="absolute opacity-75" style={{ top: "22%", left: "38%" }}>
        <svg width="28" height="28" viewBox="0 0 30 30" fill="none">
          <path d="M4 26 L26 4" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 4 L26 4 L26 16" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* LEFT CONTENT — lavender side */}
      <div className="absolute inset-y-0 left-0 w-[45%] flex flex-col justify-center px-4 md:px-7 gap-1">
        {/* Logo row */}
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-purple-700 flex items-center justify-center flex-shrink-0">
            <div className="w-[6px] h-[6px] border border-white rounded-full" />
          </div>
          <span className="text-purple-800 font-bold text-[11px] md:text-sm tracking-wider">educollege</span>
        </div>

        {/* Headline */}
        <div className="leading-tight">
          <p className="text-gray-800 font-semibold text-[11px] md:text-base leading-tight">Your Career Starts with</p>
          <p className="text-gray-800 font-semibold text-[11px] md:text-base leading-tight">
            the <span className="text-purple-700 font-black text-[13px] md:text-lg">Right Guidance</span>
          </p>
        </div>

        {/* Trust badge */}
        <div className="flex items-center gap-1.5 bg-white/80 rounded-full px-2 py-1 w-fit shadow-sm mt-0.5">
          <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-gray-700 text-[8px] md:text-[10px] font-medium whitespace-nowrap">Trusted Academic Guidance for Students &amp; Professionals</span>
        </div>
      </div>

      {/* RIGHT CONTENT — purple side with graduate icon */}
      <div className="absolute inset-y-0 right-0 w-[55%] flex items-center justify-center">
        {/* Graduate cap SVG — scales with container */}
        <svg viewBox="0 0 120 80" className="w-[60%] max-w-[160px] h-auto opacity-90" fill="none">
          {/* Person body */}
          <ellipse cx="60" cy="72" rx="18" ry="8" fill="rgba(0,0,0,0.2)" />
          <rect x="48" y="44" width="24" height="28" rx="4" fill="#1e1b4b" />
          {/* Head */}
          <circle cx="60" cy="36" r="10" fill="#fde68a" />
          {/* Mortarboard cap */}
          <rect x="50" y="27" width="20" height="5" rx="1" fill="#1e1b4b" />
          <polygon points="60,18 75,26 60,27 45,26" fill="#1e1b4b" />
          {/* Tassel */}
          <line x1="74" y1="26" x2="74" y2="35" stroke="#fbbf24" strokeWidth="1.5" />
          <circle cx="74" cy="36" r="2" fill="#fbbf24" />
          {/* Diploma scroll */}
          <rect x="70" y="42" width="14" height="10" rx="2" fill="white" opacity="0.9" />
          <line x1="73" y1="46" x2="81" y2="46" stroke="#7c3aed" strokeWidth="1" />
          <line x1="73" y1="49" x2="79" y2="49" stroke="#7c3aed" strokeWidth="1" />
          {/* Rising arrow */}
          <path d="M20 60 Q40 30 55 20" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
          <polygon points="55,20 50,27 59,25" fill="rgba(255,255,255,0.5)" />
          {/* Globe */}
          <circle cx="22" cy="65" r="7" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" fill="none" />
          <ellipse cx="22" cy="65" rx="3" ry="7" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
          <line x1="15" y1="65" x2="29" y2="65" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          {/* Books */}
          <rect x="90" y="52" width="20" height="5" rx="1" fill="#7c3aed" opacity="0.7" />
          <rect x="91" y="47" width="18" height="5" rx="1" fill="#5b21b6" opacity="0.7" />
          <rect x="92" y="42" width="16" height="5" rx="1" fill="#4c1d95" opacity="0.7" />
        </svg>
      </div>

      {/* AdChoices */}
      <div className="absolute bottom-0.5 right-1 px-1 bg-black/10 text-[6px] text-white/60 rounded pointer-events-none z-20">
        AdChoices
      </div>
    </div>
  )
}

export function AdBanner({ type, className }: AdBannerProps) {
  const styles = {
    leaderboard: "w-full max-w-[970px] h-[90px] md:h-[130px]",
    sidebar: "w-full h-[600px] max-w-[300px]",
    "in-feed": "w-full h-[150px] md:h-[200px]"
  }

  const ads = {
    sidebar: {
      title: "Unlock Global Markets",
      subtitle: "The #1 Platform for Intelligent Trading",
      cta: "Get Started",
      color: "from-blue-900 to-indigo-900",
      textColor: "text-white"
    },
    "in-feed": {
      title: "Stream Seamlessly",
      subtitle: "The Highest Quality 8K Resolution",
      cta: "Learn More",
      color: "from-red-900 to-red-800",
      textColor: "text-white"
    }
  }

  if (type === "leaderboard") {
    return (
      <div className={cn("flex flex-col items-center justify-center my-8", className)}>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Advertisement</span>
        <div className={`${styles.leaderboard} relative overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm`}>
          <EducollegeBanner />
        </div>
      </div>
    )
  }

  const currentAd = ads[type as "sidebar" | "in-feed"]

  if (type === "in-feed") {
    return (
      <div className={cn("flex flex-col items-center justify-center my-8 w-full", className)}>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Advertisement</span>
        <div className="w-full max-w-[900px] mx-auto h-[120px] sm:h-[180px] md:h-[250px] relative overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm bg-zinc-100 dark:bg-zinc-900 cursor-pointer">
          {/* LPU Banner image placeholder - Requires user to add lpu-banner.jpg to public folder */}
          <Image 
            src="/lpu-banner.png" 
            alt="LPU Scholarship Advertisement" 
            fill 
            className="object-cover object-center"
            sizes="(max-width: 900px) 100vw, 900px"
            priority
          />
          <div className="absolute bottom-1 right-1 px-1 bg-black/40 text-[7px] text-white/80 rounded pointer-events-none z-20">
            AdChoices
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-center justify-center my-8", className)}>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Advertisement</span>
      <div
        className={`${styles[type]} bg-gradient-to-br ${currentAd.color} relative overflow-hidden group cursor-pointer border border-zinc-200 dark:border-zinc-800 shadow-sm`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 group-hover:scale-110 transition-transform duration-700" />
        <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center ${currentAd.textColor}`}>
          <h5 className="font-serif italic text-xl md:text-2xl font-black mb-2 leading-tight">
            {currentAd.title}
          </h5>
          <p className="text-xs md:text-sm mb-4 opacity-80 max-w-[200px] md:max-w-none">
            {currentAd.subtitle}
          </p>
          <button className="bg-white text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-colors">
            {currentAd.cta}
          </button>
        </div>
        <div className="absolute bottom-1 right-1 px-1 bg-black/20 text-[6px] text-white/50 rounded pointer-events-none">
          AdChoices
        </div>
      </div>
    </div>
  )
}

