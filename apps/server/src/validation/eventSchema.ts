import z from 'zod';
import { Description, Name, Time } from './fieldSchemas.js';
import { Month } from './enums.js';

export const EventInput = z.object({
  id: z.number().int().optional(),
  characterId: z.number().int().optional(),
  name: Name,
  description: Description,
  month: Month,
  day: z.number().int().nonnegative(),
  time: Time,
});

export type EventInput = z.infer<typeof EventInput>;
