"use client"

import { useState, useEffect } from "react"

interface ParkingSpot {
  id: number
  number: string
  status: "available" | "occupied" | "reserved" | "maintenance"
  type: "standard" | "handicap" | "compact" | "ev_charging"
}

function ChevronLeftIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRightIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export function ParkingGrid() {
  const [floor, setFloor] = useState(1)
  const [spots, setSpots] = useState<ParkingSpot[]>([])

  useEffect(() => {
    // Generate mock parking spots
    const mockSpots: ParkingSpot[] = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      number: `${floor}${String(i + 1).padStart(2, "0")}`,
      status: ["available", "occupied", "reserved", "maintenance"][Math.floor(Math.random() * 4)] as any,
      type: ["standard", "handicap", "compact", "ev_charging"][Math.floor(Math.random() * 4)] as any,
    }))
    setSpots(mockSpots)
  }, [floor])

  const handleSpotClick = (spot: ParkingSpot) => {
    if (spot.status === "available") {
      alert(`Reserved spot ${spot.number}!`)
    }
  }

  const getSpotColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-chart-2 hover:bg-opacity-80 cursor-pointer"
      case "occupied":
        return "bg-destructive"
      case "reserved":
        return "bg-chart-1"
      case "maintenance":
        return "bg-muted"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Parking Spots - Floor {floor}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFloor(Math.max(1, floor - 1))}
            className="p-2 hover:bg-border rounded transition"
            disabled={floor === 1}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button onClick={() => setFloor(floor + 1)} className="p-2 hover:bg-border rounded transition">
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 mb-6">
        {spots.map((spot) => (
          <button
            key={spot.id}
            onClick={() => handleSpotClick(spot)}
            className={`aspect-square rounded-lg font-bold text-sm transition-all ${getSpotColor(spot.status)}`}
            title={`${spot.number} - ${spot.status}`}
          >
            {spot.number}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-chart-2 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-destructive rounded"></div>
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-chart-1 rounded"></div>
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-muted rounded"></div>
          <span>Maintenance</span>
        </div>
      </div>
    </div>
  )
}
