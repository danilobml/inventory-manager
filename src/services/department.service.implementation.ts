import { DepartmentDto } from '../dtos/department.dto';
import { ProductDto } from '../dtos/product.dto';
import { Department } from '../entities/department';
import { DepartmentRepository } from '../repositories/interfaces/department.repository';
import { DepartmentService } from './interfaces/department.service';

export class DepartmentServiceImplementation implements DepartmentService {
  private constructor(readonly departmentRepository: DepartmentRepository) {}

  public static build(departmentRepository: DepartmentRepository) {
    return new DepartmentServiceImplementation(departmentRepository);
  }

  public async listDepartments(): Promise<DepartmentDto[]> {
    try {
      const departmentList = await this.departmentRepository.list();
      const departmentDtoList: DepartmentDto[] = departmentList.map((department) => {
        return {
          id: department.id,
          name: department.name,
        };
      });
      return departmentDtoList;
    } catch (error) {
      console.error(`Error in listDepartments():`, error);
      throw error;
    }
  }

  public async createNewDepartment(name: string): Promise<DepartmentDto> {
    try {
      const newDepartment = await this.departmentRepository.save(Department.build(name));

      const newDepartmentDto: DepartmentDto = {
        id: newDepartment.id,
        name: newDepartment.name,
      };

      return newDepartmentDto;
    } catch (error) {
      console.error(`Error in createNewDepartment():`, error);
      throw error;
    }
  }

  public async updateDepartment(id: string, name: string): Promise<DepartmentDto> {
    try {
      const departmentToUpdate = await this.departmentRepository.findById(id);
      if (!departmentToUpdate) throw new Error('Department not found');

      const departmentWithUpdates = Department.with(id, name, departmentToUpdate.products);

      const updatedDepartment = await this.departmentRepository.update(departmentWithUpdates);

      const updatedDepartmentDto: DepartmentDto = {
        id: updatedDepartment.id,
        name: updatedDepartment.name,
      };

      return updatedDepartmentDto;
    } catch (error) {
      console.error(`Error in updateDepartment():`, error);
      throw error;
    }
  }

  public async removeDepartment(id: string): Promise<void> {
    try {
      await this.departmentRepository.delete(id);
    } catch (error) {
      console.error(`Error in removeDepartment():`, error);
      throw error;
    }
  }

  public async getDepartmentProducts(id: string): Promise<ProductDto[]> {
    try {
      const department = await this.departmentRepository.findById(id);
      if (!department) throw new Error('Department not found');

      const departmentProducts = department.products;
      if (departmentProducts.length === 0) return [];

      const departmentProductDtos: ProductDto[] = departmentProducts.map((product) => {
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          balance: product.quantity,
        };
      });

      return departmentProductDtos;
    } catch (error) {
      console.error(`Error in getDepartmentProducts():`, error);
      throw error;
    }
  }
}
