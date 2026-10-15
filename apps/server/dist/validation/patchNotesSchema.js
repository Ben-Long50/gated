import z from 'zod';
import { Name, RichText } from './fieldSchemas.js';
export const PatchNotesInput = z.object({
    id: z.number().int().optional(),
    version: z.number(),
    title: Name,
    content: RichText,
});
