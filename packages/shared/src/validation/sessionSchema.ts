import z from 'zod';
import { Name, RichText } from './fieldSchemas.js';

export const SessionInput = z.object({
  id: z.number().int().optional(),
  campaignId: z.number().int(),
  name: Name,
  location: Name,
  generatedPictureId: z.number().int().optional(),
  briefing: RichText,
  characterIds: z.array(z.number().int()),
});

export type SessionInput = z.infer<typeof SessionInput>;
