import Redis from 'ioredis';
import RedisMock from 'ioredis-mock';

import config from '@config';
import { ENVIRONMENT } from './constants/common.constants';

import Seed from '@config/seed'

let redisInstance: Redis;
if (config.environment === ENVIRONMENT.DEVELOPMENT) {
  redisInstance = new RedisMock({
    data: Seed.redis
  });
} else {
  redisInstance = new Redis({
    port: config.redis.port,
    host: config.redis.host,
    username: config.redis.username,
    password: config.redis.password,
    db: config.redis.database
  });
}

export default redisInstance;
