import { PrismaClient } from '@prisma/client';
import { ProductRepository } from './interfaces/product.repository';
import { Product } from '../entities/product';

export class ProductRepositoryPrismaImplementation implements ProductRepository {
  private constructor(readonly prisma: PrismaClient) {}

  public static build(prisma: PrismaClient) {
    return new ProductRepositoryPrismaImplementation(prisma);
  }

  public async list(): Promise<Product[]> {
    try {
      const dbProducts = await this.prisma.product.findMany();

      const listProducts = dbProducts.map((dbProduct) =>
        Product.with(dbProduct.id, dbProduct.name, dbProduct.price, dbProduct.quantity),
      );

      return listProducts;
    } catch (error: unknown) {
      console.error('Database operation error in list():', error);
      throw error;
    }
  }

  public async findById(id: string): Promise<Product | null> {
    try {
      const dbProduct = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!dbProduct) {
        return null;
      }

      return Product.with(dbProduct.id, dbProduct.name, dbProduct.price, dbProduct.quantity);
    } catch (error: unknown) {
      console.error(`Database operation error in findById(${id}):`, error);
      throw error;
    }
  }

  public async save(product: Product): Promise<Product> {
    try {
      const data = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
      };

      const newDbProduct = await this.prisma.product.create({ data });

      return Product.with(newDbProduct.id, newDbProduct.name, newDbProduct.price, newDbProduct.quantity);
    } catch (error: unknown) {
      console.error('Database operation error in save():', error);
      throw error;
    }
  }

  public async update(product: Product): Promise<Product> {
    try {
      const data = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
      };

      const updatedDbProduct = await this.prisma.product.update({
        where: { id: product.id },
        data,
      });

      return Product.with(
        updatedDbProduct.id,
        updatedDbProduct.name,
        updatedDbProduct.price,
        updatedDbProduct.quantity,
      );
    } catch (error: unknown) {
      console.error(`Database operation error in update(${product.id}):`, error);
      throw error;
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
    } catch (error: unknown) {
      console.error(`Database operation error in delete(${id}):`, error);
      throw error;
    }
  }
}
