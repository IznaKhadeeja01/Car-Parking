-- Initialize TiDB database with sample data
USE test;

-- Truncate existing data (optional - remove if you want to keep data)
TRUNCATE TABLE audit_logs;
TRUNCATE TABLE daily_reports;
TRUNCATE TABLE parking_sessions;
TRUNCATE TABLE reservations;
TRUNCATE TABLE parking_spots;
TRUNCATE TABLE parking_facilities;
TRUNCATE TABLE users;

-- Insert admin user
INSERT INTO users (email, password, full_name, role, phone, vehicle_plate) 
VALUES ('admin@parkhub.com', 'admin123', 'Admin User', 'admin', '555-0001', 'ADMIN001');

-- Insert regular users
INSERT INTO users (email, password, full_name, role, phone, vehicle_plate) 
VALUES 
  ('john@example.com', 'pass123', 'John Doe', 'user', '555-0002', 'JD-2024-01'),
  ('jane@example.com', 'pass123', 'Jane Smith', 'user', '555-0003', 'JS-2024-02'),
  ('mike@example.com', 'pass123', 'Mike Johnson', 'user', '555-0004', 'MJ-2024-03');

-- Insert parking facility
INSERT INTO parking_facilities (name, location, total_spots, available_spots, latitude, longitude, manager_id)
VALUES ('Downtown Parking', '123 Main St', 150, 45, 40.7128, -74.0060, 1);

-- Insert parking spots
INSERT INTO parking_spots (facility_id, spot_number, status, floor, section, spot_type)
SELECT 1, CONCAT(f, '-', LPAD(s, 2, '0')), 
  CASE WHEN s % 7 = 0 THEN 'occupied' WHEN s % 13 = 0 THEN 'reserved' ELSE 'available' END,
  f, CHAR(64 + CEIL(s / 6)), 
  CASE WHEN s % 20 = 0 THEN 'handicap' WHEN s % 30 = 0 THEN 'ev_charging' ELSE 'standard' END
FROM (
  SELECT 1 as f, @s:=@s+1 as s FROM (SELECT @s:=0) init, 
  (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) d1,
  (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) d2
) spots WHERE s <= 150;

-- Insert sample reservations
INSERT INTO reservations (user_id, parking_spot_id, facility_id, check_in, check_out, status, duration_hours, cost, vehicle_plate)
SELECT u.id, ps.id, pf.id, NOW(), DATE_ADD(NOW(), INTERVAL 3 HOUR), 'active', 3, 24, u.vehicle_plate
FROM users u 
CROSS JOIN parking_spots ps 
CROSS JOIN parking_facilities pf
WHERE u.id IN (2,3,4) AND ps.facility_id = 1 AND ps.status = 'occupied'
LIMIT 3;

-- Insert sample parking sessions
INSERT INTO parking_sessions (user_id, parking_spot_id, facility_id, check_in, check_out, duration_minutes, cost, vehicle_plate, payment_status)
SELECT u.id, ps.id, pf.id, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY) + INTERVAL 2 HOUR, 120, 16, u.vehicle_plate, 'completed'
FROM users u 
CROSS JOIN parking_spots ps 
CROSS JOIN parking_facilities pf
WHERE u.id IN (2,3,4) AND ps.facility_id = 1
LIMIT 15;
