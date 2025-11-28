import { queryDatabase, initializeDatabase } from "@/lib/db"
import { getTiDBConfig } from "@/lib/tidb-config"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await initializeDatabase(getTiDBConfig())

    const users = await queryDatabase(`
      SELECT 
        id, email, full_name, role, phone, vehicle_plate,
        created_at
      FROM users
      ORDER BY created_at DESC
    `)

    return NextResponse.json(users || [])
  } catch (error) {
    console.error("[API] Users GET error:", error)
    return NextResponse.json({ error: "Failed to fetch users", data: [] }, { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const { email, password, full_name, role, phone, vehicle_plate } = await request.json()

    const result = await queryDatabase(
      `INSERT INTO users (email, password, full_name, role, phone, vehicle_plate) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, password, full_name, role || "user", phone, vehicle_plate],
    )

    return NextResponse.json({ success: true, id: result.insertId })
  } catch (error) {
    console.error("[API] Users POST error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, email, full_name, role, phone, vehicle_plate } = await request.json()

    await queryDatabase(
      `UPDATE users SET email = ?, full_name = ?, role = ?, phone = ?, vehicle_plate = ? 
       WHERE id = ?`,
      [email, full_name, role, phone, vehicle_plate, id],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Users PUT error:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    await queryDatabase(`DELETE FROM users WHERE id = ?`, [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Users DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
