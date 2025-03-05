import { PrismaClient } from "@prisma/client";
import { ProductRepository } from "./interfaces/product.repository";
import { Product } from "../entities/product";

export class ProductRepositoryPrismaImplementation implements ProductRepository {

    private constructor(readonly prisma: PrismaClient) {}

    public static build(prisma: PrismaClient) {
        return new ProductRepositoryPrismaImplementation(prisma);
    }

    public async list(): Promise<Product[]> {
        const dbProducts = await this.prisma.product.findMany();

        const listProducts = dbProducts.map(dbProduct => Product.with(dbProduct.id, dbProduct.name, dbProduct.price, dbProduct.quantity))

        return listProducts;
    }

    public async findById(id: string): Promise<Product | null> {
        const dbProduct = await this.prisma.product.findUnique({
            where: { id }
        })

        if (!dbProduct) {
            return null;
        }

        const product = Product.with(dbProduct.id, dbProduct.name, dbProduct.price, dbProduct.quantity);

        return product;
    }

    public async save(product: Product): Promise<Product> {
        const data = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity
        }
        const newDbProduct = await this.prisma.product.create({data})

        const newProduct = Product.with(newDbProduct.id, newDbProduct.name, newDbProduct.price, newDbProduct.quantity);

        return newProduct;
    }

    public async update(product: Product): Promise<Product> {
        const data = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity
        }

        const updatedDbProduct = await this.prisma.product.update({
            where: { id: product.id },
            data
        })

        const updatedProduct = Product.with(updatedDbProduct.id, updatedDbProduct.name, updatedDbProduct.price, updatedDbProduct.quantity);

        return updatedProduct;
    }

    public async delete(id: string): Promise<void> {
        await this.prisma.product.delete({
            where: { id }
        })
    }
}