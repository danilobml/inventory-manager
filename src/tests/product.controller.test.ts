import request from 'supertest';
import { ApiExpress } from '../../src/api/api.express';
import { ProductController } from '../../src/controllers/product.controller';
import { ProductServiceImplementation } from '../../src/services/product.service.implementation';
import { validateRequest } from '../../src/middleware/validate.middleware';
import { createUpdateProductSchema, buySellProductSchema } from '../../src/validation/product.validation';
import { ProductDto } from '../../src/dtos/product.dto';

jest.mock('../../src/services/product.service.implementation');

const api = ApiExpress.build();
const version = api.version;
const apiBaseRoute = `/api/${version}`;
const productsBaseRoute = 'products';
const productController = ProductController.build();

api.addGetRoute(`${apiBaseRoute}/${productsBaseRoute}`, productController.listProductsInInventory);
api.addGetRoute(`${apiBaseRoute}/${productsBaseRoute}/:id`, productController.getProductInfo);
api.addPostRoute(
  `${apiBaseRoute}/${productsBaseRoute}`,
  validateRequest(createUpdateProductSchema),
  productController.createNewProduct,
);
api.addPostRoute(
  `${apiBaseRoute}/${productsBaseRoute}/:id/buy`,
  validateRequest(buySellProductSchema),
  productController.buyProduct,
);
api.addPostRoute(
  `${apiBaseRoute}/${productsBaseRoute}/:id/sell`,
  validateRequest(buySellProductSchema),
  productController.sellProduct,
);
api.addPutRoute(
  `${apiBaseRoute}/${productsBaseRoute}/:id`,
  validateRequest(createUpdateProductSchema),
  productController.updateProductInfo,
);
api.addDeleteRoute(`${apiBaseRoute}/${productsBaseRoute}/:id`, productController.removeProduct);

describe('Products Controller Integration Tests', () => {
  let server: any;
  let productService: jest.Mocked<ProductServiceImplementation>;
  let product1: ProductDto;
  let product2: ProductDto;

  beforeAll(() => {
    product1 = { id: '1', name: 'Test Product1', price: 100, balance: 10 };
    product2 = { id: '2', name: 'Test Product2', price: 90, balance: 7 };
    productService = {
      listInventory: jest.fn().mockResolvedValue({ products: [product1, product2] }),
      getProductInfo: jest.fn().mockResolvedValue(product1),
      addProduct: jest.fn().mockResolvedValue({ id: '3', balance: 10 }),
      buyProduct: jest.fn().mockResolvedValue({ id: '1', balance: 15 }),
      sellProduct: jest.fn().mockResolvedValue({ id: '1', balance: 5 }),
      updateProduct: jest.fn().mockResolvedValue({ id: '1', name: 'Updated Product1', price: 120, balance: 10 }),
      removeProduct: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<ProductServiceImplementation>;

    ProductServiceImplementation.build = jest.fn().mockReturnValue(productService);
    server = api.app;
  });

  describe('GET /products', () => {
    test('should return a list of products in the inventory as ProductDto', async () => {
      const response = await request(server).get(`${apiBaseRoute}/${productsBaseRoute}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('products');
      expect(response.body.products).toEqual([product1, product2]);
    });
  });

  describe('POST /products/:id/buy', () => {
    test('should increase product balance', async () => {
      const response = await request(server).post(`${apiBaseRoute}/${productsBaseRoute}/1/buy`).send({ amount: 5 });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('balance', 15);
    });
  });

  describe('POST /products/:id/sell', () => {
    test('should decrease product balance', async () => {
      const response = await request(server).post(`${apiBaseRoute}/${productsBaseRoute}/1/sell`).send({ amount: 5 });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('balance', 5);
    });
  });

  describe('PUT /products/:id', () => {
    test('should update product information', async () => {
      const response = await request(server)
        .put(`${apiBaseRoute}/${productsBaseRoute}/1`)
        .send({ name: 'Updated Product1', price: 120 });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Product1');
    });
  });

  describe('POST /products', () => {
    test('should return 400 for invalid product data', async () => {
      const response = await request(server)
        .post(`${apiBaseRoute}/${productsBaseRoute}`)
        .send({ name: '', price: -10 });
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /products/:id', () => {
    test('should remove product successfully', async () => {
      const response = await request(server).delete(`${apiBaseRoute}/${productsBaseRoute}/1`);
      expect(response.status).toBe(204);
    });

    test('should return 400 when product does not exist', async () => {
      productService.removeProduct.mockRejectedValue(new Error('Product not found'));
      const response = await request(server).delete(`${apiBaseRoute}/${productsBaseRoute}/999`);
      expect(response.status).toBe(400);
    });
  });
});
