import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';

import config from './config';
import logger from './utils/logger';
import authRoutes from './modules/auth/auth.routes';
import venueRoutes from './modules/venues/venue.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { apiLimiter, authLimiter } from './middleware/rate-limit.middleware';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = config.port;

// Security middleware
app.use(helmet());
app.use(
    cors({
        origin: config.clientUrl,
        credentials: true,
    })
);

// Body parsing middleware - increased limit for base64 images
// Base64 encoding increases size by ~33%, so 5MB images become ~6.7MB
// Setting limit to 50MB to handle multiple large images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);

// Request logging
app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });
    next();
});

// Routes
app.get('/', (_req, res) => {
    res.json({
        message: 'VenueHub API',
        version: '1.0.0',
        status: 'running',
    });
});

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
httpServer.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📝 Environment: ${config.nodeEnv}`);
    logger.info(`🌐 Client URL: ${config.clientUrl}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    httpServer.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    httpServer.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

export default app;
