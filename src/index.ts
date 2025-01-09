import bodyParser from 'body-parser';
import 'express-async-errors';
import compression from 'compression';
import express, { type Request, type Response, type NextFunction } from 'express';
import logUtils from '@utils/log.utils';
import router from '@api/index.routes';

const app = express();
const PORT = process.env.PORT ?? 3000;

const logger = logUtils.processor('index.ts');

// Middlewares
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(logUtils.middleware);

// Health Check
app.get('/health-check', (_req: Request, res: Response) => {
  res.status(200).send({ message: 'Service is up!' });
});

// Routes
app.use('/convexik', router);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error(err); // Using your logger for better logging

  const statusCode = 500;
  const errorMessage = err.message || 'An internal server error occurred';

  res.status(statusCode).json({
    success: false,
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
