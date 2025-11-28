import mysql from "mysql2/promise"
import { getTiDBConfig } from "./tidb-config"

interface DatabaseConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
  ssl?: boolean
}

let pool: any = null

export async function initializeDatabase(config?: DatabaseConfig) {
  try {
    const dbConfig = config || getTiDBConfig()
    console.log("[TiDB] Connecting to cluster at:", dbConfig.host)

    pool = mysql.createPool({
      host: dbConfig.host,
      port: dbConfig.port || 4000,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: dbConfig.ssl ? { rejectUnauthorized: false } : false,
    })

    const connection = await pool.getConnection()
    await connection.ping()
    connection.release()

    console.log("[TiDB] Successfully connected to TiDB")
    return pool
  } catch (error) {
    console.error("[TiDB] Connection failed:", error)
    throw error
  }
}

export async function getPool() {
  if (!pool) {
    await initializeDatabase()
  }
  return pool
}

export async function queryDatabase(sql: string, values?: any[]) {
  const poolConnection = await getPool()
  try {
    const [rows] = await poolConnection.query(sql, values || [])
    return rows
  } catch (error) {
    console.error("[TiDB] Query failed:", sql, error)
    throw error
  }
}

export async function executeQuery(sql: string, values?: any[]) {
  const poolConnection = await getPool()
  try {
    const [result] = await poolConnection.execute(sql, values || [])
    return result
  } catch (error) {
    console.error("[TiDB] Execute failed:", sql, error)
    throw error
  }
}

export async function closePool() {
  if (pool) {
    await pool.end()
    pool = null
    console.log("[TiDB] Connection pool closed")
  }
}
