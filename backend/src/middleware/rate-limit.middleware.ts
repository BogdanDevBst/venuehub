import rateLimit from 'express-rate-limit';
import config from '../config';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.nodeEnv === 'development' ? 1000 : 100, // More lenient in dev
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});

// Stricter rate limiter for auth routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.nodeEnv === 'development' ? 100 : 5, // More lenient in dev
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts, please try again later.',
});

// Payment routes limiter
export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 payment requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many payment requests, please try again later.',
});
