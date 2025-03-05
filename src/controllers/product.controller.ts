import { Request, Response } from "express";

import { ProductRepositoryPrismaImplementation } from "../repositories/product.repository.implementation";
import { ProductServiceImplementation } from "../services/product.service.implementation";
import { prisma } from "../utils/prisma.util";


export class ProductController {

    private constructor() { }

    public static build() {
        return new ProductController();
    }

    public async createNewProduct(req: Request, res: Response) {
        const { name, price } = req.body;

        const productRepository = ProductRepositoryPrismaImplementation.build(prisma);
        const productService = ProductServiceImplementation.build(productRepository);

        const response = await productService.addProduct(name, price);

        res.status(201).json(response).send();
    }

    public async listProductsInInventory(req: Request, res: Response) {
        const productRepository = ProductRepositoryPrismaImplementation.build(prisma);
        const productService = ProductServiceImplementation.build(productRepository);

        const response = await productService.listInventory();

        res.status(200).json(response).send();
    }

    public async buyProduct(req: Request, res: Response) {
        const { id } = req.params;
        const { amount } = req.body;

        const productRepository = ProductRepositoryPrismaImplementation.build(prisma);
        const productService = ProductServiceImplementation.build(productRepository);

        const response = await productService.buyProduct(id, amount);

        res.status(200).json(response).send();
    }

    public async sellProduct(req: Request, res: Response) {
        const { id } = req.params;
        const { amount } = req.body;

        const productRepository = ProductRepositoryPrismaImplementation.build(prisma);
        const productService = ProductServiceImplementation.build(productRepository);

        const response = await productService.sellProduct(id, amount);

        res.status(200).json(response).send();
    }
}
