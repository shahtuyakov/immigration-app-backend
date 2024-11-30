import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { corsOptions } from './security.js';

export function configureApp(app: express.Application) {
  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors(corsOptions));
  app.use(helmet());

  // Add error handling for JSON parsing
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
      return res.status(400).json({
        error: true,
        message: 'Invalid JSON',
        details: err.message
      });
    }
    next();
  });

  // Add request logging in development
  if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
      next();
    });
  }

  // Add timeout handling
  app.use((req, res, next) => {
    res.setTimeout(30000, () => {
      res.status(408).json({
        error: true,
        message: 'Request timeout'
      });
    });
    next();
  });
}