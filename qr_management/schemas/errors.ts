import { z } from 'zod';

export const ZodErrorSchema = z.object({
  path: z.array(z.union([z.string(), z.number()])),
  message: z.string(),
  code: z.string()
});

export const APIErrorResponseSchema = z.object({
  error: z.string(),
  details: z.array(ZodErrorSchema).optional()
});

export type ZodErrorType = z.infer<typeof ZodErrorSchema>;
export type APIErrorResponseType = z.infer<typeof APIErrorResponseSchema>;