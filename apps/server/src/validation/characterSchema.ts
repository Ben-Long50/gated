import z from 'zod';
import {
  Attributes,
  CharacterStats,
  LastName,
  Name,
  Picture,
  PictureFile,
} from './fieldSchemas.js';
import { NpcType, Sex } from './enums.js';

export const CharacterInput = z.object({
  id: z.number().int().optional(),
  campaignId: z.number().int().optional(),
  firstName: Name,
  lastName: LastName,
  playerCharacter: z.boolean(),
  npcTypes: z.array(NpcType),
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
  height: z.number().int(),
  weight: z.number(),
  age: z.number().int(),
  sex: Sex,
  stats: CharacterStats,
  attributes: Attributes,
  perkIds: z.array(z.number().int()),
});

export const CharacterUpdateInput = z.object({
  id: z.number().int().optional(),
  campaignId: z.number().int().optional(),
  firstName: Name,
  lastName: LastName,
  playerCharacter: z.boolean(),
  npcTypes: z.array(NpcType),
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
  height: z.number().int(),
  weight: z.number(),
  age: z.number().int(),
  sex: Sex,
  stats: CharacterStats,
});

export type CharacterInput = z.infer<typeof CharacterInput>;

export type CharacterUpdateInput = z.infer<typeof CharacterUpdateInput>;
