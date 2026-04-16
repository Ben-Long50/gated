import z from 'zod';
import { Name, Picture, PictureFile, RichText } from './fieldSchemas.js';
import { FactionType } from './enums.js';

export const FactionInput = z.object({
  id: z.number().int().optional(),
  name: Name,
  pictureFile: PictureFile.optional(),
  picture: Picture.optional(),
  factionType: FactionType,
  background: RichText.optional(),
});

export type FactionInput = z.infer<typeof FactionInput>;
