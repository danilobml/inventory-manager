import { User } from '../../entities/user';

export interface AuthRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
