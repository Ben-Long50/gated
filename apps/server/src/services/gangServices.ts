import prisma from '../config/database.js';
import { GangInput, GangSessionBonusInput } from '../validation/gangSchema.js';
import { characterInclude } from './characterServices.js';

const gangInclude = {
  faction: { select: { id: true, name: true, factionType: true } },
  leaders: {
    select: {
      id: true,
      name: true,
      title: true,
      generatedPicture: { select: { publicId: true } },
      userId: true,
    },
  },
  characters: {
    select: {
      id: true,
      name: true,
      title: true,
      generatedPicture: { select: { publicId: true } },
      userId: true,
      playerCharacter: true,
      level: true,
    },
    orderBy: { name: 'asc' as const },
  },
  turf: true,
  properties: true,
  affiliations: { select: { id: true } },
  gangSessionBonuses: true,
  generatedPicture: { select: { publicId: true } },
};

const gangServices = {
  getGangs: async (gangId: number) => {
    const gangs = await prisma.gang.findMany({
      where: { id: gangId },
      include: gangInclude,
    });

    return gangs;
  },

  getBatchGangs: async (gangIds: number[]) => {
    const gangs = await prisma.gang.findMany({
      where: { id: { in: gangIds } },
      include: gangInclude,
    });

    return gangs;
  },

  getGangById: async (gangId: number) => {
    const gang = await prisma.gang.findUnique({
      where: { id: gangId },
      include: gangInclude,
    });

    return gang;
  },

  createOrUpdateGang: async (formData: GangInput) => {
    const { leaderIds, characterIds, ...data } = formData;

    const gang = await prisma.gang.upsert({
      where: { id: formData?.id || 0 },
      update: {
        ...data,
        leaders: {
          set: formData.leaderIds.map((leaderId) => ({ id: leaderId })),
        },
        characters: {
          set: formData.characterIds.map((characterId) => ({
            id: characterId,
          })),
        },
      },
      create: {
        ...data,
        leaders: {
          connect: formData.leaderIds.map((leaderId) => ({ id: leaderId })),
        },
        characters: {
          connect: formData.characterIds.map((characterId) => ({
            id: characterId,
          })),
        },
      },
      include: gangInclude,
    });

    return gang;
  },

  updateGangCharacters: async (
    gangId: number,
    value: {
      leaderIds: number[];
      characterIds: number[];
    },
  ) => {
    const gang = await prisma.gang.update({
      where: { id: gangId },
      data: {
        leaders: {
          set: value.leaderIds.map((leaderId) => ({ id: leaderId })),
        },
        characters: {
          set: value.characterIds.map((characterId) => ({
            id: characterId,
          })),
        },
      },
      include: gangInclude,
    });

    return gang;
  },

  allocateReputation: async (
    gangId: number,
    sessionId: number,
    bonus: GangSessionBonusInput,
  ) => {
    const gang = await prisma.gang.update({
      where: { id: gangId },
      data: {
        gangSessionBonuses: {
          upsert: {
            where: {
              gangId_sessionId: {
                gangId,
                sessionId,
              },
            },
            update: {
              reputationBonus: bonus,
            },
            create: {
              sessionId,
              reputationBonus: bonus,
            },
          },
        },
      },
      include: gangInclude,
    });

    return gang;
  },

  allocateLevelNodes: async (
    gangId: number,
    sessionId: number,
    bonus: GangSessionBonusInput,
  ) => {
    const gang = await prisma.gang.update({
      where: { id: gangId },
      data: {
        gangSessionBonuses: {
          upsert: {
            where: {
              gangId_sessionId: {
                gangId,
                sessionId,
              },
            },
            update: {
              levelNodeBonus: bonus,
            },
            create: {
              sessionId,
              levelNodeBonus: bonus,
            },
          },
        },
      },
      include: gangInclude,
    });

    return gang;
  },

  editGangProfits: async (gangId: number, value: number) => {
    const gang = await prisma.gang.update({
      where: {
        id: gangId,
      },
      data: {
        profits: { increment: value },
      },
      include: gangInclude,
    });

    return gang;
  },

  distributeProfits: async (
    gangId: number,
    distributions: [number, number][],
  ) => {
    const value = distributions.reduce((sum, [_, value]) => sum + value, 0);

    const { gang, characters } = await prisma.$transaction(async (tx) => {
      const gang = await tx.gang.update({
        where: { id: gangId },
        data: {
          profits: { decrement: value },
        },
        include: gangInclude,
      });

      const characters = await Promise.all(
        distributions.map(([characterId, value]) =>
          tx.character.update({
            where: { id: characterId },
            data: {
              profits: { increment: value },
            },
            include: characterInclude,
          }),
        ),
      );

      return { gang, characters };
    });

    return { gang, characters };
  },

  deleteGang: async (gangId: number) => {
    const gang = await prisma.gang.findUnique({
      where: {
        id: gangId,
      },
      select: {
        affiliations: { select: { id: true } },
      },
    });

    if (!gang) {
      throw new Error('Failed to find gang');
    }

    await prisma.$transaction(async (tx) => {
      await tx.affiliation.deleteMany({
        where: {
          id: {
            in: gang.affiliations.map((affiliation) => affiliation.id),
          },
        },
      });

      await tx.gang.delete({
        where: {
          id: gangId,
        },
      });
    });
  },
};

export default gangServices;
