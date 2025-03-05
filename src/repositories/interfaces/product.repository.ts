import { Product } from "../../entities/product";

export interface ProductRepository {
    list(): Promise<Product[]>;
    findById(id: string): Promise<Product | null>;
    save(product: Product): Promise<Product>;
    update(product: Product): Promise<Product>;
    delete(id: string): Promise<void>;
}
