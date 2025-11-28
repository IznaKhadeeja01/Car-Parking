import { queryDatabase, initializeDatabase } from "@/lib/db"
import { getTiDBConfig } from "@/lib/tidb-config"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await initializeDatabase(getTiDBConfig())

    const stats = await queryDatabase(`
      SELECT 
        COUNT(*) as total_spots,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available_spots,
        SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied_spots,
        SUM(CASE WHEN status = 'reserved' THEN 1 ELSE 0 END) as reserved_spots
      FROM parking_spots
    `)

    const facilityStats = await queryDatabase(`
      SELECT 
        COUNT(DISTINCT user_id) as active_users,
        SUM(CASE WHEN checkout_time IS NULL THEN 1 ELSE 0 END) as active_sessions
      FROM parking_sessions
      WHERE checkout_time IS NULL OR DATE(checkout_time) = CURDATE()
    `)

    const revenueStats = await queryDatabase(`
      SELECT 
        SUM(amount) as daily_revenue
      FROM daily_reports
      WHERE report_date = CURDATE()
    `)

    const occupancyRate = stats[0]?.total_spots
      ? ((stats[0].occupied_spots / stats[0].total_spots) * 100).toFixed(1)
      : 0

    return NextResponse.json({
      totalSpots: stats[0]?.total_spots || 0,
      availableSpots: stats[0]?.available_spots || 0,
      occupiedSpots: stats[0]?.occupied_spots || 0,
      reservedSpots: stats[0]?.reserved_spots || 0,
      occupancyRate: Number.parseFloat(occupancyRate as string),
      activeUsers: facilityStats[0]?.active_users || 0,
      revenue: revenueStats[0]?.daily_revenue || 0,
    })
  } catch (error) {
    console.error("[API] Stats error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch stats",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
