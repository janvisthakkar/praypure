import { z } from 'zod';

// Base schemas
export const BaseQRCodeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  content: z.string().min(1, 'Content is required').max(2000, 'Content too long'),
  type: z.enum(['url', 'text', 'email', 'phone',])
});

export const ScanSchema = z.object({
  timestamp: z.date(),
  ip: z.string(),
  userAgent: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

// Extended schemas
export const QRCodeCreateSchema = BaseQRCodeSchema;

export const QRCodeSchema = BaseQRCodeSchema.extend({
  _id: z.string(),
  created: z.date(),
  updated: z.date().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  scans: z.array(ScanSchema).default([])
});

export const QRCodeFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['url', 'text', 'email', 'phone'])
});

export const ScanTrackingSchema = z.object({
  id: z.string().min(1, 'QR Code ID is required')
});

// Type exports
export type QRCodeType = z.infer<typeof QRCodeSchema>;
export type QRCodeCreateType = z.infer<typeof QRCodeCreateSchema>;
export type QRCodeFormType = z.infer<typeof QRCodeFormSchema>;
export type ScanType = z.infer<typeof ScanSchema>;
export type ScanTrackingType = z.infer<typeof ScanTrackingSchema>;