-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- Drop old tables if exist
DROP TABLE IF EXISTS deposit CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS meals CASCADE;

CREATE TYPE member_status AS ENUM ('active', 'inactive');

-- Members Table
CREATE TABLE members (
    rid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    address TEXT, 
    status member_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
 
 INSERT INTO members (name, email, phone, address, status)
VALUES
('Habibur Rahman', 'habib@example.com', '01711111111', 'Dhaka, Bangladesh', 'active'),
('Ayesha Akter', 'ayesha@example.com', '01722222222', 'Chattogram, Bangladesh', 'active'),
('Tanvir Hasan', 'tanvir@example.com', '01733333333', 'Rajshahi, Bangladesh', 'inactive'),
('Mehedi Hasan', 'mehedi@example.com', '01744444444', 'Sylhet, Bangladesh', 'active'),
('Nusrat Jahan', 'nusrat@example.com', '01755555555', 'Khulna, Bangladesh', 'inactive');

CREATE TABLE deposits (
    rid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(rid),
    amount NUMERIC(10,2) NOT NULL,
    month VARCHAR(7) NOT NULL, -- YYYY-MM format
    created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'Asia/Dhaka'),
    updated_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'Asia/Dhaka')
);


CREATE TABLE meals (
    rid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(rid),
    meal_date DATE NOT NULL,
    month VARCHAR(7) NOT NULL, -- YYYY-MM format
    meal_count NUMERIC(5,2) NOT NULL, 
    created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'Asia/Dhaka'),
    updated_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'Asia/Dhaka'),
    UNIQUE (member_id, meal_date)
);

ALTER TABLE meals
DROP CONSTRAINT meals_member_id_meal_date_key;



INSERT INTO meals (member_id, meal_date, month, meal_count)
VALUES
('0f470e40-6e7f-4921-a2ec-d2debae2a18a', '2025-08-12 16:36:47.591001', '2025-08', 1.0),
('0f470e40-6e7f-4921-a2ec-d2debae2a18a', '2025-08-20 16:36:47.591001', '2025-08', 2.0),
('0f470e40-6e7f-4921-a2ec-d2debae2a18a', '2025-08-25 16:36:47.591001', '2025-08', 1.5);




-- Insert sample deposits (January)
INSERT INTO deposits (rid, member_id, amount, month, created_at, updated_at)
VALUES 
(uuid_generate_v4(), '389fa032-2ccc-4786-aff2-93daae99249b', 5000.00, '2025-08', '2025-08-23 21:00:00+06', '2025-08-23 21:00:00+06'),
(uuid_generate_v4(), '0cc73ddf-094a-45cd-b787-532b640ef3c7', 4500.00, '2025-08', '2025-08-23 22:10:00+06', '2025-08-23 22:10:00+06'),
(uuid_generate_v4(), '716ca169-1435-465b-b86d-f80413c4a41d', 4000.00, '2025-08', '2025-08-23 23:20:00+06', '2025-08-23 23:20:00+06');

INSERT INTO deposits (rid, member_id, amount, month, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'd97b6972-742d-4e0a-873f-bcd51cfb3af5',
    5000,
    '2025-08',
    (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Dhaka'),
    (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Dhaka')
);

