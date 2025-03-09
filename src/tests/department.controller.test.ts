import request from 'supertest';
import { ApiExpress } from '../../src/api/api.express';
import { DepartmentController } from '../../src/controllers/department.controller';
import { DepartmentServiceImplementation } from '../../src/services/department.service.implementation';
import { validateRequest } from '../../src/middleware/validate.middleware';
import { createUpdateDepartmentSchema } from '../../src/validation/department.validation';
import { DepartmentDto } from '../../src/dtos/department.dto';

jest.mock('../../src/services/department.service.implementation');

const api = ApiExpress.build();
const version = api.version;
const apiBaseRoute = `/api/${version}`;
const departmentsBaseRoute = 'departments';
const departmentController = DepartmentController.build();

api.addGetRoute(`${apiBaseRoute}/${departmentsBaseRoute}`, departmentController.getAllDepartments);
api.addPostRoute(
  `${apiBaseRoute}/${departmentsBaseRoute}`,
  validateRequest(createUpdateDepartmentSchema),
  departmentController.createDepartment,
);
api.addPutRoute(
  `${apiBaseRoute}/${departmentsBaseRoute}/:id`,
  validateRequest(createUpdateDepartmentSchema),
  departmentController.updateDepartment,
);
api.addDeleteRoute(`${apiBaseRoute}/${departmentsBaseRoute}/:id`, departmentController.removeDepartment);
api.addGetRoute(`${apiBaseRoute}/${departmentsBaseRoute}/:id/products`, departmentController.getDepartmentProducts);

describe('Department Controller Integration Tests', () => {
  let server: any;
  let departmentService: jest.Mocked<DepartmentServiceImplementation>;
  let department1: DepartmentDto;
  let department2: DepartmentDto;

  beforeAll(() => {
    department1 = { id: '1', name: 'Test Department1' };
    department2 = { id: '2', name: 'Test Department2' };
    departmentService = {
      listDepartments: jest.fn().mockResolvedValue([department1, department2]),
      createNewDepartment: jest.fn().mockResolvedValue({ id: '3', name: 'New Department' }),
      updateDepartment: jest.fn().mockResolvedValue({ id: '1', name: 'Updated Department' }),
      removeDepartment: jest.fn().mockResolvedValue(undefined),
      getDepartmentProducts: jest.fn().mockResolvedValue([]),
    } as unknown as jest.Mocked<DepartmentServiceImplementation>;

    DepartmentServiceImplementation.build = jest.fn().mockReturnValue(departmentService);
    server = api.app;
  });

  describe('GET /departments', () => {
    test('should return a list of departments as DepartmentDto', async () => {
      const response = await request(server).get(`${apiBaseRoute}/${departmentsBaseRoute}`);

      console.log('🔍 Actual API Response:', response.body);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([department1, department2]);
    });

    test('should return an empty list when no departments exist', async () => {
      departmentService.listDepartments.mockResolvedValue([]);
      const response = await request(server).get(`${apiBaseRoute}/${departmentsBaseRoute}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /departments', () => {
    test('should create a new department successfully', async () => {
      const response = await request(server)
        .post(`${apiBaseRoute}/${departmentsBaseRoute}`)
        .send({ name: 'New Department' });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'New Department');
    });

    test('should return 400 when name is missing', async () => {
      const response = await request(server).post(`${apiBaseRoute}/${departmentsBaseRoute}`).send({});
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /departments/:id', () => {
    test('should update department information', async () => {
      const response = await request(server)
        .put(`${apiBaseRoute}/${departmentsBaseRoute}/1`)
        .send({ name: 'Updated Department' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Department');
    });

    test('should return 400 when updating a non-existing department', async () => {
      departmentService.updateDepartment.mockRejectedValue(new Error('Department not found'));
      const response = await request(server)
        .put(`${apiBaseRoute}/${departmentsBaseRoute}/999`)
        .send({ name: 'Updated Department' });
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /departments/:id', () => {
    test('should remove department successfully', async () => {
      const response = await request(server).delete(`${apiBaseRoute}/${departmentsBaseRoute}/1`);
      expect(response.status).toBe(204);
    });

    test('should return 400 when department does not exist', async () => {
      departmentService.removeDepartment.mockRejectedValue(new Error('Department not found'));
      const response = await request(server).delete(`${apiBaseRoute}/${departmentsBaseRoute}/999`);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /departments/:id/products', () => {
    test('should return products for a department', async () => {
      departmentService.getDepartmentProducts.mockResolvedValue([
        { id: '10', name: 'Test Product', price: 100.5, balance: 10 },
      ]);
      const response = await request(server).get(`${apiBaseRoute}/${departmentsBaseRoute}/1/products`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: '10', name: 'Test Product', price: 100.5, balance: 10 }]);
    });

    test('should return 400 when department does not exist', async () => {
      departmentService.getDepartmentProducts.mockRejectedValue(new Error('Department not found'));
      const response = await request(server).get(`${apiBaseRoute}/${departmentsBaseRoute}/999/products`);
      expect(response.status).toBe(400);
    });
  });
});
