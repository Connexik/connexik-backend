import { PrismaClient } from '@prisma/client';
import Config from '../../config';

// Initialize Prisma Client with connection pooling
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Log levels
  datasources: {
    db: {
      url: Config.postgres_db_url
    }
  }
});

export default prisma;
