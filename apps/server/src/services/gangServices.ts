import prisma from '../config/database.js';
import { GangInput, GangSessionBonusInput } from '../validation/gangSchema.js';

const gangInclude = {
  faction: { select: { id: true, name: true, factionType: true } },
  leaders: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      picture: true,
      userId: true,
    },
  },
  characters: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      picture: true,
      userId: true,
      playerCharacter: true,
      level: true,
    },
    orderBy: { firstName: 'asc' as const },
  },
  turf: true,
  properties: true,
  affiliations: { select: { id: true } },
  gangSessionBonuses: true,
};

const gangServices = {
  getGangs: async (gangId: number) => {
    try {
      const gangs = await prisma.gang.findMany({
        where: { id: gangId },
        include: gangInclude,
      });

      return gangs;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch owner gangs');
    }
  },

  getBatchGangs: async (gangIds: number[]) => {
    try {
      const gangs = await prisma.gang.findMany({
        where: { id: { in: gangIds } },
        include: gangInclude,
      });

      return gangs;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch gangs');
    }
  },

  getGangById: async (gangId: number) => {
    try {
      const gang = await prisma.gang.findUnique({
        where: { id: gangId },
        include: gangInclude,
      });

      return gang;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch gang');
    }
  },

  createOrUpdateGang: async (formData: GangInput) => {
    const { leaderIds, characterIds, ...data } = formData;

    try {
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
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create or update gang');
    }
  },

  updateGangCharacters: async (
    gangId: number,
    value: {
      leaderIds: number[];
      characterIds: number[];
    },
  ) => {
    try {
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
      });

      return gang;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create or update gang');
    }
  },

  allocateReputation: async (
    gangId: number,
    sessionId: number,
    bonus: GangSessionBonusInput,
  ) => {
    try {
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
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to allocate reputation bonus');
    }
  },

  allocateLevelNodes: async (
    gangId: number,
    sessionId: number,
    bonus: GangSessionBonusInput,
  ) => {
    try {
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
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to allocate level node bonus');
    }
  },

  editGangProfits: async (gangId: number, value: number) => {
    try {
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
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to update current gang profits');
    }
  },

  distributeProfits: async (
    gangId: number,
    characterId: number,
    value: number,
  ) => {
    try {
      const { gang, character } = await prisma.$transaction(async (tx) => {
        const gang = await tx.gang.update({
          where: { id: gangId },
          data: {
            profits: { decrement: value },
          },
        });

        const character = await tx.character.update({
          where: { id: characterId },
          data: {
            profits: { increment: value },
          },
        });

        return { gang, character };
      });

      return { gang, character };
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to update current profits');
    }
  },

  deleteGang: async (gangId: number) => {
    try {
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
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message || 'Failed to delete gang');
    }
  },
};

export default gangServices;
