import z from 'zod';
import { Description, Name } from './fieldSchemas.js';
import { PropertyType } from './enums.js';

export const PropertyInput = z.object({
  id: z.number().int().optional(),
  name: Name,
  description: Description,
  generatedPictureId: z.number().int().optional(),
  gpPrice: z.number().int().nonnegative(),
  type: PropertyType,
});

export type PropertyInput = z.infer<typeof PropertyInput>;
