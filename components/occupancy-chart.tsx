"use client"

import { useEffect, useState } from "react"

interface OccupancyChartProps {
  occupancyRate: number
}

export function OccupancyChart({ occupancyRate }: OccupancyChartProps) {
  const [displayRate, setDisplayRate] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayRate(occupancyRate)
    }, 100)
    return () => clearTimeout(timer)
  }, [occupancyRate])

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (displayRate / 100) * circumference

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-bold text-foreground mb-6">Occupancy Rate</h3>

      <div className="flex justify-center mb-6">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-border" />
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(var(--color-primary))" />
                <stop offset="100%" stopColor="rgb(var(--color-accent))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">{displayRate.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Full</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Available</span>
            <span className="font-semibold text-foreground">51 spots</span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-chart-2" style={{ width: `${100 - displayRate}%` }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Occupied</span>
            <span className="font-semibold text-foreground">98 spots</span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-destructive" style={{ width: `${displayRate}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
