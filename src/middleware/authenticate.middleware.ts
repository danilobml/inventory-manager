import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util';
import { JWT_SECRET } from '../utils/constants.util';

export type AuthenticationMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const authenticateRoute: AuthenticationMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Unauthorized - No token provided' });
      return;
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET!) as { userId: string };
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized - Invalid or expired token' });
      return;
    }

    const user = await prisma.user.findFirst({ where: { id: payload.userId } });

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
};
