import z from 'zod';
import { Attributes, CharacterStats, Description, Name, } from './fieldSchemas.js';
export const PerkSchema = z.object({
    id: z.number().int().optional(),
    name: Name,
    description: Description,
    modifiers: CharacterStats,
    attributes: Attributes,
});
