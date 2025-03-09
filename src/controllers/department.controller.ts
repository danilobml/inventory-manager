import { Request, Response } from 'express';

import { DepartmentRepositoryPrismaImplementation } from '../repositories/department.repository.prisma.implementation';
import { DepartmentServiceImplementation } from '../services/department.service.implementation';
import { prisma } from '../utils/prisma.util';
import { validateDepartmentNameSchema } from '../validation/department.validation';
import { ZodError } from 'zod';

export class DepartmentController {
  private static departmentService: DepartmentServiceImplementation;

  private constructor() {}

  public static build() {
    return new DepartmentController();
  }

  private static getDepartmentService(): DepartmentServiceImplementation {
    if (!this.departmentService) {
      const departmentRepository = DepartmentRepositoryPrismaImplementation.build(prisma);
      this.departmentService = DepartmentServiceImplementation.build(departmentRepository);
    }
    return this.departmentService;
  }

  public async getAllDepartments(req: Request, res: Response) {
    try {
      const response = await DepartmentController.getDepartmentService().listDepartments();
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in getAllDepartments:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async createDepartment(req: Request, res: Response) {
    try {
      const { name } = await validateDepartmentNameSchema.parseAsync(req.body);
      const response = await DepartmentController.getDepartmentService().createNewDepartment(name);
      res.status(201).json(response);
    } catch (error) {
      console.error(`Error in updateProductInfo(${req.params.id}):`, error);
      if (error instanceof ZodError) {
        res.status(404).json({ message: `Department with the supplied name already exists.` });
        return;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message: 'Update operation failed: ', cause: errorMessage });
    }
  }

  public async updateDepartment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = await validateDepartmentNameSchema.parseAsync(req.body);
      const response = await DepartmentController.getDepartmentService().updateDepartment(id, name);
      res.status(200).json(response);
    } catch (error) {
      console.error(`Error in updateProductInfo(${req.params.id}):`, error);
      if (error instanceof ZodError) {
        res.status(404).json({ message: `Department with the supplied name already exists.` });
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message: 'Update operation failed: ', cause: errorMessage });
    }
  }

  public async removeDepartment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await DepartmentController.getDepartmentService().removeDepartment(id);
      res.status(204).send();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error in removeProduct(${req.params.id}):`, error);
      res.status(400).json({ message: 'Product deletion failed: ', cause: errorMessage });
    }
  }

  public async getDepartmentProducts(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const response = await DepartmentController.getDepartmentService().getDepartmentProducts(id);
      res.status(200).json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error in removeProduct(${req.params.id}):`, error);
      res.status(400).json({ message: 'Product deletion failed: ', cause: errorMessage });
    }
  }
}
