import prisma from '../config/database.js';
import combineObjects from '../utils/combineObjects.js';
import { CharacterStats } from '../validation/fieldSchemas.js';
import { characterInclude } from './characterServices.js';

const characterStatServices = {
  editCharacterStat: async (characterId: number, stats: CharacterStats) => {
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

      const typedStats = character.stats as CharacterStats;

      const updatedCharacter = await prisma.character.update({
        where: {
          id: Number(characterId),
        },
        data: {
          stats: combineObjects(typedStats, stats),
        },
        include: characterInclude,
      });

      return updatedCharacter;
    } catch (error: any) {
      console.error(error);
      throw new Error(`Failed to update character stats`);
    }
  },

  resetCharacterStat: async (characterId: number, stats: CharacterStats) => {
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

      const typedStats = character.stats as CharacterStats;

      const updatedCharacter = await prisma.character.update({
        where: {
          id: characterId,
        },
        data: {
          stats: { ...typedStats, stats },
        },
        include: characterInclude,
      });

      return updatedCharacter;
    } catch (error: any) {
      console.error(error);
      throw new Error(`Failed to reset character stats}`);
    }
  },

  editProfits: async (characterId: number, value: number) => {
    try {
      const character = await prisma.character.update({
        where: {
          id: characterId,
        },
        data: {
          profits: { increment: value },
        },
        include: characterInclude,
      });

      return character;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to update current profits');
    }
  },
};

export default characterStatServices;
