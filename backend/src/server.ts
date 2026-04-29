import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Load env variables
dotenv.config();

const app: Application = express();

// Trust proxy for reverse proxy (Apache/Nginx)
// This is required for express-rate-limit and X-Forwarded-* headers to work correctly
// behind a reverse proxy. Apache will forward requests with proper headers.
app.set('trust proxy', true);


// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // List of allowed origins (with and without trailing slash)
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://events.yooreed.com.tn',
      'https://events.yooreed.com.tn/', // With trailing slash
      process.env.FRONTEND_URL,
      process.env.FRONTEND_URL?.replace(/\/$/, ''), // Without trailing slash if provided with
      process.env.FRONTEND_URL?.replace(/\/$/, '') + '/', // With trailing slash if provided without
    ].filter(Boolean); // Remove undefined/null values

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Normalize origin (remove trailing slash for comparison)
    const normalizedOrigin = origin.replace(/\/$/, '');

    // Check if origin matches any allowed origin (normalized)
    const isAllowed = allowedOrigins.some(allowed => {
      if (!allowed) return false;
      const normalizedAllowed = allowed.replace(/\/$/, '');
      return normalizedOrigin === normalizedAllowed;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api', apiLimiter);

// Middleware to ensure database connection (backup/retry mechanism)
// This ensures DB connection even if initial connection failed during startup
app.use('/api', async (req, res, next): Promise<void> => {
  const connectionState = mongoose.connection.readyState;
  console.log(`🔍 API request to ${req.path}, DB state: ${connectionState}`);
  
  if (connectionState !== 1) {
    // Not connected, try to connect
    console.log('⚠️ Database not connected, attempting connection...');
    try {
      await connectDB();
      console.log('✅ Database connection established in middleware');
    } catch (error: any) {
      console.error('❌ Database connection error in middleware:', error?.message || error);
      res.status(503).json({
        success: false,
        error: 'Database connection failed',
        message: 'Unable to connect to database. Please try again.',
      });
      return;
    }
  }
  next();
});

// Health check endpoints
// /health for reverse proxy monitoring and health checks (required)
app.get('/health', (_req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Yooreed Event API is running',
    timestamp: new Date().toISOString(),
  });
});

// /api/health for detailed health check (includes DB status)
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Yooreed Event API is running',
    mongodb: {
      state: mongoose.connection.readyState,
      stateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
      database: mongoose.connection.name,
      host: mongoose.connection.host,
    }
  });
});

// Database diagnostic endpoint
app.get('/api/debug/db', async (_req, res) => {
  try {
    const { Product } = await import('./models/Product.js');
    const { Category } = await import('./models/Category.js');
    
    const productCount = await Product.countDocuments({});
    const categoryCount = await Category.countDocuments({});
    const sampleProducts = await Product.find({}).limit(5).select('nom categorie');
    
    res.json({
      success: true,
      mongodb: {
        state: mongoose.connection.readyState,
        stateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
        database: mongoose.connection.name,
        host: mongoose.connection.host,
      },
      collections: {
        products: {
          total: productCount,
          sample: sampleProducts,
        },
        categories: {
          total: categoryCount,
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

// Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import eventServiceRoutes from './routes/eventServiceRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/event-services', eventServiceRoutes);

// Error handling
app.use(errorHandler);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database connection and server startup logic
// This backend runs as a standalone Node.js process behind an Apache reverse proxy
// The server listens on localhost (127.0.0.1) and Apache proxies external traffic to it

// Initialize database connection
const initializeApp = async (): Promise<void> => {
  try {
    await connectDB();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    if (error instanceof Error) {
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
    }
    // In production, don't exit immediately - let the process manager (PM2) handle restarts
    // The middleware will handle DB connection retries per request as fallback
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw error; // Re-throw for caller to handle
  }
};

// Start the server
// Port: process.env.PORT if defined, otherwise fallback to 4000
// HOST configuration:
// - Production: 127.0.0.1 (localhost only) for security - only Apache reverse proxy should access it
// - Development: 0.0.0.0 (all interfaces) to allow local development and testing
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const isProduction = process.env.NODE_ENV === 'production';
const HOST = isProduction ? '127.0.0.1' : '0.0.0.0'; // localhost only in production, all interfaces in dev

initializeApp()
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on http://${HOST}:${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Health check: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/health`);
      if (isProduction) {
        console.log(`🔌 Ready to receive requests from Apache reverse proxy`);
      } else {
        console.log(`🔧 Development mode: Server accessible from all network interfaces`);
      }
    });
  })
  .catch((error) => {
    console.error('❌ Failed to start server:', error);
    // Exit with error code so process manager (PM2) can restart
    process.exit(1);
  });

// Export app (for potential module imports, though not required for standalone operation)
export default app;
