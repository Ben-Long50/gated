import z from 'zod';
import { RichText } from './fieldSchemas.js';

export const NotesInput = z.object({
  id: z.number().int().optional(),
  characterId: z.number().int(),
  sessionId: z.number().int(),
  content: RichText,
});

export type NotesInput = z.infer<typeof NotesInput>;
