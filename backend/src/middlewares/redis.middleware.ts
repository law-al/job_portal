import type { Request, Response, NextFunction } from 'express';
import type { SetOptions } from 'redis';
import { redisIsOpen, requestToKey, getRedisData, setRedisData } from '../utils/redis.js';

const redisCacheMiddleware = (options: SetOptions = { EX: 21600 }) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (redisIsOpen()) {
      try {
        const key = requestToKey(req);
        console.log(key);

        const cachedValue = await getRedisData(key);
        if (cachedValue) {
          try {
            // if cached value is stringified
            return res.status(200).json(JSON.parse(cachedValue));
          } catch {
            return res.status(200).json(cachedValue);
          }
        } else {
          // if i don't do this, res.send will be altered
          const oldSend = res.send;
          // alter res.send and pass to the next middlware in line
          res.send = function (data) {
            res.send = oldSend;

            if (res.statusCode.toLocaleString().startsWith('2')) {
              setRedisData({ key, data, options }).then();
            }

            return res.send(data); // =  oldSend(data)
          };

          next();
        }
      } catch (error) {
        console.log('Error from redis middleware', error);
        throw error;
      }
    } else {
      next();
    }
  };
};

export default redisCacheMiddleware;
