import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';
import { generalLimiter } from './middleware/rateLimit.middleware.js';

const app = express();

// 1. Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow custom CDNs and assets
    crossOriginEmbedderPolicy: false
  })
);

// 2. CORS Configuration - Fully permissive for all Vercel domains, localhost, and custom origins
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all origins dynamically (reflects incoming Origin header)
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Set-Cookie']
  })
);

// Explicit Preflight Handler
app.options('*', cors());

// 3. Request Logging (Morgan)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// 4. Body & Cookie Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 5. Apply General Rate Limiter
app.use('/api', generalLimiter);

// 6. Mount Master API Routes on both /api and root / for total client URL compatibility
app.use('/api', routes);
app.use('/', routes);

// 8. 404 & Centralized Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
