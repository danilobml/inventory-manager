import { DepartmentServiceImplementation } from '../services/department.service.implementation';
import { DepartmentRepository } from '../repositories/interfaces/department.repository';
import { Department } from '../entities/department';
import { DepartmentDto } from '../dtos/department.dto';
import { Product } from '../entities/product';

describe('Department service', () => {
  let departmentService: DepartmentServiceImplementation;
  let mockDepartmentRepository: jest.Mocked<DepartmentRepository>;

  beforeEach(() => {
    mockDepartmentRepository = {
      list: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<DepartmentRepository>;

    departmentService = DepartmentServiceImplementation.build(mockDepartmentRepository);
  });

  test('should return a list of departments as DepartmentDtos', async () => {
    const department1 = Department.build('TestDepartment1');
    const department2 = Department.build('TestDepartment2');
    const department1Dto: DepartmentDto = { id: department1.id, name: department1.name };
    const department2Dto: DepartmentDto = { id: department2.id, name: department2.name };
    mockDepartmentRepository.list.mockResolvedValue([department1, department2]);

    const result = await departmentService.listDepartments();

    expect(mockDepartmentRepository.list).toHaveBeenCalled();
    expect(result).toEqual([department1Dto, department2Dto]);
  });

  test('should create a new department successfully when all parameters are correct', async () => {
    const department = Department.build('NewDepartment');
    mockDepartmentRepository.save.mockResolvedValue(department);

    const result = await departmentService.createNewDepartment('NewDepartment');

    expect(mockDepartmentRepository.save).toHaveBeenCalled();
    expect(result).toEqual({ id: department.id, name: department.name });
  });

  test('should throw an error when trying to create a department with an invalid name', async () => {
    mockDepartmentRepository.save.mockRejectedValue(new Error('Invalid department name'));

    await expect(departmentService.createNewDepartment('')).rejects.toThrow('Invalid department name');
  });

  test('should update an existing department successfully', async () => {
    const department = Department.build('ExistingDepartment');
    mockDepartmentRepository.findById.mockResolvedValue(department);
    const changedDepartment = Department.with(department.id, 'UpdatedDepartment');
    mockDepartmentRepository.update.mockResolvedValue(changedDepartment);

    const result = await departmentService.updateDepartment(department.id, 'UpdatedDepartment');

    expect(mockDepartmentRepository.findById).toHaveBeenCalledWith(department.id);
    expect(mockDepartmentRepository.update).toHaveBeenCalled();
    expect(result).toEqual({ id: department.id, name: 'UpdatedDepartment' });
  });

  test('should throw an error when trying to update a non-existent department', async () => {
    mockDepartmentRepository.findById.mockResolvedValue(null);

    await expect(departmentService.updateDepartment('invalid_id', 'UpdatedName')).rejects.toThrow(
      'Department not found',
    );
  });

  test('should delete a department successfully', async () => {
    mockDepartmentRepository.delete.mockResolvedValue();

    await departmentService.removeDepartment('valid_id');

    expect(mockDepartmentRepository.delete).toHaveBeenCalledWith('valid_id');
  });

  test('should throw an error when trying to delete a non-existent department', async () => {
    mockDepartmentRepository.delete.mockRejectedValue(new Error('Department not found'));

    await expect(departmentService.removeDepartment('invalid_id')).rejects.toThrow('Department not found');
  });

  test('should return department products when department exists', async () => {
    const department = Department.with('dep-id', 'ExistingDepartment', [
      Product.with('p1', 'Product1', 10, 5, 'dep-id'),
    ]);
    mockDepartmentRepository.findById.mockResolvedValue(department);

    const result = await departmentService.getDepartmentProducts(department.id);

    expect(mockDepartmentRepository.findById).toHaveBeenCalledWith(department.id);
    expect(result).toEqual([{ id: 'p1', name: 'Product1', price: 10, balance: 5 }]);
  });

  test('should return an empty array when department has no products', async () => {
    const department = Department.build('EmptyDepartment');
    mockDepartmentRepository.findById.mockResolvedValue(department);

    const result = await departmentService.getDepartmentProducts(department.id);

    expect(result).toEqual([]);
  });

  test('should throw an error when trying to get products of a non-existent department', async () => {
    mockDepartmentRepository.findById.mockResolvedValue(null);

    await expect(departmentService.getDepartmentProducts('invalid_id')).rejects.toThrow('Department not found');
  });
});
