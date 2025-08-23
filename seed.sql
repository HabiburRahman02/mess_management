-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- Drop old tables if exist
DROP TABLE IF EXISTS deposit CASCADE;
DROP TABLE IF EXISTS meals CASCADE;
DROP TABLE IF EXISTS members CASCADE;

-- Members Table
CREATE TABLE members (
    rid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Meals Table
CREATE TABLE meals (
    rid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(rid) ON DELETE CASCADE,
    meal_count INT NOT NULL,
    month VARCHAR(7) NOT NULL,  -- e.g. '2025-01'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Deposit Table
DROP TABLE IF EXISTS deposits;

-- নতুন table create করো
CREATE TABLE deposits (
    rid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(rid),
    amount NUMERIC(10,2) NOT NULL,
    month VARCHAR(7) NOT NULL, -- YYYY-MM format
    created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'Asia/Dhaka'),
    updated_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'Asia/Dhaka')
);

-- Insert sample members
INSERT INTO members (name, email, phone)
VALUES 
('Habibur Rahman', 'habibur@example.com', '01711111111'),
('John Doe', 'john@example.com', '01822222222'),
('Jane Smith', 'jane@example.com', '01933333333');

-- Insert sample meals (January)
INSERT INTO meals (member_id, meal_count, month)
VALUES
((SELECT rid FROM members WHERE name='Habibur Rahman'), 25, '2025-01'),
((SELECT rid FROM members WHERE name='John Doe'), 30, '2025-01'),
((SELECT rid FROM members WHERE name='Jane Smith'), 28, '2025-01');

-- Insert sample deposits (January)
INSERT INTO deposits (rid, member_id, amount, month, created_at, updated_at)
VALUES 
(uuid_generate_v4(), '221cc6d7-3f88-4237-811e-baed7a43a997', 5000.00, '2025-08', '2025-08-23 21:00:00+06', '2025-08-23 21:00:00+06'),
(uuid_generate_v4(), '8eeb209c-4f84-4bf2-bf5b-a01dfb405e30', 4500.00, '2025-08', '2025-08-23 22:10:00+06', '2025-08-23 22:10:00+06'),
(uuid_generate_v4(), 'd97b6972-742d-4e0a-873f-bcd51cfb3af5', 4000.00, '2025-08', '2025-08-23 23:20:00+06', '2025-08-23 23:20:00+06');

INSERT INTO deposits (rid, member_id, amount, month, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'd97b6972-742d-4e0a-873f-bcd51cfb3af5',
    5000,
    '2025-08',
    (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Dhaka'),
    (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Dhaka')
);
