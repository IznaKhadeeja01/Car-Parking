"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function MenuIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function FilterIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

export default function ParkingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedFloor, setSelectedFloor] = useState("1")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [updating, setUpdating] = useState(false)

  const { data: spots, mutate } = useSWR(
    `/api/parking-spots?floor=${selectedFloor}${selectedStatus !== "all" ? `&status=${selectedStatus}` : ""}`,
    fetcher,
    { fallbackData: [] },
  )

  const handleSpotStatusChange = async (spotId: number, newStatus: string) => {
    setUpdating(true)
    try {
      const response = await fetch("/api/parking-spots", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: spotId, status: newStatus }),
      })
      if (response.ok) {
        mutate()
      }
    } catch (error) {
      console.error("Failed to update spot:", error)
    } finally {
      setUpdating(false)
    }
  }

  const getSpotColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-chart-2 hover:bg-opacity-80 cursor-pointer"
      case "occupied":
        return "bg-destructive cursor-not-allowed"
      case "reserved":
        return "bg-chart-1 cursor-not-allowed"
      case "maintenance":
        return "bg-muted cursor-not-allowed"
      default:
        return "bg-chart-2"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-foreground hover:text-accent transition"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-primary">Parking Spots</h1>
          <div />
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Filters */}
            <div className="flex items-center gap-4">
              <FilterIcon className="w-5 h-5 text-muted-foreground" />
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="px-4 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="1">Floor 1</option>
                <option value="2">Floor 2</option>
                <option value="3">Floor 3</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            {/* Parking Grid */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Floor {selectedFloor}</h3>
              <div className="grid grid-cols-12 gap-2">
                {Array.isArray(spots) &&
                  spots.map((spot: any) => (
                    <button
                      key={spot.id}
                      onClick={() =>
                        handleSpotStatusChange(spot.id, spot.status === "available" ? "occupied" : "available")
                      }
                      disabled={updating || spot.status !== "available"}
                      className={`aspect-square rounded text-xs font-bold transition ${getSpotColor(spot.status)}`}
                      title={`${spot.spot_number} - ${spot.status}`}
                    >
                      {spot.spot_number.split("-")[1]}
                    </button>
                  ))}
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Available", color: "bg-chart-2" },
                { label: "Occupied", color: "bg-destructive" },
                { label: "Reserved", color: "bg-chart-1" },
                { label: "Maintenance", color: "bg-muted" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${item.color}`} />
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
