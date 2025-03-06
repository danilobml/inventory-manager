import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3001;
export const ALLOWED_CORS_ORIGINS = process.env.ALLOWED_CORS_ORIGINS?.split(',') || ['*'];
export const JWT_SECRET = process.env.JWT_SECRET;
export const SALT_ROUNDS = 10;
export const TOKEN_EXPIRATION_TIME = '1h';
