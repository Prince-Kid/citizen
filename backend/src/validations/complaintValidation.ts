import { z } from "zod";

export const createComplaintSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(1000),
    category: z.string().min(3).max(50),
    location: z.object({
      type: z.literal("Point"),
      coordinates: z.array(z.number()).length(2),
    }),
    attachments: z.array(z.string()).optional(),
  }),
});

export const updateComplaintSchema = z.object({
  params: z.object({
    id: z.string().min(24).max(24),
  }),
  body: z.object({
    status: z
      .enum(["pending", "in_progress", "resolved", "rejected"])
      .optional(),
    assignedTo: z.string().min(24).max(24).optional(),
    resolution: z.string().min(10).max(1000).optional(),
  }),
});

export const getComplaintSchema = z.object({
  params: z.object({
    id: z.string().min(24).max(24),
  }),
});

export const listComplaintsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z
      .enum(["pending", "in_progress", "resolved", "rejected"])
      .optional(),
    category: z.string().optional(),
  }),
});
