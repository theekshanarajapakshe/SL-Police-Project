-- POLICE OPS DATABASE SCHEMA
-- Compatible with MySQL / MariaDB

CREATE DATABASE IF NOT EXISTS sl_police_ops;
USE sl_police_ops;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    police_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    rank VARCHAR(50),
    station_code VARCHAR(20),
    hashed_password VARCHAR(255) NOT NULL,
    role ENUM('officer', 'admin', 'super_admin') DEFAULT 'officer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. DRIVERS TABLE
CREATE TABLE IF NOT EXISTS drivers (
    nic VARCHAR(12) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    address TEXT,
    dob DATE,
    blood_group VARCHAR(5),
    contact_number VARCHAR(15),
    license_number VARCHAR(20) UNIQUE NOT NULL,
    license_issued_date DATE,
    license_expiry_date DATE NOT NULL,
    license_classes VARCHAR(50), -- Comma separated e.g. "A,B"
    license_status ENUM('active', 'suspended', 'expired', 'revoked') DEFAULT 'active',
    wanted_status BOOLEAN DEFAULT FALSE,
    photo_url VARCHAR(255)
);

-- 3. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    number_plate VARCHAR(15) UNIQUE NOT NULL,
    chassis_number VARCHAR(50),
    engine_number VARCHAR(50),
    make VARCHAR(50),
    model VARCHAR(50),
    year INT,
    fuel_type VARCHAR(20),
    color VARCHAR(20),
    owner_nic VARCHAR(12),
    registered_date DATE,
    registration_expiry_date DATE,
    insurance_provider VARCHAR(50),
    insurance_expiry_date DATE,
    permit_type ENUM('private', 'commercial', 'three-wheeler') DEFAULT 'private',
    revenue_license_expiry DATE,
    emission_test_expiry DATE,
    stolen_status BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (owner_nic) REFERENCES drivers(nic) ON DELETE SET NULL
);

-- 4. OFFENSES TABLE
CREATE TABLE IF NOT EXISTS offenses (
    offense_code VARCHAR(20) PRIMARY KEY,
    description TEXT NOT NULL,
    legal_reference VARCHAR(100),
    fine_amount DECIMAL(10,2) NOT NULL,
    penalty_points INT DEFAULT 0,
    category ENUM('speeding', 'parking', 'document', 'dangerous', 'dui')
);

-- 5. TICKETS TABLE
CREATE TABLE IF NOT EXISTS tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    offense_code VARCHAR(20),
    vehicle_plate VARCHAR(15),
    officer_id INT, -- Refers to users.id or users.police_id
    nic_of_driver VARCHAR(12),
    ticket_date DATE NOT NULL,
    ticket_time TIME NOT NULL,
    location VARCHAR(100),
    status ENUM('issued', 'paid', 'disputed') DEFAULT 'issued',
    notes TEXT,
    FOREIGN KEY (offense_code) REFERENCES offenses(offense_code),
    FOREIGN KEY (vehicle_plate) REFERENCES vehicles(number_plate),
    FOREIGN KEY (nic_of_driver) REFERENCES drivers(nic)
);

-- 6. BLACKLISTS
CREATE TABLE IF NOT EXISTS vehicle_blacklist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_plate VARCHAR(15),
    reason VARCHAR(50) DEFAULT 'stolen',
    priority ENUM('high', 'medium'),
    issued_by VARCHAR(20),
    valid_until DATE,
    FOREIGN KEY (vehicle_plate) REFERENCES vehicles(number_plate)
);

-- SAMPLE DATA INSERTS --

INSERT INTO users (police_id, full_name, rank, station_code, hashed_password, role) VALUES 
('COP001', 'Sgt. Kamal Perera', 'Sergeant', 'CMB-01', 'hashed_pass_123', 'officer'),
('ADMIN01', 'DIG Ruwan Silva', 'DIG', 'HQ', 'hashed_pass_admin', 'admin');

INSERT INTO offenses (offense_code, description, fine_amount, category) VALUES
('SPD-01', 'Speeding > 20kmph', 3000.00, 'speeding'),
('DOC-01', 'Expired License', 2500.00, 'document');

-- (Add more inserts as per requirement)
