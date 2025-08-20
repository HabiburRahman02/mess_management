

CREATE TABLE members (
    rid UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique ID
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    join_date DATE DEFAULT CURRENT_DATE
);
