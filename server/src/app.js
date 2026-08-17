import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { connectDB } from './config/db.js';
import { initializePassport } from './config/passport.js';
import authRoutes from './routes/auth.js';
import employeesRoutes from './routes/employees.js';
import paymentsRoutes from './routes/payments.js';
import hiresRoutes from './routes/hires.js';
import agentRoutes from './routes/agent.js';

const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// Passport (Google OAuth — no sessions, JWT only)
initializePassport();
app.use(passport.initialize());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/** Health-check — also confirms the Mongo connection is alive. */
app.get('/api/health', async (_req, res) => {
  try {
    await connectDB();
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'error', db: 'disconnected', message: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/hires', hiresRoutes);
app.use('/api/agent', agentRoutes);

export default app;
