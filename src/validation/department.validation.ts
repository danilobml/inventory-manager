import { z } from 'zod';
import { prisma } from '../utils/prisma.util';

export const createUpdateDepartmentSchema = z.object({
  name: z.string().min(1),
});

export const validateDepartmentIdSchema = z.object({
  departmentId: z
    .string()
    .uuid()
    .optional()
    .refine(
      async (id) => {
        // Ok if null:
        if (!id) return true;
        // Else must be in DB:
        const department = await prisma.department.findUnique({
          where: { id },
        });
        return !!department;
      },
      {
        message: 'Department ID does not exist in the database.',
      },
    ),
});

export const validateDepartmentNameSchema = z.object({
  name: z.string().refine(
    async (name) => {
      const department = await prisma.department.findUnique({
        where: { name },
      });
      return !department;
    },
    {
      message: 'Department with this name already exists in the database.',
    },
  ),
});
