import z from 'zod';
import {
  Attributes,
  CharacterStats,
  Description,
  FirstName,
  LastName,
} from './fieldSchemas.js';
import { NpcType, Sex } from './enums.js';
import prisma from '../config/database.js';
import validateLevelUpBonus from '../utils/validateLevelUpBonus.js';

export const CharacterInput = z
  .object({
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
  generatedPictureId: z.number().int().optional(),
  height: z.number().int().nonnegative(),
  weight: z.number().nonnegative(),
  age: z.number().int().nonnegative(),
  sex: Sex,
  description: Description.optional(),
  stats: CharacterStats,
});

export const CharacterLevelBonus = z
  .object({
    characterId: z.number().int().nonnegative(),
    level: z.number().int().min(0).max(12),
    attributes: Attributes.optional(),
    perkIds: z.array(z.number().int().nonnegative()).optional(),
  })
  .superRefine(async (data, ctx) => {
    const character = await prisma.character.findUnique({
      where: {
        id: data.characterId,
      },
      select: {
        playerCharacter: true,
      },
    });

    if (character?.playerCharacter) {
      if (data.level === 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['level'],
          message:
            'Assigned level must be between 1 and 12 for player characters',
        });
      }

      try {
        await validateLevelUpBonus({
          level: data.level,
          attributes: data.attributes ?? undefined,
          perkIds: data.perkIds ?? undefined,
        });
      } catch (error) {
        ctx.addIssue({
          code: 'custom',
          message: error instanceof Error ? error.message : 'Validation failed',
        });
      }
    }

    if (!character?.playerCharacter) {
      if (data.level > 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['level'],
          message: 'Assigned level must be 0 for non-player characters',
        });
      }
    }
  });

export type CharacterLevelBonus = z.infer<typeof CharacterLevelBonus>;

export type CharacterInput = z.infer<typeof CharacterInput>;

export type CharacterUpdateInput = z.infer<typeof CharacterUpdateInput>;
