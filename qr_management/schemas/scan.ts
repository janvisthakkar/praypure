import { z } from 'zod';

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

export const ScanTrackingSchema = z.object({
  id: z.string().min(1, 'QR Code ID is required')
});

export type ScanType = z.infer<typeof ScanSchema>;
export type ScanTrackingType = z.infer<typeof ScanTrackingSchema>;