import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './env.js';
import { corsOptions } from './security.js';

interface ParseError extends SyntaxError {
  body?: string;
  status?: number;
}

export function configureApp(app: express.Application): void {
  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    dnsPrefetchControl: true,
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    hsts: true,
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW,
    max: env.RATE_LIMIT_MAX,
    message: { error: true, message: 'Too many requests, please try again later.' }
  });
  app.use(limiter);

  // Basic middleware
  app.use(express.json({ limit: '10kb' })); // Limit payload size
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cors(corsOptions));

  // JSON parsing error handler
  app.use((err: ParseError, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
      return res.status(400).json({
        error: true,
        message: 'Invalid JSON',
        details: err.message
      });
    }
    next();
  });

  // Request logging in development
  if (env.NODE_ENV === 'development') {
    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      next();
    });
  }

  // Request timeout handler
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Set timeout to 30 seconds
    const TIMEOUT = 30000;
    
    res.setTimeout(TIMEOUT, () => {
      res.status(408).json({
        error: true,
        message: 'Request timeout',
        details: `Request exceeded ${TIMEOUT}ms limit`
      });
    });
    next();
  });

  // Trust proxy if behind a reverse proxy
  if (env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }
}