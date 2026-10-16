import { Prisma } from '@prisma/client';
import prisma from '../config/database.js';
import actionServices, { actionSelectForCopy } from './actionServices.js';
import { PerkSchema } from '@gated/shared/validation';

export const perkSelectForCopy = {
  id: true,
  name: true,
  description: true,
  type: true,
  attributes: true,
  basePerkId: true,
  actions: { select: actionSelectForCopy },
};

export const perkInclude = {
  actions: true,
};

const perkServices = {
  getPerks: async () => {
    const perks = await prisma.perk.findMany({
      where: { basePerkId: null },
      orderBy: { name: 'asc' },
      include: perkInclude,
    });

    return perks;
  },

  getBatchPerks: async (perkIds: number[]) => {
    const perks = await prisma.perk.findMany({
      where: {
        id: { in: perkIds },
      },
      include: perkInclude,
    });

    return perks;
  },

  getPerkById: async (perkId: number) => {
    const perk = await prisma.perk.findUnique({
      where: { id: perkId },
      include: perkInclude,
    });

    return perk;
  },

  createPerk: async (formData: PerkSchema) => {
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
  },

  createPerkCopy: async (perkId: number, tx?: Prisma.TransactionClient) => {
    const client = tx ?? prisma;

    const perk = await client.perk.findUnique({
      where: { id: perkId, basePerkId: null },
      select: perkSelectForCopy,
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
  },

  deletePerk: async (perkId: number) => {
    await prisma.perk.delete({
      where: {
        id: perkId,
      },
    });
  },
};

export default perkServices;
