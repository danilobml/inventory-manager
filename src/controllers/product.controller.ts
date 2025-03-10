import { Request, Response } from 'express';
import { ProductRepositoryPrismaImplementation } from '../repositories/product.repository.prisma.implementation';
import { ProductServiceImplementation } from '../services/product.service.implementation';
import { prisma } from '../utils/prisma.util';
import { validateDepartmentIdSchema } from '../validation/department.validation';
import { ZodError } from 'zod';

export class ProductController {
  private static productService: ProductServiceImplementation;

  private constructor() {}

  public static build() {
    return new ProductController();
  }

  private static getProductService(): ProductServiceImplementation {
    if (!this.productService) {
      const productRepository = ProductRepositoryPrismaImplementation.build(prisma);
      this.productService = ProductServiceImplementation.build(productRepository);
    }
    return this.productService;
  }

  public async listProductsInInventory(req: Request, res: Response) {
    try {
      const response = await ProductController.getProductService().listInventory();
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in listProductsInInventory:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async getProductInfo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const response = await ProductController.getProductService().getProductInfo(id);
      res.status(200).json(response);
    } catch (error) {
      console.error(`Error in getProductInfo(${req.params.id}):`, error);
      res.status(404).json({ message: 'Product not found' });
    }
  }

  public async createNewProduct(req: Request, res: Response) {
    try {
      const { name, price } = req.body;
      const { departmentId } = await validateDepartmentIdSchema.parseAsync(req.body);

      const response = await ProductController.getProductService().addProduct(name, price, departmentId);
      res.status(201).json(response);
    } catch (error) {
      console.error('Error in createNewProduct:', error);
      if (error instanceof ZodError) {
        res.status(404).json({ message: `Department with the supplied id doesn't exist. Please choose a valid one.` });
      }
      res.status(400).json({ message: 'Invalid product data' });
    }
  }

  public async buyProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      const response = await ProductController.getProductService().buyProduct(id, amount);
      res.status(200).json(response);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error in buyProduct(${req.params.id}, ${req.body.amount}):`, error);
      res.status(400).json({ message: 'Purchase operation failed: ', cause: errorMessage });
    }
  }

  public async sellProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      const response = await ProductController.getProductService().sellProduct(id, amount);
      res.status(200).json(response);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error in sellProduct(${req.params.id}, ${req.body.amount}):`, error);
      res.status(400).json({ message: 'Sale operation failed: ', cause: errorMessage });
    }
  }

  public async updateProductInfo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, price } = req.body;
      const { departmentId } = await validateDepartmentIdSchema.parseAsync(req.body);

      const response = await ProductController.getProductService().updateProduct(id, name, price, departmentId ?? null);
      res.status(200).json(response);
    } catch (error: unknown) {
      console.error(`Error in updateProductInfo(${req.params.id}):`, error);
      if (error instanceof ZodError) {
        res.status(404).json({ message: `Department with the supplied id doesn't exist. Please choose a valid one.` });
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message: 'Update operation failed: ', cause: errorMessage });
    }
  }

  public async assigndepartmentToProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { departmentId } = await validateDepartmentIdSchema.parseAsync(req.body);
      const response = await ProductController.getProductService().assignDepartmentToProduct(id, departmentId!);
      res.status(200).json(response);
    } catch (error) {
      console.error(`Error in updateProductInfo(${req.params.id}):`, error);
      if (error instanceof ZodError) {
        res.status(404).json({ message: `Department with the supplied id doesn't exist. Please choose a valid one.` });
        return;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ message: 'Update operation failed: ', cause: errorMessage });
    }
  }

  public async removeProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ProductController.getProductService().removeProduct(id);
      res.status(204).send();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error in removeProduct(${req.params.id}):`, error);
      res.status(400).json({ message: 'Product deletion failed: ', cause: errorMessage });
    }
  }
}
