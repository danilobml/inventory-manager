import { Product } from "../../entities/product";

export interface ProductRepository {
    list(): Promise<Product[]>;
    findById(id: string): Promise<Product>;
    save(product: Product): Promise<void>;
    update(product: Product): Promise<Product>;
    delete(id: string): Promise<void>;
}
