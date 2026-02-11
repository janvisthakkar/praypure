import { z } from 'zod';

export const BaseQRCodeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  content: z.string().min(1, 'Content is required').max(2000, 'Content too long'),
  type: z.enum(['url', 'text', 'email', 'phone'])
});

export const QRCodeCreateSchema = BaseQRCodeSchema;

export const QRCodeSchema = BaseQRCodeSchema.extend({
  _id: z.string(),
  created: z.string(), // API returns ISO string
  updated: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active').optional(),
  scans: z.array(z.any()).default([])
});

export const QRCodeFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['url', 'text', 'email', 'phone'])
});

export const QRCodeUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  content: z.string().min(1, 'Content is required').max(2000, 'Content too long').optional(),
  status: z.enum(['active', 'inactive']).optional()
});

export type QRCodeType = z.infer<typeof QRCodeSchema>;
export type QRCodeCreateType = z.infer<typeof QRCodeCreateSchema>;
export type QRCodeFormType = z.infer<typeof QRCodeFormSchema>;
export type QRCodeUpdateType = z.infer<typeof QRCodeUpdateSchema>;