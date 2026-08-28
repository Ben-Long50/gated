import z from 'zod';
import { Name, RichText } from './fieldSchemas.js';
import { FactionType } from './enums.js';
export const FactionInput = z.object({
    id: z.number().int().optional(),
    name: Name,
    generatedPictureId: z.number().int().optional(),
    factionType: FactionType,
    background: RichText.optional(),
});
