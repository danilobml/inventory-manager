export interface AuthService {
  registerUser(email: string, password: string): Promise<string>;
  checkCredentials(email: string, password: string): Promise<string>;
}
