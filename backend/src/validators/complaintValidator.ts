import { z } from "zod";

export const complaintSchema = z.object({
  body: z.object({
    category: z.string().min(1, "Category is required"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    email: z.string().email("Invalid email address"),
  }),
});
