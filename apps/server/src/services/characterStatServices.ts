import prisma from '../config/database.js';
import characterServices from './characterServices.js';

const characterStatServices = {
  editCharacterStat: async (
    characterId: number,
    adjustments: Record<string, number>,
  ) => {
    try {
      const prevCharacter =
        await characterServices.getCharacterById(characterId);

      const characterStats = prevCharacter?.stats as Record<string, number>;

      const character = await prisma.character.findUnique({
        where: {
          id: characterId,
        },
        select: { stats: true },
      });

      if (!character) {
        throw new Error('Character not found');
      }

      const statsObject = character.stats as Record<string, number>;

      let adjustedValues = Object.fromEntries(
        Object.entries(statsObject).map(([stat, value]) => {
          if (adjustments[stat]) {
            if (value + adjustments[stat] < 0) {
              return [stat, 0];
            }
            if (stat === 'currentHealth') {
              if (value + adjustments[stat] > characterStats.maxHealth) {
                return [stat, characterStats.maxHealth];
              }
            }
            if (stat === 'currentSanity') {
              if (value + adjustments[stat] > characterStats.maxSanity) {
                return [stat, characterStats.maxSanity];
              }
            }
            if (stat === 'injuries') {
              if (
                value + adjustments[stat] >
                characterStats.permanentInjuries
              ) {
                return [stat, characterStats.permanentInjuries];
              }
            }
            if (stat === 'insanities') {
              if (
                value + adjustments[stat] >
                characterStats.permanentInsanities
              ) {
                return [stat, characterStats.permanentInsanities];
              }
            }
            if (stat === 'currentHands') {
              if (value + adjustments[stat] > characterStats.hands) {
                return [stat, characterStats.hands];
              }
            }
            return [stat, value + adjustments[stat]];
          } else {
            return [stat, value];
          }
        }),
      );

      const newStats = {
        ...statsObject,
        ...adjustedValues,
      };

      await prisma.character.update({
        where: {
          id: Number(characterId),
        },
        data: {
          stats: newStats,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to update character stats`);
    }
  },

  resetCharacterStat: async (
    characterId: number,
    adjustments: Record<string, number>,
  ) => {
    try {
      const character = await prisma.character.findUnique({
        where: {
          id: characterId,
        },
        select: { stats: true },
      });

      if (!character) {
        throw new Error('Character not found');
      }

      const statsObject = character.stats as Record<string, number>;

      const newStats = {
        ...statsObject,
        ...adjustments,
      };

      await prisma.character.update({
        where: {
          id: Number(characterId),
        },
        data: {
          stats: newStats,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error(
        `Failed to update character stats ${adjustments.toString()}`,
      );
    }
  },

  editProfits: async (characterId: number, value: number) => {
    try {
      const character = await prisma.character.findUnique({
        where: {
          id: characterId,
        },
        select: { profits: true },
      });

      if (!character) {
        throw new Error('Character not found');
      }

      await prisma.character.update({
        where: {
          id: characterId,
        },
        data: {
          profits: character.profits + value,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update current profits');
    }
  },
};

export default characterStatServices;
