import request from 'supertest';

import { ApiExpress } from '../../src/api/api.express';
import { AuthController } from '../../src/controllers/auth.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { authSchema } from '../../src/validation/auth.validation';
import { AuthServiceImplementation } from '../../src/services/auth.service.implementation';

jest.mock('../../src/services/auth.service.implementation');

const api = ApiExpress.build();
const version = api.version;
const apiBaseRoute = `/api/${version}`;
const authBaseRoute = 'auth';
const authController = AuthController.build();

api.addPostRoute(`${apiBaseRoute}/${authBaseRoute}/register`, validateRequest(authSchema), authController.register);
api.addPostRoute(`${apiBaseRoute}/${authBaseRoute}/login`, validateRequest(authSchema), authController.login);

describe('Auth Controller Integration Tests', () => {
  let server: any;
  let authService: jest.Mocked<AuthServiceImplementation>;

  beforeAll(() => {
    authService = {
      registerUser: jest.fn().mockResolvedValue('mocked-token'),
      checkCredentials: jest.fn().mockResolvedValue('mocked-token'),
    } as unknown as jest.Mocked<AuthServiceImplementation>;

    AuthServiceImplementation.build = jest.fn().mockReturnValue(authService);
    server = api.app;
  });

  describe('POST /auth/register', () => {
    test('should register a new user and return a token', async () => {
      const response = await request(server)
        .post(`${apiBaseRoute}/${authBaseRoute}/register`)
        .send({ email: 'test@example.com', password: 'password123' });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token', 'mocked-token');
    });

    test('should return 400 for invalid request payload', async () => {
      const response = await request(server)
        .post(`${apiBaseRoute}/${authBaseRoute}/register`)
        .send({ email: 'invalid-email', password: '' });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toContain('[Request validation] email not a valid e-mail');
      expect(response.body.errors).toContain('[Request validation] password must have at least 6 characters');
    });
  });

  describe('POST /auth/login', () => {
    test('should authenticate user and return token', async () => {
      const response = await request(server)
        .post(`${apiBaseRoute}/${authBaseRoute}/login`)
        .send({ email: 'user@example.com', password: 'password123' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', 'mocked-token');
    });

    test('should return 400 for invalid credentials', async () => {
      authService.checkCredentials.mockRejectedValue(new Error('Invalid credentials'));
      const response = await request(server)
        .post(`${apiBaseRoute}/${authBaseRoute}/login`)
        .send({ email: 'wronguser@example.com', password: 'wrongpassword' });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('cause', 'Username and/or password invalid.');
    });
  });
});
