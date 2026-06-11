import z from 'zod';
import {
  Attributes,
  CharacterStats,
  Description,
  FirstName,
  LastName,
  Picture,
  PictureFile,
} from './fieldSchemas.js';
import { NpcType, Sex } from './enums.js';

export const CharacterInput = z.object({
  id: z.number().int().optional(),
  campaignId: z.number().int().optional(),
  firstName: FirstName,
  lastName: LastName,
  playerCharacter: z.boolean(),
  profits: z.number().int().nonnegative().optional(),
  npcTypes: z.array(NpcType).optional(),
  preferences: z.object({
    firstName: z.boolean(),
    lastName: z.boolean(),
    age: z.boolean(),
    height: z.boolean(),
    weight: z.boolean(),
    sex: z.boolean(),
    picture: z.boolean(),
    backstory: z.boolean(),
    level: z.boolean(),
    profits: z.boolean(),
    stats: z.boolean(),
    attributes: z.boolean(),
    perks: z.boolean(),
    equipment: z.boolean(),
  }),
  pictureFile: PictureFile,
  picture: Picture,
  height: z.number().int().nonnegative(),
  weight: z.number().nonnegative(),
  age: z.number().int().nonnegative(),
  sex: Sex,
  description: Description.optional(),
  stats: CharacterStats,
  attributes: Attributes,
  perkIds: z.array(z.coerce.number().int().nonnegative()),
  actionIds: z.array(z.coerce.number().int().nonnegative()),
});

export const CharacterUpdateInput = z.object({
  id: z.number().int().optional(),
  campaignId: z.number().int().optional(),
  firstName: FirstName,
  lastName: LastName,
  playerCharacter: z.boolean(),
  profits: z.number().int().nonnegative().optional(),
  npcTypes: z.array(NpcType).optional(),
  preferences: z.object({
    firstName: z.boolean(),
    lastName: z.boolean(),
    age: z.boolean(),
    height: z.boolean(),
    weight: z.boolean(),
    sex: z.boolean(),
    picture: z.boolean(),
    backstory: z.boolean(),
    level: z.boolean(),
    profits: z.boolean(),
    stats: z.boolean(),
    attributes: z.boolean(),
    perks: z.boolean(),
    equipment: z.boolean(),
  }),
  pictureFile: PictureFile,
  picture: Picture,
  height: z.number().int().nonnegative(),
  weight: z.number().nonnegative(),
  age: z.number().int().nonnegative(),
  sex: Sex,
  description: Description.optional(),
  stats: CharacterStats,
  perkIds: z.array(z.coerce.number().int().nonnegative()),
  actionIds: z.array(z.coerce.number().int().nonnegative()),
});

export const CharacterLevelBonus = z.object({
  level: z.number().int().min(1).max(12),
  attributes: Attributes.optional(),
  perkIds: z.array(z.number().int().nonnegative()).optional(),
});

export type CharacterLevelBonus = z.infer<typeof CharacterLevelBonus>;

export type CharacterInput = z.infer<typeof CharacterInput>;

export type CharacterUpdateInput = z.infer<typeof CharacterUpdateInput>;
