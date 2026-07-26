import { z } from 'zod';

export const googleAuthSchema = z.object({
  body: z.record(z.any()),
});

export const updateRoleSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
  body: z.object({
    role: z.string().min(1, 'Role must be specified'),
  }),
});

export const updateStatusSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
  body: z.object({
    status: z.string().min(1, 'Status must be specified'),
  }),
});
