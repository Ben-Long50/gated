import prisma from '../config/database.js';
import combineObjects from '../utils/combineObjects.js';
import { CharacterStats } from '../validation/fieldSchemas.js';
import { characterInclude } from './characterServices.js';

const characterStatServices = {
  editCharacterStat: async (characterId: number, stats: CharacterStats) => {
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
  },

  resetCharacterStat: async (characterId: number, stats: CharacterStats) => {
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
  },

  editProfits: async (characterId: number, value: number) => {
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
  },
};

export default characterStatServices;
