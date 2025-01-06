import path from 'node:path';
import fs from 'node:fs';
import * as dotenv from 'dotenv';
import logUtils from '@utils/log.utils';

const Log = logUtils.processor('config/index.ts');

// Check if .env file exists
const envPath = path.join(__dirname, '/../../dynamic/.env');
if (!fs.existsSync(envPath)) {
  Log.error(new Error('Env File not found!'));
  process.exit();
}

// Load environment variables
const result = dotenv.config({ path: envPath });

if (result.error) {
  Log.error(new Error('Error loading .env file'));
  process.exit();
}

const final = {
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASS ?? '',
    database: process.env.DB_NAME ?? 'dev_jobolo_db'
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    username: process.env.REDIS_USER ?? '',
    password: process.env.REDIS_PASS ?? '',
    database: parseInt(process.env.REDIS_DB_NAME ?? '0', 10)
  },
  environment: process.env.ENVIRONMENT,
}

process.env.MYSQL_DATABASE_URL = `mysql://${final.db.username}:${final.db.password}@${final.db.host}:${final.db.port}/${final.db.database}`;

export default final;
