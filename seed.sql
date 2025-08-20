-- Enable UUID extension (first time only)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create members table
CREATE TABLE members (
    rid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_rid UUID REFERENCES members(rid),
    meal_count INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE deposit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_rid UUID REFERENCES members(rid),
    amount NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample members
INSERT INTO members (name, email, phone)
VALUES 
('Habibur Rahman', 'habibur@example.com', '01711111111'),
('John Doe', 'john@example.com', '01822222222'),
('Jane Smith', 'jane@example.com', '01933333333');

-- Insert sample meals
INSERT INTO meals (member_rid, meal_count)
VALUES
((SELECT rid FROM members WHERE name='Habibur Rahman'), 25),
((SELECT rid FROM members WHERE name='John Doe'), 30),
((SELECT rid FROM members WHERE name='Jane Smith'), 28);

-- Insert sample deposits
INSERT INTO deposit (member_rid, amount)
VALUES
((SELECT rid FROM members WHERE name='Habibur Rahman'), 5000.00),
((SELECT rid FROM members WHERE name='John Doe'), 4500.00),
((SELECT rid FROM members WHERE name='Jane Smith'), 4700.00);
