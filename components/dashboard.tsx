"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { StatCard } from "./stat-card"
import { ParkingGrid } from "./parking-grid"
import { RecentActivity } from "./recent-activity"
import { OccupancyChart } from "./occupancy-chart"

function TrendingIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 17" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

function UsersIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function Dashboard() {
  const {
    data: stats,
    error,
    isLoading,
  } = useSWR("/api/stats", fetcher, {
    refreshInterval: 5000, // Refresh every 5 seconds
    fallbackData: {
      totalSpots: 150,
      availableSpots: 45,
      occupiedSpots: 98,
      reservedSpots: 7,
      occupancyRate: 65.3,
      avgDuration: 187,
      activeUsers: 98,
      revenue: 12580.5,
    },
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (stats) {
        setStats((prev) => ({
          ...prev,
          availableSpots: Math.max(0, prev.availableSpots + (Math.random() > 0.5 ? 1 : -1)),
          occupiedSpots: Math.max(0, prev.occupiedSpots + (Math.random() > 0.5 ? -1 : 1)),
          occupancyRate: Number((65 + (Math.random() - 0.5) * 5).toFixed(1)),
        }))
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [stats])

  const [localStats, setStats] = useState(stats)

  function ParkingCircle(props: any) {
    return (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 9v6M10 13h4" />
      </svg>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
        <p className="text-muted-foreground">Real-time parking management overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Spots"
          value={localStats.availableSpots}
          total={localStats.totalSpots}
          icon={<ParkingCircle className="w-5 h-5" />}
          trend={12.5}
          color="bg-chart-2"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${localStats.occupancyRate.toFixed(1)}%`}
          icon={<TrendingIcon className="w-5 h-5" />}
          trend={5.2}
          color="bg-chart-1"
        />
        <StatCard
          title="Active Users"
          value={localStats.activeUsers}
          icon={<UsersIcon className="w-5 h-5" />}
          trend={8.1}
          color="bg-chart-3"
        />
        <StatCard
          title="Daily Revenue"
          value={`$${(localStats.revenue / 1000).toFixed(1)}k`}
          icon={<TrendingIcon className="w-5 h-5" />}
          trend={15.3}
          color="bg-chart-4"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parking Grid */}
        <div className="lg:col-span-2">
          <ParkingGrid />
        </div>

        {/* Occupancy Chart */}
        <div>
          <OccupancyChart occupancyRate={localStats.occupancyRate} />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  )
}
