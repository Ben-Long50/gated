import prisma from '../config/database.js';
import { PerkSchema } from '../validation/perkSchema.js';

const perkServices = {
  getPerks: async () => {
    try {
      const perks = await prisma.perk.findMany({
        orderBy: { name: 'asc' },
      });

      return perks;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch perks');
    }
  },

  getBatchPerks: async (perkIds: number[]) => {
    try {
      const perks = await prisma.perk.findMany({
        where: {
          id: { in: perkIds },
        },
      });

      return perks;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch perks');
    }
  },

  getPerkById: async (perkId: number) => {
    try {
      const perk = await prisma.perk.findUnique({
        where: { id: perkId },
      });

      return perk;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch perk');
    }
  },

  createPerk: async (formData: PerkSchema) => {
    try {
      const { id, ...data } = formData;
      const perk = await prisma.perk.upsert({
        where: { id: id || 0 },
        update: data,
        create: data,
      });

      return perk;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create or update perk');
    }
  },

  deletePerk: async (perkId: number) => {
    try {
      await prisma.perk.delete({
        where: {
          id: perkId,
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to delete perk');
    }
  },
};

export default perkServices;
