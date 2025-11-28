import { queryDatabase, initializeDatabase } from "@/lib/db"
import { getTiDBConfig } from "@/lib/tidb-config"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    await initializeDatabase(getTiDBConfig())

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let query = `
      SELECT 
        r.id, r.user_id, r.parking_spot_id, r.facility_id,
        r.check_in, r.check_out, r.status, r.duration_hours, r.cost,
        u.full_name, u.email, ps.spot_number, ps.floor
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN parking_spots ps ON r.parking_spot_id = ps.id
      WHERE 1=1
    `
    const params: any[] = []

    if (status) {
      query += ` AND r.status = ?`
      params.push(status)
    } else {
      query += ` AND (r.status = 'active' OR r.check_out > NOW())`
    }

    query += ` ORDER BY r.check_in DESC LIMIT 100`

    const reservations = await queryDatabase(query, params)
    return NextResponse.json(reservations || [])
  } catch (error) {
    console.error("[API] Reservations error:", error)
    return NextResponse.json({ error: "Failed to fetch reservations", data: [] }, { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const { user_id, parking_spot_id, facility_id, check_in, check_out } = await request.json()

    const checkInDate = new Date(check_in)
    const checkOutDate = new Date(check_out)
    const durationHours = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60))
    const cost = durationHours * 8 // $8 per hour

    const result = await queryDatabase(
      `INSERT INTO reservations (user_id, parking_spot_id, facility_id, check_in, check_out, status, duration_hours, cost)
       VALUES (?, ?, ?, ?, ?, 'active', ?, ?)`,
      [user_id, parking_spot_id, facility_id, check_in, check_out, durationHours, cost],
    )

    // Update spot status
    await queryDatabase(`UPDATE parking_spots SET status = 'reserved' WHERE id = ?`, [parking_spot_id])

    return NextResponse.json({ success: true, id: result.insertId })
  } catch (error) {
    console.error("[API] Create reservation error:", error)
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json()

    await queryDatabase(`UPDATE reservations SET status = ? WHERE id = ?`, [status, id])

    // If cancelling, update spot status back to available
    if (status === "cancelled") {
      const reservation = await queryDatabase(`SELECT parking_spot_id FROM reservations WHERE id = ?`, [id])
      if (reservation.length > 0) {
        await queryDatabase(`UPDATE parking_spots SET status = 'available' WHERE id = ?`, [
          reservation[0].parking_spot_id,
        ])
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Update reservation error:", error)
    return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 })
  }
}
