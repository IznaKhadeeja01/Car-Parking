import { queryDatabase } from "@/lib/db"
import { NextResponse } from "next/server"

const CREATE_TABLES_SQL = `
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  phone VARCHAR(20),
  vehicle_plate VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create parking_facilities table
CREATE TABLE IF NOT EXISTS parking_facilities (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(500),
  total_spots INT NOT NULL,
  available_spots INT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  manager_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (manager_id) REFERENCES users(id),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create parking_spots table
CREATE TABLE IF NOT EXISTS parking_spots (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  facility_id BIGINT NOT NULL,
  spot_number VARCHAR(50) NOT NULL,
  status ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available',
  floor INT,
  section VARCHAR(50),
  spot_type ENUM('standard', 'handicap', 'ev_charging') DEFAULT 'standard',
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES parking_facilities(id),
  UNIQUE KEY unique_spot (facility_id, spot_number),
  INDEX idx_status (status),
  INDEX idx_facility (facility_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  parking_spot_id BIGINT NOT NULL,
  facility_id BIGINT NOT NULL,
  check_in DATETIME NOT NULL,
  check_out DATETIME NOT NULL,
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  duration_hours INT,
  cost DECIMAL(10, 2),
  vehicle_plate VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (parking_spot_id) REFERENCES parking_spots(id),
  FOREIGN KEY (facility_id) REFERENCES parking_facilities(id),
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_check_in (check_in)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create parking_sessions table
CREATE TABLE IF NOT EXISTS parking_sessions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  parking_spot_id BIGINT,
  facility_id BIGINT,
  check_in DATETIME NOT NULL,
  check_out DATETIME,
  duration_minutes INT,
  cost DECIMAL(10, 2),
  vehicle_plate VARCHAR(50),
  payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (parking_spot_id) REFERENCES parking_spots(id),
  FOREIGN KEY (facility_id) REFERENCES parking_facilities(id),
  INDEX idx_user (user_id),
  INDEX idx_check_in (check_in)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create daily_reports table
CREATE TABLE IF NOT EXISTS daily_reports (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  facility_id BIGINT,
  report_date DATE NOT NULL,
  total_sessions INT DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0,
  peak_occupancy INT DEFAULT 0,
  average_duration_minutes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES parking_facilities(id),
  INDEX idx_date (report_date),
  INDEX idx_facility (facility_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id BIGINT,
  changes JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`

const SEED_DATA_SQL = `
-- Insert admin user
INSERT IGNORE INTO users (id, email, password, full_name, role, phone, vehicle_plate) 
VALUES (1, 'admin@parkhub.com', 'admin123', 'Admin User', 'admin', '555-0001', 'ADMIN001');

-- Insert sample users
INSERT IGNORE INTO users (email, password, full_name, role, phone, vehicle_plate) 
VALUES 
  ('john@example.com', 'pass123', 'John Doe', 'user', '555-0002', 'JD-2024-01'),
  ('jane@example.com', 'pass123', 'Jane Smith', 'user', '555-0003', 'JS-2024-02'),
  ('mike@example.com', 'pass123', 'Mike Johnson', 'user', '555-0004', 'MJ-2024-03');

-- Insert parking facility
INSERT IGNORE INTO parking_facilities (id, name, location, total_spots, available_spots, latitude, longitude, manager_id)
VALUES (1, 'Downtown Parking', '123 Main St', 150, 45, 40.7128, -74.0060, 1);

-- Insert parking spots for each floor
INSERT IGNORE INTO parking_spots (facility_id, spot_number, status, floor, section, spot_type)
SELECT 1, CONCAT('F', f, '-', LPAD(s, 2, '0')), 
  CASE 
    WHEN s % 7 = 0 THEN 'occupied' 
    WHEN s % 13 = 0 THEN 'reserved' 
    WHEN s % 19 = 0 THEN 'maintenance'
    ELSE 'available' 
  END,
  f, CHAR(64 + CEIL(s / 6)), 
  CASE 
    WHEN s % 20 = 0 THEN 'handicap' 
    WHEN s % 30 = 0 THEN 'ev_charging' 
    ELSE 'standard' 
  END
FROM (
  SELECT 1 as f, @s:=@s+1 as s FROM (SELECT @s:=0) init
  UNION ALL
  SELECT 2, @s:=@s+1 FROM (SELECT @s:=30) init2
  UNION ALL
  SELECT 3, @s:=@s+1 FROM (SELECT @s:=60) init3
  UNION ALL
  SELECT 4, @s:=@s+1 FROM (SELECT @s:=90) init4
  UNION ALL
  SELECT 5, @s:=@s+1 FROM (SELECT @s:=120) init5
) spots WHERE s <= 150;

-- Insert sample reservations
INSERT IGNORE INTO reservations (user_id, parking_spot_id, facility_id, check_in, check_out, status, duration_hours, cost, vehicle_plate)
SELECT 2, ps.id, 1, NOW(), DATE_ADD(NOW(), INTERVAL 3 HOUR), 'active', 3, 24, 'JD-2024-01'
FROM parking_spots ps WHERE ps.facility_id = 1 AND ps.status = 'occupied' LIMIT 1;

INSERT IGNORE INTO reservations (user_id, parking_spot_id, facility_id, check_in, check_out, status, duration_hours, cost, vehicle_plate)
SELECT 3, ps.id, 1, NOW(), DATE_ADD(NOW(), INTERVAL 2 HOUR), 'active', 2, 16, 'JS-2024-02'
FROM parking_spots ps WHERE ps.facility_id = 1 AND ps.status = 'reserved' LIMIT 1;
`

export async function GET() {
  try {
    console.log("[DB Init] Starting database initialization...")

    // Create tables
    const tableStatements = CREATE_TABLES_SQL.split(";")
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith("--"))

    for (const statement of tableStatements) {
      try {
        await queryDatabase(statement)
        console.log("[DB Init] Table created/verified")
      } catch (error) {
        console.error("[DB Init] Error creating table:", error)
      }
    }

    // Seed data
    const seedStatements = SEED_DATA_SQL.split(";")
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith("--"))

    for (const statement of seedStatements) {
      try {
        await queryDatabase(statement)
        console.log("[DB Init] Data seeded")
      } catch (error) {
        console.error("[DB Init] Error seeding data:", error)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully with tables and sample data",
    })
  } catch (error) {
    console.error("[DB Init] Fatal error:", error)
    return NextResponse.json(
      {
        error: "Database initialization failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  return GET()
}
