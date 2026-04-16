import z from 'zod';
import {
  Description,
  ItemStats,
  Name,
  Picture,
  PictureFile,
} from './fieldSchemas.js';
import { ItemType, Rarity } from './enums.js';

export const ItemInput = z.object({
  id: z.number().int().optional(),
  name: Name,
  itemTypes: z.array(ItemType).min(1),
  rarity: Rarity,
  grade: z.number().int().min(1).nonnegative(),
  description: Description,
  price: z.number().int().nonnegative().optional().nullable(),
  stats: ItemStats,
  pictureFile: PictureFile,
  picture: Picture,
  itemIds: z.array(z.number().int()).optional(),
  actionIds: z.array(z.number().int()).optional(),
  keywords: z.array(
    z.object({
      keywordId: z.number().int(),
      value: z.number().int().nonnegative().nullable(),
    }),
  ),
});

export const ItemUpgradeInput = z.object({
  id: z.number().int(),
  name: Name,
  grade: z.number().int().min(1).nonnegative(),
  description: Description,
  pictureFile: PictureFile,
  picture: Picture,
  upgradePrice: z.number().int().nonnegative(),
  modifiedStats: ItemStats,
  keywords: z.array(
    z.object({
      keywordId: z.number().int(),
      value: z.number().int().nonnegative().nullable(),
    }),
  ),
});

export type ItemInput = z.infer<typeof ItemInput>;

export type ItemUpgradeInput = z.infer<typeof ItemUpgradeInput>;
