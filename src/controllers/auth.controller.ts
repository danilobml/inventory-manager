import { Request, Response } from 'express';
import { AuthRepositoryPrismaImplementation } from '../repositories/auth.repository.prisma.implementation';
import { AuthService } from '../services/interfaces/auth.service';
import { AuthServiceImplementation } from '../services/auth.service.implementation';
import { prisma } from '../utils/prisma.util';

export class AuthController {
  private static authService: AuthService;

  private constructor() {}

  public static build() {
    return new AuthController();
  }

  private static getAuthService(): AuthService {
    if (!this.authService) {
      const authRepository = AuthRepositoryPrismaImplementation.build(prisma);
      return AuthServiceImplementation.build(authRepository);
    }
    return this.authService;
  }

  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const token = await AuthController.getAuthService().checkCredentials(email, password);
      res.status(200).json({ token });
    } catch (error) {
      console.error(`Login failed(${req.body.email}, password):`, error);
      res.status(400).json({
        message: 'Login failed: ',
        cause: 'Username and/or password invalid.',
      });
    }
  }

  public async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const token = await AuthController.getAuthService().registerUser(email, password);
      res.status(201).json({ token });
    } catch (error) {
      console.error(`User registration failed(${req.body.email}, password):`, error);
      res.status(400).json({
        message: 'User registration failed: ',
        cause: 'Username and/or password invalid.',
      });
    }
  }
}
