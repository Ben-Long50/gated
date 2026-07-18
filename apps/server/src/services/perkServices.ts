import { Prisma } from '@prisma/client';
import prisma from '../config/database.js';
import { PerkSchema } from '../validation/perkSchema.js';
import actionServices from './actionServices.js';

const perkInclude = {
  actions: true,
};

const perkServices = {
  getPerks: async () => {
    try {
      const perks = await prisma.perk.findMany({
        orderBy: { name: 'asc' },
        include: perkInclude,
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
        include: perkInclude,
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
        include: perkInclude,
      });

      return perk;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch perk');
    }
  },

  createPerk: async (formData: PerkSchema) => {
    try {
      const { id, actionIds, ...data } = formData;
      const perk = await prisma.perk.upsert({
        where: { id: id || 0 },
        update: { ...data, actions: { set: actionIds?.map((id) => ({ id })) } },
        create: {
          ...data,
          actions: { connect: actionIds?.map((id) => ({ id })) },
        },
        include: perkInclude,
      });

      return perk;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create or update perk');
    }
  },

  createPerkCopy: async (perkId: number, tx?: Prisma.TransactionClient) => {
    try {
      const client = tx ?? prisma;

      const perk = await client.perk.findUnique({
        where: { id: perkId, basePerkId: null },
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          attributes: true,
          actions: { select: { id: true } },
        },
      });

      if (!perk) {
        throw new Error('Failed to find base perk');
      }

      const { id, actions, ...data } = perk;

      const newActionIds = [] as number[];

      if (actions.length > 0) {
        for (const action of actions) {
          const newAction = await actionServices.createActionCopy(
            action.id,
            client,
          );

          newActionIds.push(newAction.id);
        }
      }

      const newPerk = await client.perk.create({
        data: {
          ...data,
          attributes: data.attributes ?? undefined,
          basePerkId: id,
          actions: {
            connect: newActionIds.map((id) => ({ id })),
          },
        },
        include: perkInclude,
      });

      return newPerk;
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
