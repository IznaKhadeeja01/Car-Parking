export const getTiDBConfig = () => {
  // Parse connection string or use environment variables
  // Connection string format: mysql://user:password@host:port/database
  const connString = process.env.DATABASE_URL

  if (connString) {
    // Parse the connection string
    const url = new URL(connString)
    return {
      host: url.hostname || "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
      port: Number.parseInt(url.port || "4000"),
      user: url.username || "root",
      password: url.password || "",
      database: url.pathname?.slice(1) || "test",
      ssl: true, // TiDB Cloud requires SSL
    }
  }

  // Fallback to individual environment variables
  return {
    host: process.env.TIDB_HOST || "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
    port: Number.parseInt(process.env.TIDB_PORT || "4000"),
    user: process.env.TIDB_USER || "root",
    password: process.env.TIDB_PASSWORD || "",
    database: process.env.TIDB_DATABASE || "test",
    ssl: process.env.TIDB_SSL !== "false", // Default to true for TiDB Cloud
  }
}
