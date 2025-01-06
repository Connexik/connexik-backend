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

export const sendMessageValidation = [
  body('message_id')
    .isString().withMessage('Message Id Id is required')
    .notEmpty(),

  body('content')
    .isString().withMessage('Content is required')
    .notEmpty(),

  body('content_type')
    .isString().withMessage('Message Type is required')
    .notEmpty(),

  body('content_url')
    .optional(),

  body('group_id')
    .isNumeric()
    .optional(),

  validate
]
