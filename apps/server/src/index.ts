import express, { type Express } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { env } from './config/env.js';
import { authRoutes } from './modules/auth/index.js';
import { followsRoutes } from './modules/follows/index.js';
import { usersRoutes } from './modules/users/index.js';
import { errorHandler, notFoundHandler } from './middleware/index.js';

const app: Express = express();
const httpServer = createServer(app);

// Socket.IO setup (for future real-time features)
const io = new SocketServer(httpServer, {
    cors: {
        origin: env.CORS_ORIGIN,
        methods: ['GET', 'POST'],
    },
});

// Middleware
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/follows', followsRoutes);
app.use('/api/users', usersRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Socket.IO connection handling (placeholder for Phase 1)
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

// Start server
httpServer.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
    console.log(`📡 Socket.IO ready`);
    console.log(`🔧 Environment: ${env.NODE_ENV}`);
});

export { app, io, httpServer };
