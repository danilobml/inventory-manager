import bcrypt from 'bcrypt';

import { SALT_ROUNDS } from './constants.util';

export async function hashPassword(password: string, saltRounds: number = SALT_ROUNDS): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
}
