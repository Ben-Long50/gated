import z from 'zod';
import { Attributes, Description, Name } from './fieldSchemas.js';
export const PerkSchema = z.object({
    id: z.number().int().optional(),
    name: Name,
    description: Description,
    type: z.enum(['character', 'monster']),
    attributes: Attributes,
    actionIds: z.array(z.number().int().nonnegative()).optional(),
});
