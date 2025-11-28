"use client"

interface Activity {
  id: number
  type: "checkin" | "checkout" | "reservation"
  user: string
  spot: string
  time: string
  status: "completed" | "pending" | "cancelled"
}

function CheckCircleIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function XCircleIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

function ClockIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function UserIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export function RecentActivity() {
  const activities: Activity[] = [
    {
      id: 1,
      type: "checkin",
      user: "John Doe",
      spot: "2-05",
      time: "2 minutes ago",
      status: "completed",
    },
    {
      id: 2,
      type: "checkout",
      user: "Jane Smith",
      spot: "1-12",
      time: "5 minutes ago",
      status: "completed",
    },
    {
      id: 3,
      type: "reservation",
      user: "Mike Johnson",
      spot: "3-08",
      time: "12 minutes ago",
      status: "pending",
    },
    {
      id: 4,
      type: "checkin",
      user: "Sarah Williams",
      spot: "2-15",
      time: "18 minutes ago",
      status: "completed",
    },
    {
      id: 5,
      type: "checkout",
      user: "Tom Brown",
      spot: "1-03",
      time: "25 minutes ago",
      status: "cancelled",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "checkin":
        return <CheckCircleIcon className="w-4 h-4 text-chart-2" />
      case "checkout":
        return <XCircleIcon className="w-4 h-4 text-chart-1" />
      case "reservation":
        return <ClockIcon className="w-4 h-4 text-chart-3" />
      default:
        return <UserIcon className="w-4 h-4" />
    }
  }

  const getActivityLabel = (type: string) => {
    switch (type) {
      case "checkin":
        return "Check-in"
      case "checkout":
        return "Check-out"
      case "reservation":
        return "Reservation"
      default:
        return "Activity"
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Recent Activity</h3>
        <a href="#" className="text-sm text-accent hover:text-primary transition">
          View All
        </a>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-accent transition"
          >
            <div className="flex items-center gap-4 flex-1">
              {getActivityIcon(activity.type)}
              <div>
                <p className="text-foreground font-medium">{getActivityLabel(activity.type)}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.user} • Spot {activity.spot}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">{activity.time}</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  activity.status === "completed"
                    ? "bg-chart-2/20 text-chart-2"
                    : activity.status === "pending"
                      ? "bg-chart-1/20 text-chart-1"
                      : "bg-destructive/20 text-destructive"
                }`}
              >
                {activity.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
