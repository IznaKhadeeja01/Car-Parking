# TiDB Configuration Guide

## TiDB Connection Setup

TiDB is a distributed SQL database that is MySQL-compatible. You can connect to it using the same drivers as MySQL.

### Connection Details

- **Default Port**: 4000
- **Protocol**: MySQL protocol (compatible)
- **Library**: mysql2/promise or similar

### Environment Variables

Add these to your `.env.local` file:

\`\`\`
DATABASE_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
DATABASE_PORT=4000
DATABASE_USER=4Rn2rxXRv8DAu2y.root
DATABASE_PASSWORD=F7GMNNp5raS5AymZ
DATABASE_NAME=test
DATABASE_SSL=false
\`\`\`

### Connection Example

\`\`\`javascript
import mysql from 'mysql2/promise'

const connection = await mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 4000,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
})
\`\`\`

### Running the Schema

1. Connect to your TiDB cluster
2. Execute the SQL in `scripts/parking-schema.sql`
3. The tables will be created with proper indexes optimized for TiDB

### Key Differences from MySQL

- Primary keys use BIGINT instead of INT for better distributed performance
- TiDB automatically optimizes indexes
- JSON support is native
- Transactions span across multiple nodes seamlessly
