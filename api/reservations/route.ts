// API Route: GET /api/reservations
// Fetch reservations with filtering options

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")

    console.log("[API] Fetching reservations:", { userId, status })

    // Mock SQL Query
    const sql = `
      SELECT r.*, ps.spot_number, u.full_name 
      FROM reservations r
      JOIN parking_spots ps ON r.parking_spot_id = ps.id
      JOIN users u ON r.user_id = u.id
      WHERE 1=1
      ${userId ? "AND r.user_id = ?" : ""}
      ${status ? "AND r.status = ?" : ""}
      ORDER BY r.check_in DESC
    `

    const reservations = [
      { id: 1, user_id: 1, spot_number: "2-05", full_name: "John Doe", check_in: "2024-01-15 09:00", status: "active" },
      {
        id: 2,
        user_id: 2,
        spot_number: "1-12",
        full_name: "Jane Smith",
        check_in: "2024-01-15 08:30",
        status: "active",
      },
    ]

    return Response.json({ success: true, data: reservations })
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// API Route: POST /api/reservations
// Create a new reservation

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, spotId, checkIn, checkOut } = body

    console.log("[API] Creating reservation:", body)

    // Calculate duration and cost
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const durationHours = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60))
    const cost = durationHours * 5 // $5 per hour

    return Response.json({
      success: true,
      data: {
        id: 1,
        ...body,
        duration_hours: durationHours,
        cost: cost,
        status: "active",
        createdAt: new Date(),
      },
    })
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 })
  }
}
