import { AuthServiceImplementation } from '../services/auth.service.implementation';
import { AuthRepository } from '../repositories/interfaces/auth.repository';
import { User } from '../entities/user';
import { generateJwt } from '../utils/jwt.util';
import { comparePasswords } from '../utils/bcrypt.util';

jest.mock('../utils/jwt.util', () => ({
  generateJwt: jest.fn(() => 'mocked-jwt-token'),
}));

jest.mock('../utils/bcrypt.util', () => ({
  comparePasswords: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthServiceImplementation;
  let authRepositoryMock: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    authRepositoryMock = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;

    authService = AuthServiceImplementation.build(authRepositoryMock);
  });

  test('should register a new user and return a JWT', async () => {
    authRepositoryMock.findByEmail.mockResolvedValue(null);
    authRepositoryMock.save.mockResolvedValue(undefined);

    const token = await authService.registerUser('test@example.com', 'password123');

    expect(authRepositoryMock.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(authRepositoryMock.save).toHaveBeenCalled();
    expect(generateJwt).toHaveBeenCalled();
    expect(token).toBe('mocked-jwt-token');
  });

  test('should throw error if user already exists', async () => {
    authRepositoryMock.findByEmail.mockResolvedValue(User.with('123', 'test@example.com', 'hashed'));

    await expect(authService.registerUser('test@example.com', 'password123')).rejects.toThrow('User already exists');
  });

  test('should return a JWT when credentials are valid', async () => {
    authRepositoryMock.findByEmail.mockResolvedValue(User.with('123', 'test@example.com', 'hashed'));
    (comparePasswords as jest.Mock).mockResolvedValue(true);

    const token = await authService.checkCredentials('test@example.com', 'password123');

    expect(authRepositoryMock.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(comparePasswords).toHaveBeenCalledWith('password123', 'hashed');
    expect(generateJwt).toHaveBeenCalledWith('123');
    expect(token).toBe('mocked-jwt-token');
  });

  test('should throw an error if user does not exist', async () => {
    authRepositoryMock.findByEmail.mockResolvedValue(null);

    await expect(authService.checkCredentials('test@example.com', 'password123')).rejects.toThrow('User not found');
  });

  test('should throw an error if password is incorrect', async () => {
    authRepositoryMock.findByEmail.mockResolvedValue(User.with('123', 'test@example.com', 'hashed'));
    (comparePasswords as jest.Mock).mockResolvedValue(false);

    await expect(authService.checkCredentials('test@example.com', 'wrongpassword')).rejects.toThrow('Unauthorized');
  });
});
