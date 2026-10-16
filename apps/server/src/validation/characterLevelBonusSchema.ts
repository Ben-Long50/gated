import z from 'zod';
import prisma from '../config/database.js';
import { validateLevelUpBonus } from '../utils/validateLevelUpBonus.js';
import { validation } from '@gated/shared';

export const CharacterLevelBonus =
  validation.CharacterLevelBonusBase.superRefine(async (data, ctx) => {
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
