import z from 'zod';
import { Description, Name } from './fieldSchemas.js';
import { KeywordType } from './enums.js';
export const KeywordInput = z.object({
    id: z.number().int().optional(),
    name: Name,
    keywordType: KeywordType,
    description: Description,
    gpCost: z.number().int().nonnegative().optional(),
});
