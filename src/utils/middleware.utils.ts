// src/utils/middleware.utils.ts

import { type RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { verifyToken } from './jwt.utils';

const validate: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

const authMiddleware: RequestHandler = (req, res, next) => {
  const authorization = req.headers.authorization?.split(' ');
  if (!authorization) {
    res.status(401).json({ status: 401, message: 'Unauthorized' });
    return;
  }

  const grantType = authorization[0];
  const token = authorization[1];

  if (grantType !== 'Bearer' || !token) {
    res.status(401).json({ status: 401, message: 'Unauthorized' });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ status: 401, message: 'Unauthorized' });
    return;
  }

  req.authUserId = decoded.authUserId;
  next();
};

export default {
  validate,
  authMiddleware
};
