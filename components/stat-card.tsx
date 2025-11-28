"use client"

import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  total?: number
  icon: ReactNode
  trend?: number
  color: string
}

function TrendingUpIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 17" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

export function StatCard({ title, value, total, icon, trend, color }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <div className="text-accent-foreground">{icon}</div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-semibold text-chart-2">
            <TrendingUpIcon className="w-3 h-3" />
            {trend}%
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {total && <span className="text-xs text-muted-foreground">/ {total}</span>}
      </div>
    </div>
  )
}
