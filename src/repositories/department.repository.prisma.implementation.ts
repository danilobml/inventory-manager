import { PrismaClient } from '@prisma/client';
import { DepartmentRepository } from './interfaces/department.repository';
import { Department } from '../entities/department';
import { Product } from '../entities/product';

export class DepartmentRepositoryPrismaImplementation implements DepartmentRepository {
  private constructor(readonly prisma: PrismaClient) {}

  public static build(prisma: PrismaClient) {
    return new DepartmentRepositoryPrismaImplementation(prisma);
  }

  public async list(): Promise<Department[]> {
    try {
      const dbDepartments = await this.prisma.department.findMany({ include: { products: true } });
      const departments: Department[] = dbDepartments.map((dbDepartment) =>
        Department.with(dbDepartment.id, dbDepartment.name, dbDepartment.products as Product[]),
      );
      return departments;
    } catch (error) {
      console.error('Error in list() at DepartmentService:', error);
      throw error;
    }
  }

  public async findById(id: string): Promise<Department | null> {
    try {
      const dbDepartment = await this.prisma.department.findFirst({ where: { id }, include: { products: true } });
      if (!dbDepartment) return null;
      return Department.with(dbDepartment.id, dbDepartment.name, dbDepartment.products as Product[]);
    } catch (error) {
      console.error('Error in findById() at DepartmentService:', error);
      throw error;
    }
  }

  public async save(department: Department): Promise<Department> {
    try {
      const data = {
        id: department.id,
        name: department.name,
      };
      const newDepartment = await this.prisma.department.create({ data });
      return Department.with(newDepartment.id, newDepartment.name);
    } catch (error) {
      console.error('Error in create() at DepartmentService:', error);
      throw error;
    }
  }

  public async update(department: Department): Promise<Department> {
    try {
      const data = {
        id: department.id,
        name: department.name,
      };
      const updatedDbDepartment = await this.prisma.department.update({ where: { id: department.id }, data });
      return Department.with(updatedDbDepartment.id, updatedDbDepartment.name);
    } catch (error) {
      console.error('Error in update() at DepartmentService:', error);
      throw error;
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      await this.prisma.department.delete({ where: { id } });
    } catch (error) {
      console.error('Error in delete() at DepartmentService:', error);
      throw error;
    }
  }
}
