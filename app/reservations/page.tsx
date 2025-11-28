"use client"

import type React from "react"

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

function PlusIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function XIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export default function ReservationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showNewReservation, setShowNewReservation] = useState(false)
  const [formData, setFormData] = useState({ user_id: "", parking_spot_id: "", check_in: "", check_out: "" })
  const [loading, setLoading] = useState(false)

  const { data: reservations, mutate } = useSWR("/api/reservations", fetcher, { fallbackData: [] })
  const { data: users } = useSWR("/api/users", fetcher, { fallbackData: [] })
  const { data: spots } = useSWR("/api/parking-spots?status=available", fetcher, { fallbackData: [] })

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: Number.parseInt(formData.user_id),
          parking_spot_id: Number.parseInt(formData.parking_spot_id),
          facility_id: 1,
          check_in: formData.check_in,
          check_out: formData.check_out,
        }),
      })
      if (response.ok) {
        mutate()
        setFormData({ user_id: "", parking_spot_id: "", check_in: "", check_out: "" })
        setShowNewReservation(false)
      }
    } catch (error) {
      console.error("Failed to create reservation:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelReservation = async (reservationId: number) => {
    try {
      const response = await fetch("/api/reservations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reservationId, status: "cancelled" }),
      })
      if (response.ok) {
        mutate()
      }
    } catch (error) {
      console.error("Failed to cancel reservation:", error)
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
          <h1 className="text-2xl font-bold text-primary">Reservations</h1>
          <button
            onClick={() => setShowNewReservation(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition"
          >
            <PlusIcon className="w-5 h-5" />
            New Reservation
          </button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-background border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Spot</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Check-in</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Check-out</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Duration</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Cost</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(reservations) &&
                    reservations.map((reservation: any) => (
                      <tr key={reservation.id} className="border-b border-border hover:bg-background transition">
                        <td className="px-6 py-4 text-foreground">{reservation.full_name}</td>
                        <td className="px-6 py-4 text-foreground font-medium">{reservation.spot_number}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(reservation.check_in).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(reservation.check_out).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-foreground">{reservation.duration_hours} hrs</td>
                        <td className="px-6 py-4 text-foreground font-medium">${reservation.cost}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              reservation.status === "active"
                                ? "bg-chart-2/20 text-chart-2"
                                : "bg-destructive/20 text-destructive"
                            }`}
                          >
                            {reservation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {reservation.status === "active" && (
                            <button
                              onClick={() => handleCancelReservation(reservation.id)}
                              className="text-destructive hover:text-opacity-80 transition"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* New Reservation Modal */}
      {showNewReservation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">New Reservation</h2>
              <button
                onClick={() => setShowNewReservation(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateReservation} className="space-y-4">
              <select
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select User</option>
                {Array.isArray(users) &&
                  users.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user.full_name}
                    </option>
                  ))}
              </select>

              <select
                value={formData.parking_spot_id}
                onChange={(e) => setFormData({ ...formData, parking_spot_id: e.target.value })}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Parking Spot</option>
                {Array.isArray(spots) &&
                  spots.map((spot: any) => (
                    <option key={spot.id} value={spot.id}>
                      {spot.spot_number}
                    </option>
                  ))}
              </select>

              <input
                type="datetime-local"
                value={formData.check_in}
                onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <input
                type="datetime-local"
                value={formData.check_out}
                onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewReservation(false)}
                  className="flex-1 px-4 py-2 bg-border text-foreground rounded-lg hover:bg-border/50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
