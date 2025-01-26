-- Classes table
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    max_spots INTEGER NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    date DATE NOT NULL,
    time TIME NOT NULL,
    spots_remaining INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registrations table
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id),
    square_payment_id VARCHAR(255),
    payment_status VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    participants INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);