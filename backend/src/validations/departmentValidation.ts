import { z } from "zod";

export const createDepartmentSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(50),
    description: z.string().min(10).max(500),
    head: z.string().min(24).max(24),
    contactEmail: z.string().email(),
    contactPhone: z.string().min(10).max(15),
  }),
});

export const updateDepartmentSchema = z.object({
  params: z.object({
    id: z.string().min(24).max(24),
  }),
  body: z.object({
    name: z.string().min(3).max(50).optional(),
    description: z.string().min(10).max(500).optional(),
    head: z.string().min(24).max(24).optional(),
    contactEmail: z.string().email().optional(),
    contactPhone: z.string().min(10).max(15).optional(),
  }),
});

export const getDepartmentSchema = z.object({
  params: z.object({
    id: z.string().min(24).max(24),
  }),
});

export const listDepartmentsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});
