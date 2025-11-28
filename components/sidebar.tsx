"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

function DashboardIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="9" x2="9" y2="15" />
      <line x1="15" y1="9" x2="15" y2="15" />
    </svg>
  )
}

function ParkingIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9 9h4v6H9z" />
    </svg>
  )
}

function CalendarIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function BarChartIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M17 5h-10v14h10z" />
      <path d="M7 9h10" />
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

function SettingsIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 0l4.24-4.24M1 12h6m6 0h6m-16.78 7.78l4.24-4.24m5.08 0l4.24 4.24" />
    </svg>
  )
}

function CloseIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { href: "/", label: "Dashboard", icon: DashboardIcon },
    { href: "/parking", label: "Parking Spots", icon: ParkingIcon },
    { href: "/reservations", label: "Reservations", icon: CalendarIcon },
    { href: "/analytics", label: "Analytics", icon: BarChartIcon },
    { href: "/users", label: "Users", icon: UsersIcon },
    { href: "/settings", label: "Settings", icon: SettingsIcon },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={onToggle} />}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-30 w-64 h-screen bg-sidebar border-r border-sidebar-border transition-transform duration-300 transform ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-primary">ParkHub</h1>
          <button onClick={onToggle} className="md:hidden text-sidebar-foreground hover:text-sidebar-primary">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
