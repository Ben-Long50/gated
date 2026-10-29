import z from 'zod';
import { Name } from './fieldSchemas.js';

export const EncounterInput = z.object({
  id: z.number().int().optional(),
  name: Name,
  mapId: z.number().int().nonnegative(),
});

export type EncounterInput = z.infer<typeof EncounterInput>;
