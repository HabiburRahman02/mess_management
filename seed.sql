-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- Drop old tables if exist
DROP TABLE IF EXISTS deposit CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS meals CASCADE;
DROP TABLE IF EXISTS bazar_costs CASCADE;
DROP TABLE IF EXISTS other_costs CASCADE;
DROP TABLE IF EXISTS bazar_cost_items CASCADE;

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

ALTER TABLE deposits
ADD COLUMN deposit_date DATE DEFAULT (CURRENT_DATE);

 INSERT INTO members (name, email, phone, address, status)
VALUES
('Habibur Rahman', 'habib@example.com', '01711111111', 'Dhaka, Bangladesh', 'active'),
('Ayesha Akter', 'ayesha@example.com', '01722222222', 'Chattogram, Bangladesh', 'active'),
('Tanvir Hasan', 'tanvir@example.com', '01733333333', 'Rajshahi, Bangladesh', 'inactive'),
('Mehedi Hasan', 'mehedi@example.com', '01744444444', 'Sylhet, Bangladesh', 'active'),
('Nusrat Jahan', 'nusrat@example.com', '01755555555', 'Khulna, Bangladesh', 'inactive');

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







CREATE TABLE bazar_costs (
    rid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL,          
    month VARCHAR(20) NOT NULL,
    cost_date DATE NOT NULL,    
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT (NOW() AT TIME ZONE 'Asia/Dhaka'),
    updated_at TIMESTAMPTZ DEFAULT (NOW() AT TIME ZONE 'Asia/Dhaka'),
    FOREIGN KEY (member_id) REFERENCES members(rid)
);

CREATE TABLE bazar_cost_items (
    rid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bazar_id UUID NOT NULL,          -- UUID of bazar_costs
    month VARCHAR(20) NOT NULL,      
    item_name VARCHAR(100) NOT NULL,
    cost_date DATE NOT NULL,
    quantity VARCHAR(50),           
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT (NOW() AT TIME ZONE 'Asia/Dhaka'),
    updated_at TIMESTAMPTZ DEFAULT (NOW() AT TIME ZONE 'Asia/Dhaka'),
    FOREIGN KEY (bazar_id) REFERENCES bazar_costs(rid) ON DELETE CASCADE
);

CREATE TABLE other_costs (
    rid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL, 
    month VARCHAR(20) NOT NULL,
    cost_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    cost_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT (NOW() AT TIME ZONE 'Asia/Dhaka'),
    updated_at TIMESTAMPTZ DEFAULT (NOW() AT TIME ZONE 'Asia/Dhaka'),
    FOREIGN KEY (member_id) REFERENCES members(rid)
);

-- Bazar Costs
INSERT INTO bazar_costs (rid, member_id, month, cost_date, amount)
VALUES
(uuid_generate_v4(), '0f470e40-6e7f-4921-a2ec-d2debae2a18a', '2025-08', '2025-08-05', 1200.00),
(uuid_generate_v4(), '0f470e40-6e7f-4921-a2ec-d2debae2a18a', '2025-08', '2025-08-15', 800.00),
(uuid_generate_v4(), '87481737-9170-4a8b-b8e3-cddc3426ddf7', '2025-08', '2025-08-10', 1500.00);

-- ধরলাম rid generate হয়ে গেছে এবং তা ধরে নিচ্ছি bci এর জন্য
-- প্রথম bazar_cost এর item
INSERT INTO bazar_cost_items (rid, bazar_id, month, item_name, cost_date, quantity, price)
VALUES
(uuid_generate_v4(), 'f9696680-959a-4e5a-b406-74cf407d5359', '2025-08', 'Dim', '2025-08-05', '2 kg', 400.00),
(uuid_generate_v4(), 'f9696680-959a-4e5a-b406-74cf407d5359', '2025-08', 'Alu', '2025-08-05', '5 kg', 300.00),
(uuid_generate_v4(), '6ab021eb-d91c-406d-8249-88d2b085eda9', '2025-08', 'Peyaj', '2025-08-10', '3 kg', 500.00);

-- Other Costs
INSERT INTO other_costs (rid, member_id, month, cost_name, amount, cost_date)
VALUES
(uuid_generate_v4(), '0f470e40-6e7f-4921-a2ec-d2debae2a18a', '2025-08', 'Gas Bill', 500.00, '2025-08-12'),
(uuid_generate_v4(), '0f470e40-6e7f-4921-a2ec-d2debae2a18a', '2025-08', 'Electricity', 700.00, '2025-08-18');

