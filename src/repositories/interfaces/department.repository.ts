import { Department } from '../../entities/department';

export interface DepartmentRepository {
  list(): Promise<Department[]>;
  findById(id: string): Promise<Department | null>;
  save(department: Department): Promise<Department>;
  update(department: Department): Promise<Department>;
  delete(id: string): Promise<void>;
}
