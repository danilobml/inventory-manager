import { PrismaClient } from '@prisma/client';

import { AuthRepository } from './interfaces/auth.repository';
import { User } from '../entities/user';
import { hashPassword } from '../utils/bcrypt.util';

export class AuthRepositoryImplementation implements AuthRepository {
  private constructor(readonly prisma: PrismaClient) {}

  public static build(prisma: PrismaClient) {
    return new AuthRepositoryImplementation(prisma);
  }

  public async findByEmail(email: string): Promise<User | null> {
    try {
      const dbUser = await this.prisma.user.findFirst({
        where: { email },
      });
      if (!dbUser) {
        return null;
      }
      const user = User.with(dbUser.id, dbUser.email, dbUser.password);
      return user;
    } catch (error) {
      console.error('Login error - user with email: ', email);
      throw error;
    }
  }

  public async save(user: User): Promise<void> {
    try {
      const data = {
        id: user.id,
        email: user.email,
        password: await hashPassword(user.password),
      };
      await this.prisma.user.create({ data });
    } catch (error) {
      console.error('Register error.');
      throw error;
    }
  }
}
