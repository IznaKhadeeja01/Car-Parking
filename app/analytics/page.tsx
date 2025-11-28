"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Menu, Calendar } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const occupancyData = [
  { time: "08:00", occupancy: 45, available: 105 },
  { time: "09:00", occupancy: 65, available: 85 },
  { time: "10:00", occupancy: 72, available: 78 },
  { time: "11:00", occupancy: 78, available: 72 },
  { time: "12:00", occupancy: 88, available: 62 },
  { time: "13:00", occupancy: 92, available: 58 },
  { time: "14:00", occupancy: 85, available: 65 },
  { time: "15:00", occupancy: 75, available: 75 },
  { time: "16:00", occupancy: 68, available: 82 },
  { time: "17:00", occupancy: 55, available: 95 },
]

const revenueData = [
  { date: "Mon", revenue: 1200 },
  { date: "Tue", revenue: 1900 },
  { date: "Wed", revenue: 1600 },
  { date: "Thu", revenue: 1800 },
  { date: "Fri", revenue: 2200 },
  { date: "Sat", revenue: 1800 },
  { date: "Sun", revenue: 1400 },
]

const spotTypeData = [
  { name: "Standard", value: 80, color: "#3b82f6" },
  { name: "Handicap", value: 15, color: "#10b981" },
  { name: "Compact", value: 30, color: "#f59e0b" },
  { name: "EV Charging", value: 25, color: "#8b5cf6" },
]

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-foreground hover:text-accent transition"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-bold text-primary">Analytics</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-border transition">
            <Calendar size={20} />
            This Week
          </button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Occupancy Over Time */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Occupancy Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                  <XAxis dataKey="time" stroke="currentColor" opacity={0.5} />
                  <YAxis stroke="currentColor" opacity={0.5} />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1f2e", border: "1px solid #2d3748" }} />
                  <Legend />
                  <Line type="monotone" dataKey="occupancy" stroke="#3b82f6" strokeWidth={2} name="Occupied Spots" />
                  <Line type="monotone" dataKey="available" stroke="#10b981" strokeWidth={2} name="Available Spots" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Daily Revenue</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                    <XAxis dataKey="date" stroke="currentColor" opacity={0.5} />
                    <YAxis stroke="currentColor" opacity={0.5} />
                    <Tooltip contentStyle={{ backgroundColor: "#1a1f2e", border: "1px solid #2d3748" }} />
                    <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Spot Type Distribution */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Parking Spot Types</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={spotTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {spotTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#1a1f2e", border: "1px solid #2d3748" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Sessions", value: "1,247", change: "+12%" },
                { label: "Avg Duration", value: "3.2h", change: "+5%" },
                { label: "Peak Hour", value: "13:00", change: "Same" },
                { label: "Occupancy %", value: "73%", change: "+8%" },
              ].map((metric, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-sm mb-1">{metric.label}</p>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-xs text-chart-2 mt-1">{metric.change}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
