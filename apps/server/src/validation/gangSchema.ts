import z from 'zod';
import { Name, Picture, PictureFile, RichText } from './fieldSchemas.js';

export const GangInput = z.object({
  id: z.number().int().optional(),
  name: Name,
  profits: z.number().int().nonnegative(),
  pictureFile: PictureFile,
  picture: Picture,
  background: RichText,
  campaignId: z.number().int(),
  factionId: z.number().int().optional(),
  leaderIds: z.array(z.number().int()),
  characterIds: z.array(z.number().int()),
});

export type GangInput = z.infer<typeof GangInput>;
