import prisma from '../config/database.js';
import { FactionInput } from '../validation/factionSchema.js';

const factionInclude = {
  affiliations: { select: { id: true } },
  gangs: { select: { name: true } },
  campaign: { select: { ownerId: true } },
};

const factionServices = {
  getBatchFactions: async (factionIds: number[]) => {
    try {
      const factions = await prisma.faction.findMany({
        where: { id: { in: factionIds } },
        include: factionInclude,
      });

      return factions;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch factions');
    }
  },

  getFactionById: async (factionId: number) => {
    try {
      const faction = await prisma.faction.findUnique({
        where: { id: factionId },
        include: factionInclude,
      });

      return faction;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch faction');
    }
  },

  updateFaction: async (formData: FactionInput) => {
    try {
      const { id, ...data } = formData;

      const faction = await prisma.faction.update({
        where: { id },
        data,
        include: factionInclude,
      });

      return faction;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to update faction');
    }
  },

  deleteFaction: async (factionId: number) => {
    try {
      const faction = await prisma.faction.findUnique({
        where: {
          id: factionId,
        },
        select: {
          affiliations: { select: { id: true } },
        },
      });

      if (!faction) {
        throw new Error('Failed to find faction');
      }

      await prisma.$transaction(async (tx) => {
        await tx.affiliation.deleteMany({
          where: {
            id: {
              in: faction.affiliations.map((affiliation) => affiliation.id),
            },
          },
        });

        await tx.faction.delete({
          where: {
            id: factionId,
          },
        });
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to delete faction');
    }
  },
};

export default factionServices;
