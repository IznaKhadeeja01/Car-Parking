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

function TrashIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  )
}

function EditIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

export default function UsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showNewUser, setShowNewUser] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    role: "user",
    phone: "",
    vehicle_plate: "",
    password: "password",
  })
  const [loading, setLoading] = useState(false)

  const { data: users, mutate } = useSWR("/api/users", fetcher, { fallbackData: [] })

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        mutate()
        setFormData({ email: "", full_name: "", role: "user", phone: "", vehicle_plate: "", password: "password" })
        setShowNewUser(false)
      }
    } catch (error) {
      console.error("Failed to create user:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch("/api/users", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId }),
        })
        if (response.ok) {
          mutate()
        }
      } catch (error) {
        console.error("Failed to delete user:", error)
      }
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
          <h1 className="text-2xl font-bold text-primary">Users</h1>
          <button
            onClick={() => setShowNewUser(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition"
          >
            <PlusIcon className="w-5 h-5" />
            Add User
          </button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-background border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Vehicle</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(users) &&
                    users.map((user: any) => (
                      <tr key={user.id} className="border-b border-border hover:bg-background transition">
                        <td className="px-6 py-4 text-foreground font-medium">{user.full_name}</td>
                        <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.role === "admin" ? "bg-chart-1/20 text-chart-1" : "bg-chart-2/20 text-chart-2"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-foreground">{user.vehicle_plate}</td>
                        <td className="px-6 py-4 text-foreground">{user.phone}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <button className="text-accent hover:text-primary transition">
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-destructive hover:text-opacity-80 transition"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* New User Modal */}
      {showNewUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border max-w-md w-full p-6 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold text-foreground mb-4">Add New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Vehicle Plate"
                value={formData.vehicle_plate}
                onChange={(e) => setFormData({ ...formData, vehicle_plate: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewUser(false)}
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
