# TiDB Connection Setup

## Environment Variables

Add these to your `.env.local` file or Vercel project settings:

\`\`\`
TIDB_HOST=your-cluster.tidb.io
TIDB_PORT=4000
TIDB_USER=root
TIDB_PASSWORD=your_password
TIDB_DATABASE=parking_db
TIDB_SSL=true
\`\`\`

## Connection Details

- **Host**: Your TiDB Cloud cluster endpoint
- **Port**: 4000 (default TiDB port)
- **User**: Your TiDB user (typically `root`)
- **Database**: Create a database named `parking_db` first

## First Time Setup

1. Create the database schema by running the SQL from `scripts/parking-schema.sql`
2. Add the environment variables to your project
3. The app will automatically connect to TiDB on startup

## Initializing the Database Connection

The database connection is initialized when the first API route is called. Make sure all environment variables are set correctly.

## Testing the Connection

Call `/api/stats` endpoint to test if the connection is working:

\`\`\`bash
curl http://localhost:3000/api/stats
\`\`\`

If successful, you'll get parking statistics from your TiDB database.
