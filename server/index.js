require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/planner',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        username VARCHAR(255) PRIMARY KEY,
        password_hash VARCHAR(255) NOT NULL
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS workspaces (
        username VARCHAR(255) PRIMARY KEY REFERENCES users(username) ON DELETE CASCADE,
        workspace_data JSONB NOT NULL DEFAULT '{}'::jsonb
      );
    `);
    console.log("Database initialized");
  } catch (err) {
    console.error("Failed to initialize database", err);
  }
}
initDb();

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-weekly-key';

const INITIAL_WORKSPACE = {
  my: { timeSlots: [], week: { Sunday: {}, Monday: {}, Tuesday: {}, Wednesday: {}, Thursday: {}, Friday: {}, Saturday: {} } },
  partner: { timeSlots: [], week: { Sunday: {}, Monday: {}, Tuesday: {}, Wednesday: {}, Thursday: {}, Friday: {}, Saturday: {} } },
  settings: {
    title: "Weekly Planner",
    subtitle: "Of my MadOm 🎀 Content creator",
    myTab: "💕 My Routine",
    partnerTab: "💝 Partner"
  }
};

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });
  
  try {
    const userRes = await pool.query('SELECT username FROM users WHERE username = $1', [username]);
    if (userRes.rows.length > 0) return res.status(400).json({ error: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    
    await pool.query('INSERT INTO users(username, password_hash) VALUES($1, $2)', [username, passwordHash]);
    await pool.query('INSERT INTO workspaces(username, workspace_data) VALUES($1, $2)', [username, JSON.stringify(INITIAL_WORKSPACE)]);

    const token = jwt.sign({ username }, JWT_SECRET);
    res.json({ token, username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });
  
  try {
    const userRes = await pool.query('SELECT password_hash FROM users WHERE username = $1', [username]);
    if (userRes.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ username }, JWT_SECRET);
    res.json({ token, username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.username = decoded.username;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', async (socket) => {
  const username = socket.username;
  console.log(`User connected: ${username} (${socket.id})`);

  try {
    const res = await pool.query('SELECT workspace_data FROM workspaces WHERE username = $1', [username]);
    let workspace = res.rows.length > 0 ? res.rows[0].workspace_data : null;

    if (!workspace) {
      workspace = JSON.parse(JSON.stringify(INITIAL_WORKSPACE));
      await pool.query('INSERT INTO workspaces(username, workspace_data) VALUES($1, $2)', [username, workspace]);
    } else if (!workspace.settings) {
      workspace.settings = INITIAL_WORKSPACE.settings;
      await pool.query('UPDATE workspaces SET workspace_data = $1 WHERE username = $2', [workspace, username]);
    }

    socket.emit('initial-state', workspace);
    socket.join(`workspace_${username}`);

    socket.on('db-action', async (data) => {
      try {
        const { user, type, payload } = data;
        
        const wsRes = await pool.query('SELECT workspace_data FROM workspaces WHERE username = $1', [username]);
        if (wsRes.rows.length === 0) return;
        const currentWorkspace = wsRes.rows[0].workspace_data;

        if (!currentWorkspace || !currentWorkspace[user]) return;

        if (type === 'update-task') {
          const { day, time, task } = payload;
          if (currentWorkspace[user].week[day]) {
            if (task === null) delete currentWorkspace[user].week[day][time];
            else currentWorkspace[user].week[day][time] = task;
          }
        } else if (type === 'add-slot') {
          if (!currentWorkspace[user].timeSlots.includes(payload.time)) {
            currentWorkspace[user].timeSlots.push(payload.time);
          }
        } else if (type === 'remove-slot') {
          currentWorkspace[user].timeSlots = currentWorkspace[user].timeSlots.filter(t => t !== payload.time);
          Object.keys(currentWorkspace[user].week).forEach(day => {
            delete currentWorkspace[user].week[day][payload.time];
          });
        } else if (type === 'update-settings') {
          currentWorkspace.settings = payload;
        }
        
        await pool.query('UPDATE workspaces SET workspace_data = $1 WHERE username = $2', [currentWorkspace, username]);

        socket.to(`workspace_${username}`).emit('state-changed', data);
      } catch (err) {
        console.error("Action error", err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${username} (${socket.id})`);
    });
  } catch (err) {
    console.error("Socket connection error", err);
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
