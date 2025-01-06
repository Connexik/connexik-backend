import { PrismaClient } from '@prisma/client';
import Config from '../../config';

// Initialize Prisma Client with connection pooling
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Log levels
  datasources: {
    db: {
      url: `mysql://${Config.db.username}:${Config.db.password}@${Config.db.host}:${Config.db.port}/${Config.db.database}`
    }
  }
});

export default prisma;
