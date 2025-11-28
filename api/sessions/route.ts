// API Route: POST /api/sessions/checkin
// Check in a vehicle to parking spot

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, spotId, facilityId, vehiclePlate } = body

    console.log("[API] Check-in:", body)

    // Mock SQL update to mark spot as occupied
    const sql = `
      UPDATE parking_spots SET status = 'occupied' WHERE id = ?;
      INSERT INTO parking_sessions (user_id, parking_spot_id, facility_id, vehicle_plate, check_in)
      VALUES (?, ?, ?, ?, NOW());
    `

    return Response.json({
      success: true,
      message: "Check-in successful",
      data: { sessionId: 1, ...body, checkInTime: new Date() },
    })
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 })
  }
}
