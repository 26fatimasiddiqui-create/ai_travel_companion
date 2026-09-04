-- ====================================================================
-- AI Travel Companion Database Schema (MySQL Compatible DDL)
-- ====================================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'ROLE_USER',
    travel_preferences TEXT,
    created_at DATETIME
);

CREATE TABLE IF NOT EXISTS trips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DOUBLE NOT NULL,
    travelers_count INT DEFAULT 1,
    travel_type VARCHAR(50) DEFAULT 'SOLO',
    mood VARCHAR(50) DEFAULT 'RELAXED',
    accessibility_profile VARCHAR(50) DEFAULT 'NONE',
    interests TEXT,
    accommodation_preference TEXT,
    created_at DATETIME,
    CONSTRAINT fk_trips_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS itinerary_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    day_number INT NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    place_name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    duration_minutes INT,
    travel_time_minutes INT,
    estimated_cost DOUBLE,
    recommendation_reason TEXT,
    weather_consideration TEXT,
    crowd_level VARCHAR(30),
    accessibility_note TEXT,
    safety_note TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    latitude DOUBLE,
    longitude DOUBLE,
    CONSTRAINT fk_itinerary_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount DOUBLE NOT NULL,
    is_planned BOOLEAN DEFAULT FALSE,
    expense_date DATE,
    notes TEXT,
    created_at DATETIME,
    CONSTRAINT fk_expenses_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS places (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    destination VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    latitude DOUBLE,
    longitude DOUBLE,
    crowd_quiet_hours VARCHAR(100),
    crowd_mod_hours VARCHAR(100),
    crowd_peak_hours VARCHAR(100),
    accessibility_features TEXT,
    safety_score INT DEFAULT 85,
    estimated_cost DOUBLE,
    image_url VARCHAR(500),
    is_hidden_gem BOOLEAN DEFAULT FALSE,
    suited_mood VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS hotels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    destination VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255),
    price_per_night DOUBLE,
    rating DOUBLE,
    is_accessible BOOLEAN DEFAULT TRUE,
    amenities TEXT,
    image_url VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    place_id BIGINT NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    rating INT,
    comment TEXT,
    created_at DATETIME,
    CONSTRAINT fk_reviews_place FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS memories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    place_name VARCHAR(255) NOT NULL,
    photo_url VARCHAR(500),
    visit_date DATE,
    notes TEXT,
    expense_amount DOUBLE,
    emotion_tag VARCHAR(50),
    created_at DATETIME,
    CONSTRAINT fk_memories_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS group_trips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL UNIQUE,
    group_name VARCHAR(100) NOT NULL,
    invite_code VARCHAR(20) NOT NULL UNIQUE,
    members_json TEXT,
    compromise_summary TEXT,
    created_at DATETIME,
    CONSTRAINT fk_group_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS group_votes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    group_trip_id BIGINT NOT NULL,
    voter_name VARCHAR(100) NOT NULL,
    preferred_places TEXT,
    preferred_activities TEXT,
    budget_cap DOUBLE,
    created_at DATETIME,
    CONSTRAINT fk_group_votes FOREIGN KEY (group_trip_id) REFERENCES group_trips(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS packing_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    category VARCHAR(50) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    is_packed BOOLEAN DEFAULT FALSE,
    weather_trigger VARCHAR(255),
    CONSTRAINT fk_packing_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS companion_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    suggested_action TEXT,
    original_item VARCHAR(255),
    replacement_item VARCHAR(255),
    reason_why TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at DATETIME,
    CONSTRAINT fk_alerts_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);
