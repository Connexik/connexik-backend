import { CODE } from '@config/constants/common.constants';
import { type Response } from 'express';

const success = (res: Response, payload: object, status: number = CODE.SUCCESS, message: string = 'Success'): Response => {
  return res.status(status).json({
    status,
    message,
    payload
  });
};

const error = (res: Response, payload: Error | object, status: number = CODE.BAD_REQUEST, message: string = 'Error'): Response => {
  return res.status(status).json({
    status,
    message,
    payload
  });
}

export default {
  success,
  error
}
