import type { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });

    return;
  }

  next();
};

export const getUsersValidator = [
  body('name').isString(),
  validate
];
