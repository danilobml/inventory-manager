import { ProductService } from './interfaces/product.service';
import { ProductRepository } from '../repositories/interfaces/product.repository';
import { SellResponseDto } from '../dtos/sell-response.dto';
import { BuyResponseDto } from '../dtos/buy-response.dto';
import { ListResponseDto } from '../dtos/list-response.dto';
import { ProductDto } from '../dtos/product.dto';
import { AddProductResponseDto } from '../dtos/add-product-response.dto';
import { Product } from '../entities/product';

export class ProductServiceImplementation implements ProductService {
  private constructor(readonly productRepository: ProductRepository) {}

  public static build(productRepository: ProductRepository) {
    return new ProductServiceImplementation(productRepository);
  }

  public async listInventory(): Promise<ListResponseDto> {
    try {
      const productList = await this.productRepository.list();
      const productDtoList: ProductDto[] = productList.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        balance: product.quantity,
      }));

      return { products: productDtoList };
    } catch (error) {
      console.error('Error in listInventory():', error);
      throw error;
    }
  }

  public async getProductInfo(id: string): Promise<ProductDto> {
    try {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new Error(`Product with id ${id} not found`);
      }

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        balance: product.quantity,
      };
    } catch (error) {
      console.error(`Error in getProductInfo(${id}):`, error);
      throw error;
    }
  }

  public async sellProduct(id: string, amount: number): Promise<SellResponseDto> {
    try {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new Error(`Product with id ${id} not found`);
      }

      product.sell(amount);
      const soldProduct = await this.productRepository.update(product);

      return { id: soldProduct.id, balance: soldProduct.quantity };
    } catch (error) {
      console.error(`Error in sellProduct(${id}, ${amount}):`, error);
      throw error;
    }
  }

  public async buyProduct(id: string, amount: number): Promise<BuyResponseDto> {
    try {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new Error(`Product with id ${id} not found`);
      }

      product.increaseQuantityInStock(amount);
      const updatedProduct = await this.productRepository.update(product);

      return { id: updatedProduct.id, balance: updatedProduct.quantity };
    } catch (error) {
      console.error(`Error in buyProduct(${id}, ${amount}):`, error);
      throw error;
    }
  }

  public async addProduct(name: string, price: number): Promise<AddProductResponseDto> {
    try {
      const newProduct = await this.productRepository.save(Product.build(name, price));
      return { id: newProduct.id, balance: newProduct.quantity };
    } catch (error) {
      console.error('Error in addProduct():', error);
      throw error;
    }
  }

  public async updateProduct(id: string, name: string, price: number): Promise<ProductDto> {
    try {
      const productToUpdate = await this.productRepository.findById(id);
      if (!productToUpdate) {
        throw new Error('Product not found');
      }

      const productWithUpdates = Product.with(
        productToUpdate.id,
        name || productToUpdate.name,
        price || productToUpdate.price,
        productToUpdate.quantity,
      );

      const updatedProduct = await this.productRepository.update(productWithUpdates);

      const updatedProductDto: ProductDto = {
        id: updatedProduct.id,
        name: updatedProduct.name,
        price: updatedProduct.price,
        balance: updatedProduct.quantity,
      };

      return updatedProductDto;
    } catch (error) {
      console.error('Error in addProduct():', error);
      throw error;
    }
  }

  public async removeProduct(id: string): Promise<void> {
    try {
      await this.productRepository.delete(id);
    } catch (error) {
      console.error(`Error in removeProduct(${id}):`, error);
      throw error;
    }
  }
}
