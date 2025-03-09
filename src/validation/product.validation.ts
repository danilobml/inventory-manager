import { z } from 'zod';

export const createUpdateProductSchema = z.object({
  name: z.string().min(1, 'must have at least one character.'),
  price: z.number().positive('must be greater than 0.'),
  departmentId: z.string().uuid().min(1).optional(),
});

export const buySellProductSchema = z.object({
  amount: z.number().int().positive('must be positive and integer.'),
});

export const assignDepartmentToProductSchema = z.object({
  departmentId: z.string().uuid().min(1, 'must have at least one character.'),
});
