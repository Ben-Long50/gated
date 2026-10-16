import z from 'zod';
import {
  Attributes,
  CharacterStats,
  Description,
  FirstName,
  LastName,
  Name,
} from './fieldSchemas.js';
import { NpcType, Sex } from './enums.js';

export const CharacterInput = z
  .object({
    campaignId: z.number().int().optional(),
    name: Name,
    title: z
      .string()
      .min(2, 'Title length must be greater than 2 characters')
      .max(100, 'Title length must be less than 100 characters')
      .optional(),
    playerCharacter: z.boolean(),
    profits: z.number().int().nonnegative().optional(),
    npcTypes: z.array(NpcType).optional(),
    preferences: z.object({
      name: z.boolean(),
      title: z.boolean(),
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
    generatedPictureId: z.number().int().optional(),
    level: z.preprocess(
      (value) => (value === null ? undefined : value),
      z.number().int().min(1).max(12).optional(),
    ),
    height: z.number().int().nonnegative(),
    weight: z.number().nonnegative(),
    age: z.number().int().nonnegative(),
    sex: Sex,
    description: Description.optional(),
    stats: CharacterStats,
    attributes: Attributes,
    perkIds: z.array(z.coerce.number().int().nonnegative()),
  })
  .refine((data) => !data.playerCharacter || data.level != null, {
    message: 'Player Characters must have a level',
    path: ['level'],
  })
  .refine((data) => data.playerCharacter || data.level == null, {
    message: 'Non-Player Characters must not have a level',
    path: ['level'],
  });

export const CharacterUpdateInput = z.object({
  id: z.number().int().optional(),
  campaignId: z.number().int().optional(),
  name: FirstName,
  title: LastName,
  playerCharacter: z.boolean(),
  profits: z.number().int().nonnegative().optional(),
  npcTypes: z.array(NpcType).optional(),
  preferences: z.object({
    name: z.boolean(),
    title: z.boolean(),
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
  generatedPictureId: z.number().int().optional(),
  height: z.number().int().nonnegative(),
  weight: z.number().nonnegative(),
  age: z.number().int().nonnegative(),
  sex: Sex,
  description: Description.optional(),
  stats: CharacterStats,
});

export const CharacterLevelBonusBase = z.object({
  characterId: z.number().int().nonnegative(),
  level: z.number().int().min(0).max(12),
  attributes: Attributes.optional(),
  perkIds: z.array(z.number().int().nonnegative()).optional(),
});

export type CharacterInput = z.infer<typeof CharacterInput>;

export type CharacterUpdateInput = z.infer<typeof CharacterUpdateInput>;
