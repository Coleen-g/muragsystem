require('dotenv').config();

const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const { connectDB } = require('./src/config/db');

const startVaccinationReminderJob = require('./src/utils/vaccinationReminder');

const app = express();
const server = http.createServer(app); // ← wrap app in http server

// Connect to MongoDB
connectDB();

// Start cron jobs
startVaccinationReminderJob();

// Middlewares
app.use(helmet());

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8081',
  ...(process.env.ALLOWED_ORIGINS?.split(',') || []),
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ─── Socket.IO Setup ───────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

const { registerSocketUser, removeSocketUser } = require('./src/controllers/notifications.controller');

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join', ({ userId, role }) => {  // ← now accepts role too
    socket.join(userId);
    registerSocketUser(userId, role);        // ← register with role
    console.log(`User ${userId} (${role}) joined room`);
  });

  socket.on('disconnect', () => {
    // Note: you'd need to track socketId→userId to remove properly
    console.log('Socket disconnected:', socket.id);
  });
});
// Make io accessible in all controllers via req.app.get('io')
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});
// ───────────────────────────────────────────────────────────────────

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',          require('./src/routes/auth.routes'));
app.use('/api/users',         require('./src/routes/user.routes'));
app.use('/api/cases',         require('./src/routes/case.routes'));
app.use('/api/patients',      require('./src/routes/patient.routes'));
app.use('/api/vaccinations',  require('./src/routes/vaccination.routes'));
app.use('/api/animals',       require('./src/routes/animal.routes'));
app.use('/api/activity',      require('./src/routes/activityLog.routes'));
app.use('/api/chat',          require('./src/routes/chatbot.routes'));
app.use('/api/notifications', require('./src/routes/notifications.routes'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

// ← Use server.listen instead of app.listen
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));