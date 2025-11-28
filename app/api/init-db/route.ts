import { initializeDatabase } from "@/lib/db"
import { getTiDBConfig } from "@/lib/tidb-config"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const config = getTiDBConfig()
    console.log("[API] Initializing database connection...")
    await initializeDatabase(config)

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      config: {
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user.substring(0, 10) + "***",
      },
    })
  } catch (error) {
    console.error("[API] Init DB error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
