import jwt from 'jsonwebtoken';
import config from '@/config';

const JWT_SECRET = config.jwt_secret;

export const generateToken = (authUserId: string): string => {
  return jwt.sign({ authUserId }, JWT_SECRET, { expiresIn: '365d' });
};

export const verifyToken = (token: string): { authUserId: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { authUserId: string };
    return decoded;
  } catch (err) {
    return null;
  }
};
