import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives par IP
  message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  // Trust proxy is configured in server.ts for reverse proxy (Apache) support
  validate: {
    trustProxy: false,
  },
  skip: (_req) => {
    // Skip rate limiting in test environment
    return process.env.NODE_ENV === 'test';
  },
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par IP
  standardHeaders: true,
  legacyHeaders: false,
  // Trust proxy is configured in server.ts for reverse proxy (Apache) support
  // Apache forwards X-Forwarded-* headers, and we trust them in server.ts
  validate: {
    trustProxy: false,
  },
  skip: (_req) => {
    // Skip rate limiting in test environment
    return process.env.NODE_ENV === 'test';
  },
});

