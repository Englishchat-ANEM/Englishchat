-- EnglishChat Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  native_language VARCHAR(50),
  english_level VARCHAR(10) DEFAULT 'A1',
  bio TEXT,
  xp_total INT DEFAULT 0,
  streak INT DEFAULT 0,
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  level VARCHAR(10) NOT NULL,
  lesson_type VARCHAR(50) NOT NULL,
  xp_reward INT DEFAULT 100,
  duration_minutes INT DEFAULT 5,
  audio_url VARCHAR(500),
  image_url VARCHAR(500),
  order_in_level INT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT REFERENCES users(id)
);

-- User lesson progress
CREATE TABLE IF NOT EXISTS user_lessons (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP,
  xp_earned INT,
  quiz_score INT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);

-- Calls table
CREATE TABLE IF NOT EXISTS calls (
  id SERIAL PRIMARY KEY,
  user_a_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_b_id INT REFERENCES users(id) ON DELETE CASCADE,
  call_type VARCHAR(50) DEFAULT 'audio',
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  duration_seconds INT,
  jitsi_room_name VARCHAR(255),
  rating_a INT,
  rating_b INT,
  feedback_a_helpful BOOLEAN,
  feedback_b_helpful BOOLEAN,
  user_a_xp_earned INT DEFAULT 0,
  user_b_xp_earned INT DEFAULT 0,
  report_reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- User badges
CREATE TABLE IF NOT EXISTS user_badges (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_name VARCHAR(100) NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_name)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_lessons_level ON lessons(level);
CREATE INDEX IF NOT EXISTS idx_lessons_published ON lessons(is_published);
CREATE INDEX IF NOT EXISTS idx_user_lessons_user_id ON user_lessons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lessons_completed ON user_lessons(is_completed);
CREATE INDEX IF NOT EXISTS idx_calls_user_a_id ON calls(user_a_id);
CREATE INDEX IF NOT EXISTS idx_calls_user_b_id ON calls(user_b_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);

-- Insert sample admin user
INSERT INTO users (email, password_hash, first_name, english_level, role, verified_at)
VALUES ('admin@englishchat.app', '$2a$10$KIXxPfkx8Q3N5z5Z9zJ9zuYZ9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z', 'Admin', 'B2', 'admin', NOW())
ON CONFLICT DO NOTHING;

-- Insert sample lessons
INSERT INTO lessons (title, description, content, level, lesson_type, xp_reward, is_published, order_in_level, created_by)
VALUES
('Hello & Introduction', 'Learn how to greet people', 'Hello = Bonjour. Hi = Salut. Good morning = Bon matin', 'A1', 'text', 100, true, 1, 1),
('Common Greetings', 'Master essential greetings', 'How are you? = Comment allez-vous? I am fine = Je vais bien', 'A1', 'text', 100, true, 2, 1),
('Numbers 1-10', 'Learn to count', 'One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten', 'A1', 'vocab', 100, true, 3, 1),
('Days of the Week', 'Learn days', 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday', 'A1', 'vocab', 100, true, 4, 1),
('What is your name?', 'Ask and answer about names', 'What is your name? My name is...', 'A1', 'dialogue', 150, true, 5, 1),
('Colors', 'Learn colors in English', 'Red, Blue, Green, Yellow, Orange, Purple, Black, White', 'A1', 'vocab', 100, true, 6, 1),
('Family Members', 'Learn family vocabulary', 'Mother, Father, Sister, Brother, Grandmother, Grandfather', 'A1', 'vocab', 100, true, 7, 1),
('Food & Drinks', 'Common food items', 'Apple, Bread, Cheese, Coffee, Tea, Water, Milk', 'A1', 'vocab', 100, true, 8, 1),
('Weather', 'Talk about weather', 'Sunny, Rainy, Cloudy, Windy, Hot, Cold, Warm', 'A1', 'vocab', 100, true, 9, 1),
('Time', 'Tell the time', 'What time is it? It is 3 oclock. Half past two. Quarter to five', 'A1', 'dialogue', 150, true, 10, 1),
('Present Tense', 'Learn I am, You are, He is', 'I am a student. You are smart. He is happy.', 'A2', 'grammar', 150, true, 1, 1),
('Past Tense', 'Learn I was, I went, I did', 'I was happy. I went to the store. I did my homework.', 'A2', 'grammar', 150, true, 2, 1),
('Asking Questions', 'How to ask questions', 'Do you speak English? Where are you from? What is your job?', 'A2', 'dialogue', 150, true, 3, 1),
('Restaurant Conversation', 'Order food in English', 'I would like... The bill please... Do you have vegetarian options?', 'A2', 'dialogue', 150, true, 4, 1),
('Travel Phrases', 'Travel vocabulary', 'Where is the airport? I need a hotel. Can you help me?', 'A2', 'dialogue', 150, true, 5, 1),
('Conditional Tense', 'If I were... I would...', 'If I were you, I would study more. If I had money, I would travel.', 'B1', 'grammar', 200, true, 1, 1),
('Business English', 'Workplace vocabulary', 'Meeting, Deadline, Project, Team, Manager, Report, Strategy', 'B1', 'vocab', 200, true, 2, 1),
('Giving Opinions', 'Express your views', 'In my opinion... I think... I believe... It seems to me...', 'B1', 'dialogue', 200, true, 3, 1),
('Complex Sentences', 'Although, However, Therefore', 'Although it was difficult, I succeeded. However, I was tired. Therefore, I rested.', 'B1', 'grammar', 200, true, 4, 1),
('Academic Writing', 'Essay structure', 'Introduction, Body paragraphs, Conclusion, References', 'B2', 'text', 250, true, 1, 1)
ON CONFLICT DO NOTHING;
