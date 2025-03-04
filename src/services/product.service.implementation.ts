import { ProductService } from "./interfaces/product.service";
import { SellResponseDto } from "../dtos/sell-response.dto";
import { BuyResponseDto } from "../dtos/buy-response.dto";
import { ListResponseDto } from "../dtos/list-response.dto";
import { ProductRepository } from "../repositories/interfaces/product.repository";
import { ProductDto } from "../dtos/product.dto";

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
        
        await this.productRepository.update(product)

        const response: SellResponseDto = {
            id: product.id,
            balance: product.quantity
        }

        return response;
    }
    
    public async buyProduct(id: string, amount: number): Promise<BuyResponseDto> {
        const product = await this.productRepository.findById(id);
        if(!product) {
            throw new Error(`Product with id ${id} not found`);
        }

        product.increaseQuantityInStock(amount);

        await this.productRepository.update(product);

        const response: BuyResponseDto = {
            id: product.id,
            balance: product.quantity
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
}
