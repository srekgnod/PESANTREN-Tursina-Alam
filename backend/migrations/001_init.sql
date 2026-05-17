-- =============================================
-- Pesantren Tursina Alam — Initial Migration
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar VARCHAR(500),
    role VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token VARCHAR(500) NOT NULL,
    user_agent VARCHAR(500),
    ip_address VARCHAR(45),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- Santri
CREATE TABLE IF NOT EXISTS santris (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nis VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(1) NOT NULL,
    place_of_birth VARCHAR(100),
    date_of_birth DATE,
    address TEXT,
    phone VARCHAR(20),
    photo VARCHAR(500),
    parent_name VARCHAR(255),
    parent_phone VARCHAR(20),
    entry_year INT NOT NULL,
    class VARCHAR(20),
    dormitory VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    qr_code VARCHAR(500),
    user_id UUID REFERENCES users(id),
    wali_user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_santris_status ON santris(status);
CREATE INDEX idx_santris_class ON santris(class);
CREATE INDEX idx_santris_entry_year ON santris(entry_year);

-- Attendance
CREATE TABLE IF NOT EXISTS attendances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    santri_id UUID NOT NULL REFERENCES santris(id),
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    check_in TIMESTAMPTZ,
    check_out TIMESTAMPTZ,
    method VARCHAR(20) DEFAULT 'qr',
    notes VARCHAR(500),
    scanned_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_attendances_santri_id ON attendances(santri_id);
CREATE INDEX idx_attendances_date ON attendances(date);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    santri_id UUID NOT NULL REFERENCES santris(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    due_date DATE,
    paid_at TIMESTAMPTZ,
    payment_method VARCHAR(50),
    receipt VARCHAR(500),
    notes VARCHAR(500),
    period VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_period ON payments(period);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),
    image VARCHAR(500),
    is_public BOOLEAN DEFAULT true,
    author_id UUID NOT NULL REFERENCES users(id),
    publish_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- PPDB
CREATE TABLE IF NOT EXISTS ppdb_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(1) NOT NULL,
    place_of_birth VARCHAR(100),
    date_of_birth DATE,
    address TEXT,
    previous_school VARCHAR(255),
    parent_name VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    parent_email VARCHAR(255),
    documents TEXT,
    status VARCHAR(20) DEFAULT 'registered',
    academic_year VARCHAR(10),
    notes TEXT,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_ppdb_status ON ppdb_registrations(status);

-- Audit Trail
CREATE TABLE IF NOT EXISTS audit_trails (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    module VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50),
    old_values TEXT,
    new_values TEXT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user_id ON audit_trails(user_id);
CREATE INDEX idx_audit_action ON audit_trails(action);
CREATE INDEX idx_audit_module ON audit_trails(module);
