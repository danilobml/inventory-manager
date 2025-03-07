import { ProductServiceImplementation } from '../services/product.service.implementation';
import { ProductRepository } from '../repositories/interfaces/product.repository';
import { Product } from '../entities/product';
import { ProductDto } from '../dtos/product.dto';
import { SellResponseDto } from '../dtos/sell-response.dto';
import { BuyResponseDto } from '../dtos/buy-response.dto';
import { ListResponseDto } from '../dtos/list-response.dto';
import { AddProductResponseDto } from '../dtos/add-product-response.dto';

describe('Product Service', () => {
  let productService: ProductServiceImplementation;
  let productRepositoryMock: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    productRepositoryMock = {
      list: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    productService = ProductServiceImplementation.build(productRepositoryMock);
  });

  test('should list all products, in the form of ProductDto', async () => {
    const product1 = Product.build('Test1', 20);
    const product2 = Product.build('Test2', 25);
    const product1dto: ProductDto = {
      id: product1.id,
      name: product1.name,
      price: product1.price,
      balance: product1.quantity,
    };
    const product2dto: ProductDto = {
      id: product2.id,
      name: product2.name,
      price: product2.price,
      balance: product2.quantity,
    };
    productRepositoryMock.list.mockResolvedValue([product1, product2]);

    const result = await productService.listInventory();

    expect(productRepositoryMock.list).toHaveBeenCalled();
    expect(result.products).toEqual([product1dto, product2dto]);
  });

  test('should return product details when product exists', async () => {
    const product = Product.build('TestProduct', 30);
    productRepositoryMock.findById.mockResolvedValue(product);

    const result = await productService.getProductInfo(product.id);

    expect(productRepositoryMock.findById).toHaveBeenCalledWith(product.id);
    expect(result).toEqual({ id: product.id, name: product.name, price: product.price, balance: product.quantity });
  });

  test('should throw error when product not found', async () => {
    productRepositoryMock.findById.mockResolvedValue(null);

    await expect(productService.getProductInfo('invalid_id')).rejects.toThrow('Product with id invalid_id not found');
  });

  test('should successfully sell a product', async () => {
    const product = Product.build('TestProduct', 30);
    product.sell = jest.fn();
    productRepositoryMock.findById.mockResolvedValue(product);
    productRepositoryMock.update.mockResolvedValue(product);

    const result = await productService.sellProduct(product.id, 5);

    expect(product.sell).toHaveBeenCalledWith(5);
    expect(productRepositoryMock.update).toHaveBeenCalledWith(product);
    expect(result).toEqual({ id: product.id, balance: product.quantity });
  });

  test('should throw error when selling a non-existent product', async () => {
    productRepositoryMock.findById.mockResolvedValue(null);

    await expect(productService.sellProduct('invalid_id', 5)).rejects.toThrow('Product with id invalid_id not found');
  });

  test('should successfully buy a product', async () => {
    const product = Product.build('TestProduct', 30);
    product.increaseQuantityInStock = jest.fn();
    productRepositoryMock.findById.mockResolvedValue(product);
    productRepositoryMock.update.mockResolvedValue(product);

    const result = await productService.buyProduct(product.id, 5);

    expect(product.increaseQuantityInStock).toHaveBeenCalledWith(5);
    expect(productRepositoryMock.update).toHaveBeenCalledWith(product);
    expect(result).toEqual({ id: product.id, balance: product.quantity });
  });

  test('should throw error when buying a non-existent product', async () => {
    productRepositoryMock.findById.mockResolvedValue(null);

    await expect(productService.buyProduct('invalid_id', 5)).rejects.toThrow('Product with id invalid_id not found');
  });

  test('should add a product successfully', async () => {
    const product = Product.build('NewProduct', 40);
    productRepositoryMock.save.mockResolvedValue(product);

    const result = await productService.addProduct('NewProduct', 40);

    expect(productRepositoryMock.save).toHaveBeenCalled();
    expect(result).toEqual({ id: product.id, balance: product.quantity });
  });

  test('should remove a product successfully', async () => {
    productRepositoryMock.delete.mockResolvedValue();

    await productService.removeProduct('valid_id');

    expect(productRepositoryMock.delete).toHaveBeenCalledWith('valid_id');
  });

  test('should throw error when removing a non-existent product', async () => {
    productRepositoryMock.delete.mockRejectedValue(new Error('Product not found'));

    await expect(productService.removeProduct('invalid_id')).rejects.toThrow('Product not found');
  });
});
