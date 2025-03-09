import { SellResponseDto } from '../../dtos/sell-response.dto';
import { BuyResponseDto } from '../../dtos/buy-response.dto';
import { ListProductsResponseDto } from '../../dtos/list-product-response.dto';
import { AddProductResponseDto } from '../../dtos/add-product-response.dto';
import { ProductDto } from '../../dtos/product.dto';
import { AssignDepartmentResponseDto } from '../../dtos/assign-department-response.dto';

export interface ProductService {
  listInventory(): Promise<ListProductsResponseDto>;
  getProductInfo(id: string): Promise<ProductDto>;
  sellProduct(id: string, amount: number): Promise<SellResponseDto>;
  buyProduct(id: string, amount: number): Promise<BuyResponseDto>;
  addProduct(name: string, price: number, departmendId?: string): Promise<AddProductResponseDto>;
  updateProduct(id: string, name: string, price: number, departmendId: string | null): Promise<ProductDto>;
  assignDepartmentToProduct(id: string, departmentId: string): Promise<AssignDepartmentResponseDto>;
  removeProduct(id: string): Promise<void>;
}
