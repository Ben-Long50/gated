import z from 'zod';
import {
  Description,
  Name,
  Picture,
  PictureFile,
  RichText,
} from './fieldSchemas.js';

export const GangInput = z.object({
  id: z.number().int().optional(),
  name: Name,
  pictureFile: PictureFile,
  picture: Picture,
  background: RichText,
  campaignId: z.number().int(),
  factionId: z.number().int().optional(),
  leaderIds: z.array(z.number().int()),
  characterIds: z.array(z.number().int()),
});

export type GangInput = z.infer<typeof GangInput>;

export const GangSessionBonusInput = z.array(
  z.object({
    value: z.number().int().nonnegative(),
    description: Description,
  }),
);

export type GangSessionBonusInput = z.infer<typeof GangSessionBonusInput>;
