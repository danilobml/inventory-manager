import { SellResponseDto } from "../../dtos/sell-response.dto";
import { BuyResponseDto } from "../../dtos/buy-response.dto";
import { ListResponseDto } from "../../dtos/list-response.dto";
import { AddProductResponseDto } from "../../dtos/add-product-response.dto";
import { ProductDto } from "../../dtos/product.dto";

export interface ProductService {
    listInventory(): Promise<ListResponseDto>;
    getProductInfo(id: string): Promise<ProductDto>
    sellProduct(id: string, amount: number): Promise<SellResponseDto>;
    buyProduct(id: string, amount: number): Promise<BuyResponseDto>;
    addProduct(name: string, price: number): Promise<AddProductResponseDto>;
    removeProduct(id: string): Promise<void>;
}
