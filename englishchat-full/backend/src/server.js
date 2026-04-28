const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/englishchat_dev'
});

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token' });

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ============= AUTH ROUTES =============
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, firstName } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name) VALUES ($1, $2, $3) RETURNING id, email, first_name',
      [email, hashedPassword, firstName]
    );

    const token = jwt.sign(
      { id: result.rows[0].id, email: result.rows[0].email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({ token, user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const validPassword = await bcryptjs.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, email: user.email, firstName: user.first_name } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============= LESSONS ROUTES =============
app.get('/api/lessons', authenticateToken, async (req, res) => {
  try {
    const { level } = req.query;
    let query = 'SELECT * FROM lessons WHERE is_published = true';
    const params = [];

    if (level) {
      query += ' AND level = $1';
      params.push(level);
    }

    query += ' ORDER BY order_in_level ASC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/lessons/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM lessons WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/lessons/:id/complete', authenticateToken, async (req, res) => {
  try {
    const { score } = req.body;
    const xpEarned = Math.min(score, 100);

    await pool.query(
      'INSERT INTO user_lessons (user_id, lesson_id, completed_at, xp_earned, is_completed) VALUES ($1, $2, NOW(), $3, true) ON CONFLICT DO NOTHING',
      [req.user.id, req.params.id, xpEarned]
    );

    await pool.query(
      'UPDATE users SET xp_total = xp_total + $1 WHERE id = $2',
      [xpEarned, req.user.id]
    );

    res.json({ xpEarned });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============= USERS ROUTES =============
app.get('/api/users/stats', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT xp_total, streak FROM users WHERE id = $1',
      [req.user.id]
    );

    const lessonsResult = await pool.query(
      'SELECT COUNT(*) FROM user_lessons WHERE user_id = $1 AND is_completed = true',
      [req.user.id]
    );

    const callsResult = await pool.query(
      'SELECT COUNT(*) FROM calls WHERE (user_a_id = $1 OR user_b_id = $1) AND completed_at IS NOT NULL',
      [req.user.id]
    );

    const user = result.rows[0];
    res.json({
      xpTotal: user.xp_total,
      lessonsCompleted: parseInt(lessonsResult.rows[0].count),
      callsTotal: parseInt(callsResult.rows[0].count),
      streak: user.streak,
      badges: []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============= CALLS ROUTES =============
app.post('/api/calls/end', authenticateToken, async (req, res) => {
  try {
    const { duration, rating, feedback } = req.body;
    const xpEarned = Math.min(Math.floor(duration / 300) * 50, 250);

    await pool.query(
      'UPDATE users SET xp_total = xp_total + $1 WHERE id = $2',
      [xpEarned, req.user.id]
    );

    res.json({ xpEarned, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/calls/history', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM calls WHERE user_a_id = $1 OR user_b_id = $1 ORDER BY created_at DESC LIMIT 20',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============= HEALTH CHECK =============
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// ============= SOCKET.IO =============
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('search_partner', (data) => {
    const { userId, level } = data;
    connectedUsers.set(socket.id, { userId, level, status: 'searching' });

    let matched = null;
    for (const [sId, user] of connectedUsers.entries()) {
      if (sId !== socket.id && user.level === level && user.status === 'searching') {
        matched = sId;
        break;
      }
    }

    if (matched) {
      socket.emit('match_found', { partnerId: connectedUsers.get(matched).userId });
      io.to(matched).emit('match_found', { partnerId: userId });
    } else {
      socket.emit('waiting_for_partner', { message: 'Searching...' });
    }
  });

  socket.on('disconnect', () => {
    connectedUsers.delete(socket.id);
    console.log(`User disconnected: ${socket.id}`);
  });
});

// ============= ERROR HANDLING =============
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// ============= START SERVER =============
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ EnglishChat API running on port ${PORT}`);
  console.log(`📊 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL || 'postgresql://localhost/englishchat_dev'}`);
});

module.exports = server;
