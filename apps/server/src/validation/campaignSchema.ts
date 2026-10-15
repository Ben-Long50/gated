import z from 'zod';
import { Affiliation, Name, RichText } from './fieldSchemas.js';
import { FactionInput } from './factionSchema.js';

export const CampaignInput = z.object({
  id: z.number().int().optional(),
  name: Name,
  location: Name,
  generatedPictureId: z.number().int().optional(),
  factions: z.array(FactionInput).length(2),
  affiliation: Affiliation,
  briefing: RichText,
  playerIds: z.array(z.number().int()),
  pendingPlayerIds: z.array(z.number().int()),
});

export type CampaignInput = z.infer<typeof CampaignInput>;
