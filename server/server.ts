import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import blotterRoutes from './routes/blotters.js';
import userRoutes from './routes/users.js';
import geographyRoutes from './routes/geography.js';
import exportRoutes from './routes/export.js';
import auditRoutes from './routes/audit.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env['CORS_ORIGIN'] || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/blotters', blotterRoutes);
app.use('/api/users', userRoutes);
app.use('/api/geography', geographyRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/audit', auditRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use(errorHandler);

const PORT = process.env['PORT'] || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
