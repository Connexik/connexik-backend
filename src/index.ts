import express, {
  type Request,
  type Response,
  type NextFunction
} from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';

import logUtils from '@utils/log.utils';
import router from '@api/index.routes';
import { asyncHandler } from './utils/async-handler.utils';

const app = express();
const PORT = process.env.PORT ?? '3000';

const logger = logUtils.processor('index.ts');

// Enable CORS with desired configuration
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);

      // const allowedOrigins = [
      //   'https://linkedin.com',
      //   'https://www.linkedin.com'
      // ];
      // if (!origin || allowedOrigins.includes(origin)) {
      //   callback(null, true); // Allow the request
      // } else {
      //   callback(new Error('Not allowed by CORS')); // Block the request
      // }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
  })
);

// Middlewares
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(asyncHandler(compression()));
app.use(logUtils.middleware);

// Health Check
app.get('/health-check', (_req: Request, res: Response) => {
  res.status(200).send({ message: 'Service is up!' });
});

// Routes
app.use('/', router);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error(err); // Using your logger for better logging

  const statusCode = 500;
  const errorMessage = err.message || 'An internal server error occurred';

  res.status(statusCode).json({
    status: statusCode,
    message: errorMessage
  });
});

// 404 Handler
app.all('*', (_req: Request, res: Response) => {
  res.status(404).send({ message: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
