import z from 'zod';
import {
  Attributes,
  CharacterStats,
  Description,
  Name,
} from './fieldSchemas.js';

export const PerkSchema = z.object({
  id: z.number().int().optional(),
  name: Name,
  description: Description,
  type: z.enum(['character', 'monster']),
  modifiers: CharacterStats,
  attributes: Attributes,
});

export type PerkSchema = z.infer<typeof PerkSchema>;
