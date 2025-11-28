import { queryDatabase, initializeDatabase } from "@/lib/db"
import { getTiDBConfig } from "@/lib/tidb-config"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await initializeDatabase(getTiDBConfig())

    // Get hourly occupancy data
    const occupancyData = await queryDatabase(`
      SELECT 
        HOUR(check_in) as hour,
        COUNT(*) as sessions,
        COUNT(DISTINCT user_id) as unique_users
      FROM parking_sessions
      WHERE DATE(check_in) = CURDATE()
      GROUP BY HOUR(check_in)
      ORDER BY hour
    `)

    // Get daily revenue data
    const revenueData = await queryDatabase(`
      SELECT 
        DATE(check_in) as date,
        SUM(cost) as revenue,
        COUNT(*) as sessions
      FROM parking_sessions
      WHERE DATE(check_in) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(check_in)
      ORDER BY date DESC
    `)

    // Get spot type distribution
    const spotTypes = await queryDatabase(`
      SELECT 
        spot_type,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available
      FROM parking_spots
      GROUP BY spot_type
    `)

    // Get key metrics
    const metrics = await queryDatabase(`
      SELECT 
        COUNT(DISTINCT user_id) as total_users,
        COUNT(*) as total_sessions,
        AVG(TIMESTAMPDIFF(MINUTE, check_in, COALESCE(check_out, NOW()))) as avg_duration_minutes,
        SUM(cost) as total_revenue
      FROM parking_sessions
      WHERE DATE(check_in) = CURDATE()
    `)

    return NextResponse.json({
      occupancyData: occupancyData || [],
      revenueData: revenueData || [],
      spotTypes: spotTypes || [],
      metrics: metrics[0] || {},
    })
  } catch (error) {
    console.error("[API] Analytics error:", error)
    return NextResponse.json(
      {
        occupancyData: [],
        revenueData: [],
        spotTypes: [],
        metrics: {},
      },
      { status: 200 },
    )
  }
}
