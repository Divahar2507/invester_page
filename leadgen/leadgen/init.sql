CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    profile_name VARCHAR(255),
    industry VARCHAR(100),
    revenue VARCHAR(100),
    location VARCHAR(100),
    status VARCHAR(50) DEFAULT 'New',
    email VARCHAR(255),
    raw_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);