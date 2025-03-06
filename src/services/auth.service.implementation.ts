import { User } from '../entities/user';
import { AuthRepository } from '../repositories/interfaces/auth.repository';
import { AuthService } from './interfaces/auth.service';
import { comparePasswords } from '../utils/bcrypt.util';
import { generateJwt } from '../utils/jwt.util';

export class AuthServiceImplementation implements AuthService {
  private constructor(readonly authRepository: AuthRepository) {}

  public static build(authRepository: AuthRepository) {
    return new AuthServiceImplementation(authRepository);
  }

  public async registerUser(email: string, password: string): Promise<string> {
    try {
      let user = await this.authRepository.findByEmail(email);
      if (user) {
        throw Error('User already exists');
      }

      user = User.build(email, password);
      await this.authRepository.save(user);

      const jwt = generateJwt(user.id);

      return jwt;
    } catch (error) {
      console.error('Error in registerUser():', error);
      throw error;
    }
  }

  public async checkCredentials(email: string, password: string): Promise<string> {
    try {
      const user = await this.authRepository.findByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      const isUserAuthorized = await comparePasswords(password, user.password);
      if (!isUserAuthorized) {
        throw new Error('Unauthorized');
      }

      return generateJwt(user.id);
    } catch (error) {
      console.error('Error in checkCredentials():', error);
      throw error;
    }
  }
}
