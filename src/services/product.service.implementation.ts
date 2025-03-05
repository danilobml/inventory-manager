import { ProductService } from "./interfaces/product.service";
import { SellResponseDto } from "../dtos/sell-response.dto";
import { BuyResponseDto } from "../dtos/buy-response.dto";
import { ListResponseDto } from "../dtos/list-response.dto";
import { ProductRepository } from "../repositories/interfaces/product.repository";
import { ProductDto } from "../dtos/product.dto";
import { AddProductResponseDto } from "../dtos/add-product-response.dto";
import { Product } from "../entities/product";

export class ProductServiceImplementation implements ProductService {

    private constructor(readonly productRepository: ProductRepository) {}

    public static build(productRepository: ProductRepository) {
        return new ProductServiceImplementation(productRepository);
    }

    public async sellProduct(id: string, amount: number): Promise<SellResponseDto> {
        const product = await this.productRepository.findById(id);
        if(!product) {
            throw new Error(`Product with id ${id} not found`);
        }

        product.sell(amount);
        
        const soldProduct = await this.productRepository.update(product)

        const response: SellResponseDto = {
            id: soldProduct.id,
            balance: soldProduct.quantity
        }

        return response;
    }
    
    public async buyProduct(id: string, amount: number): Promise<BuyResponseDto> {
        const product = await this.productRepository.findById(id);
        if(!product) {
            throw new Error(`Product with id ${id} not found`);
        }

        product.increaseQuantityInStock(amount);

        const updatedProduct = await this.productRepository.update(product);

        const response: BuyResponseDto = {
            id: updatedProduct.id,
            balance: updatedProduct.quantity
        }

        return response;
    }

    public async listInventory(): Promise<ListResponseDto> {
        const productList = await this.productRepository.list();

        const productDtoList: ProductDto[] = productList.map(product => {
            return {
                id: product.id,
                name: product.name,
                price: product.price,
                balance: product.quantity
            }
        })

        const response: ListResponseDto = {
            products: productDtoList
        }

        return response;
    }

    public async addProduct(name: string, price: number): Promise<AddProductResponseDto> {
        const newProduct = await this.productRepository.save(Product.build(name, price));
        
        const response: AddProductResponseDto = {
            id: newProduct.id,
            balance: newProduct.quantity
        }

        return response;
    }
}
