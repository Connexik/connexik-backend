import path from 'node:path';
import fs from 'node:fs';
import * as dotenv from 'dotenv';
import logUtils from '@utils/log.utils';
import { ENVIRONMENT } from './constants/common.constants';

const Log = logUtils.processor('config/index.ts');

// Check if .env file exists
const envPath = path.join(__dirname, '/../../dynamic/.env');
if (fs.existsSync(envPath)) {
  // Load environment variables
  const result = dotenv.config({ path: envPath });

  if (result.error) {
    Log.error(new Error('Error loading .env file'));
    process.exit();
  }
}

const final = {
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10), // PostgreSQL default port
    username: process.env.DB_USER ?? 'postgres', // PostgreSQL default user
    password: process.env.DB_PASS ?? '',
    database: process.env.DB_NAME ?? 'connexik-db'
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    username: process.env.REDIS_USER ?? '',
    password: process.env.REDIS_PASS ?? '',
    database: parseInt(process.env.REDIS_DB_NAME ?? '0', 10)
  },
  postgres_db_url: '',
  environment: process.env.ENVIRONMENT || ENVIRONMENT.LOCAL,
  gemini_api_key: process.env.GEMINI_API_KEY,
  linkedin_client_secret: process.env.LINKEDIN_CLIENT_SECRET,
  linkedin_client_id: process.env.LINKEDIN_CLIENT_ID,
  jwt_secret: process.env.JWT_SECRET
}

final.postgres_db_url = `postgresql://${final.db.username}:${final.db.password}@${final.db.host}:${final.db.port}/${final.db.database}`;

export default final;
