import { queryDatabase, initializeDatabase } from "@/lib/db"
import { getTiDBConfig } from "@/lib/tidb-config"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    await initializeDatabase(getTiDBConfig())

    const { searchParams } = new URL(request.url)
    const floor = searchParams.get("floor")
    const status = searchParams.get("status")

    let query = `
      SELECT 
        id, facility_id, spot_number, status, floor, section, spot_type
      FROM parking_spots
      WHERE 1=1
    `
    const params: any[] = []

    if (floor) {
      query += ` AND floor = ?`
      params.push(floor)
    }

    if (status) {
      query += ` AND status = ?`
      params.push(status)
    }

    query += ` ORDER BY floor, section, spot_number`

    const spots = await queryDatabase(query, params)
    return NextResponse.json(spots || [])
  } catch (error) {
    console.error("[API] Parking spots error:", error)
    return NextResponse.json({ error: "Failed to fetch spots", data: [] }, { status: 200 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json()

    await queryDatabase(`UPDATE parking_spots SET status = ? WHERE id = ?`, [status, id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Update spot error:", error)
    return NextResponse.json({ error: "Failed to update parking spot" }, { status: 500 })
  }
}
