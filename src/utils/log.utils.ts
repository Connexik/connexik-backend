import { type Request, type Response, type NextFunction } from 'express';

const middleware = (req: Request, res: Response, next: NextFunction): void => {
  console.log({
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query,
    method: req.method,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });

  next();
};

interface Log {
  info: (data: any, method?: string) => void
  error: (data: any, method?: string) => void
};

const processor = (module: string): Log => ({
  info: (data: any, method: string = 'root') => { console.info(module, method, '-----', data); },
  error: (data: any, method: string = 'root') => { console.error('Module - ', module, ' | Method - ', method, ' | Data - ', data); }
});

export default {
  middleware,
  processor
};
