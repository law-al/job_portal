import { Redis } from 'ioredis';
import redis, { type SetOptions } from 'redis';
import config from '../config/config.js';
import hash from 'object-hash';
import logger from './logger.js';
import type { Request } from 'express';

interface SetOption {
  key: string;
  data: string;
  options?: SetOptions;
}

const { redisHostName, redisPort, redisURI } = config;

const redisClient = redis.createClient({
  url: `${redisURI}`,
});

const requestToKey = (req: Request) => {
  const reqToHash = {
    query: req.query,
    params: req.params,
    body: req.body,
  };

  const path = req.originalUrl.replace(/^\/api\/v\d+\//, '');

  return `${path}@${hash.sha1(reqToHash)}`;
};

const connectRedis = async () => {
  try {
    redisClient.on('error', (err) => {
      throw err;
    });

    await redisClient.connect();

    console.log('connected to reddis');
  } catch (error) {
    console.log('Redis Error ', error);
    process.exit(1);
  }
};

const redisIsOpen = () => {
  return !!redisClient?.isOpen;
};

const setRedisData = async ({ key, data, options }: SetOption) => {
  if (redisIsOpen()) {
    try {
      await redisClient.set(key, data, options);
    } catch (error) {
      logger.error('Redis error', error);
      throw error;
    }
  }
};

const getRedisData = async (key: string) => {
  let cachedValue = undefined;
  if (redisIsOpen()) {
    try {
      cachedValue = await redisClient.get(key);
      if (cachedValue) {
        return cachedValue;
      }
    } catch (error) {
      logger.error('Redis error', error);
      throw error;
    }
  }
};

const deleteRedisData = async (tag: string) => {
  if (redisIsOpen()) {
    try {
      const keys = await redisClient.keys(`${tag}:*`);

      if (keys.length > 0) {
        await redisClient.del(keys);
        console.log(`${keys} deleted from redis`);
      }
    } catch (error) {
      console.log('Difficulty deleteing keys from redis', error);
      throw error;
    }
  }
};

const connection = new Redis({
  host: `${redisHostName}`,
  port: +redisPort,
  maxRetriesPerRequest: null,
});

export { connection, connectRedis, redisIsOpen, setRedisData, getRedisData, deleteRedisData, requestToKey };
