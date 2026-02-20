import prisma from '../config/database.js';

const gangServices = {
  getGangs: async (gangId: number) => {
    try {
      const gangs = await prisma.gang.findMany({
        where: { id: gangId },
        include: {
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
            },
            orderBy: { firstName: 'asc' },
          },
          turf: true,
          properties: true,
          affiliations: { select: { id: true } },
        },
      });

      return gangs;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch owner gangs');
    }
  },

  getBatchGangs: async (gangIds: number[]) => {
    try {
      const gangs = await prisma.gang.findMany({
        where: { id: { in: gangIds } },
        include: {
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
            },
            orderBy: { firstName: 'asc' },
          },
          turf: true,
          properties: true,
          affiliations: { select: { id: true } },
        },
      });

      return gangs;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch gangs');
    }
  },

  getGangById: async (gangId: number) => {
    try {
      const gang = await prisma.gang.findUnique({
        where: { id: gangId },
        include: {
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
            },
            orderBy: { firstName: 'asc' },
          },
          properties: true,
          affiliations: { select: { id: true } },
        },
      });

      return gang;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch gang');
    }
  },

  createOrUpdateGang: async (formData: {
    id: number | null;
    name: string;
    gangPoints: number | null;
    reputation: number | null;
    profits: number | null;
    picture: { imageUrl: string; publicId: string };
    campaignId: number;
    factionId: number | null;
    leaderIds: number[];
    characterIds: number[];
  }) => {
    const data = {
      name: formData.name,
      picture: formData.picture,
      campaign: { connect: { id: formData.campaignId } },
      ...(formData.gangPoints != null && { gangPoints: formData.gangPoints }),
      ...(formData.reputation != null && { gangPoints: formData.reputation }),
      ...(formData.profits != null && { profits: formData.profits }),
      ...(formData.factionId != null && {
        faction: { connect: { id: formData.factionId } },
      }),
      ...(formData.leaderIds.length > 0 && {
        leaders: {
          connect: formData.leaderIds.map((leaderId) => ({ id: leaderId })),
        },
      }),
      ...(formData.characterIds.length > 0 && {
        characters: {
          connect: formData.characterIds.map((characterId) => ({
            id: characterId,
          })),
        },
      }),
    };

    try {
      const gang = await prisma.gang.upsert({
        where: { id: formData?.id || 0 },
        update: {
          ...data,
        },
        create: {
          ...data,
        },
      });

      return gang;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create or update gang');
    }
  },

  updateReputation: async (gangId: number, value: number) => {
    try {
      await prisma.gang.update({
        where: { id: gangId },
        data: { reputation: value },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update gang reputation');
    }
  },

  deleteGang: async (gangId: number) => {
    try {
      await prisma.gang.delete({
        where: {
          id: gangId,
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message || 'Failed to delete gang');
    }
  },
};

export default gangServices;
