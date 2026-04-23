import z from 'zod';
import { Description, Name } from './fieldSchemas.js';

export const ErrorReportInput = z.object({
  id: z.number().int().optional(),
  title: Name,
  content: Description,
});

export type ErrorReportInput = z.infer<typeof ErrorReportInput>;
