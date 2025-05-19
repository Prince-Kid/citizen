import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["citizen", "admin", "department_head"]).default("citizen"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().min(24).max(24),
  }),
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
    role: z.enum(["citizen", "admin", "department_head"]).optional(),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().min(24).max(24),
  }),
});
