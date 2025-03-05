import { SellResponseDto } from "../../dtos/sell-response.dto";
import { BuyResponseDto } from "../../dtos/buy-response.dto";
import { ListResponseDto } from "../../dtos/list-response.dto";
import { AddProductResponseDto } from "../../dtos/add-product-response.dto";

export interface ProductService {
    sellProduct(id: string, amount: number): Promise<SellResponseDto>;
    buyProduct(id: string, amount: number): Promise<BuyResponseDto>;
    listInventory(): Promise<ListResponseDto>
    addProduct(name: string, price: number): Promise<AddProductResponseDto>
}
