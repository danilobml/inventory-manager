import { DepartmentDto } from '../../dtos/department.dto';
import { ProductDto } from '../../dtos/product.dto';

export interface DepartmentService {
  listDepartments(): Promise<DepartmentDto[]>;
  createNewDepartment(name: string): Promise<DepartmentDto>;
  updateDepartment(id: string, name: string): Promise<DepartmentDto>;
  removeDepartment(id: string): Promise<void>;
  getDepartmentProducts(id: string): Promise<ProductDto[]>;
}
