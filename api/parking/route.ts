// API Route: GET /api/parking
// Fetch all parking spots with optional filtering

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const facilityId = searchParams.get("facilityId")
    const status = searchParams.get("status")

    // Mock SQL Query (replace with actual database connection)
    const sql = `
      SELECT * FROM parking_spots 
      WHERE facility_id = ? 
      ${status ? "AND status = ?" : ""}
    `

    console.log("[API] Fetching parking spots:", { facilityId, status })

    // Placeholder response
    const spots = [
      { id: 1, spot_number: "1-01", status: "available", floor: 1 },
      { id: 2, spot_number: "1-02", status: "occupied", floor: 1 },
      { id: 3, spot_number: "1-03", status: "reserved", floor: 1 },
    ]

    return Response.json({ success: true, data: spots })
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// API Route: POST /api/parking
// Create a new parking spot

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { facilityId, spotNumber, spotType, floor } = body

    console.log("[API] Creating parking spot:", body)

    // Mock response
    return Response.json({
      success: true,
      data: { id: 1, ...body, createdAt: new Date() },
    })
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 })
  }
}
