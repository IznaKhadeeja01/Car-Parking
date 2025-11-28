"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Menu, Save } from "lucide-react"

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isInitializing, setIsInitializing] = useState(false)
  const [initMessage, setInitMessage] = useState("")

  const handleInitializeDB = async () => {
    setIsInitializing(true)
    setInitMessage("")
    try {
      const response = await fetch("/api/db-init", {
        method: "GET",
      })
      const data = await response.json()
      if (response.ok) {
        setInitMessage("✓ Database initialized successfully!")
      } else {
        setInitMessage(`✗ Error: ${data.error}`)
      }
    } catch (error) {
      setInitMessage(`✗ Error: ${error instanceof Error ? error.message : "Failed to initialize"}`)
    } finally {
      setIsInitializing(false)
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
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-bold text-primary">Settings</h1>
          <div className="w-6" />
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Facility Settings */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Facility Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Facility Name</label>
                  <input
                    type="text"
                    defaultValue="Downtown Parking Garage"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                  <input
                    type="text"
                    defaultValue="123 Main St, Downtown"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Total Spots</label>
                    <input
                      type="number"
                      defaultValue="150"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Hourly Rate ($)</label>
                    <input
                      type="number"
                      defaultValue="5.00"
                      step="0.10"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Settings */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Pricing</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Daily Max ($)</label>
                    <input
                      type="number"
                      defaultValue="25.00"
                      step="0.10"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Monthly Pass ($)</label>
                    <input
                      type="number"
                      defaultValue="450.00"
                      step="10"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Database Settings */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Database Connection</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">MySQL Connection Settings</p>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Host</label>
                  <input
                    type="text"
                    placeholder="localhost"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Port</label>
                    <input
                      type="text"
                      placeholder="3306"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Database</label>
                    <input
                      type="text"
                      placeholder="parking_db"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Username</label>
                  <input
                    type="text"
                    placeholder="root"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Database Initialization Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Database Initialization</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Initialize TiDB database tables and sample data. This will create all necessary tables and populate them
                with sample data.
              </p>
              <button
                onClick={handleInitializeDB}
                disabled={isInitializing}
                className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-opacity-90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInitializing ? "Initializing..." : "Initialize Database"}
              </button>
              {initMessage && (
                <div
                  className={`mt-4 p-4 rounded-lg text-sm ${initMessage.includes("✓") ? "bg-green-900/20 text-green-300" : "bg-red-900/20 text-red-300"}`}
                >
                  {initMessage}
                </div>
              )}
            </div>

            {/* Save Button */}
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition font-medium">
              <Save size={20} />
              Save Changes
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
