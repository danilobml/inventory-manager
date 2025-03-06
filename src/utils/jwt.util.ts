import * as jwt from 'jsonwebtoken';
import { JWT_SECRET, TOKEN_EXPIRATION_TIME } from './constants.util';

export function generateJwt(userId: string): string {
  try {
    const token = jwt.sign({ userId }, JWT_SECRET!, { expiresIn: TOKEN_EXPIRATION_TIME });
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
}
