-- Parking Management System Database Schema for TiDB
-- TiDB is a distributed SQL database compatible with MySQL
-- Default TiDB port: 4000

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  phone VARCHAR(20),
  vehicle_plate VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Parking facilities table
CREATE TABLE IF NOT EXISTS parking_facilities (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  total_spots INT NOT NULL,
  available_spots INT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  manager_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (manager_id) REFERENCES users(id)
);

-- Parking spots table
CREATE TABLE IF NOT EXISTS parking_spots (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  facility_id BIGINT NOT NULL,
  spot_number VARCHAR(50) NOT NULL,
  status ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available',
  floor INT,
  section VARCHAR(50),
  spot_type ENUM('standard', 'handicap', 'compact', 'ev_charging') DEFAULT 'standard',
  reserved_until DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_spot (facility_id, spot_number),
  FOREIGN KEY (facility_id) REFERENCES parking_facilities(id)
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
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
  FOREIGN KEY (facility_id) REFERENCES parking_facilities(id)
);

-- Parking sessions (check-in/check-out tracking)
CREATE TABLE IF NOT EXISTS parking_sessions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  parking_spot_id BIGINT NOT NULL,
  facility_id BIGINT NOT NULL,
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
  FOREIGN KEY (facility_id) REFERENCES parking_facilities(id)
);

-- Analytics/Daily reports
CREATE TABLE IF NOT EXISTS daily_reports (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  facility_id BIGINT NOT NULL,
  report_date DATE NOT NULL,
  total_sessions INT DEFAULT 0,
  peak_hour INT,
  average_duration_minutes INT,
  total_revenue DECIMAL(12, 2),
  occupancy_rate DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_report (facility_id, report_date),
  FOREIGN KEY (facility_id) REFERENCES parking_facilities(id)
);

-- Audit log
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id BIGINT,
  old_value JSON,
  new_value JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for performance (TiDB optimizes these automatically)
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_facility_location ON parking_facilities(location);
CREATE INDEX idx_spot_facility ON parking_spots(facility_id);
CREATE INDEX idx_spot_status ON parking_spots(status);
CREATE INDEX idx_reservation_user ON reservations(user_id);
CREATE INDEX idx_reservation_facility ON reservations(facility_id);
CREATE INDEX idx_reservation_status ON reservations(status);
CREATE INDEX idx_session_user ON parking_sessions(user_id);
CREATE INDEX idx_session_facility ON parking_sessions(facility_id);
CREATE INDEX idx_session_checkin ON parking_sessions(check_in);
CREATE INDEX idx_daily_report_facility ON daily_reports(facility_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
