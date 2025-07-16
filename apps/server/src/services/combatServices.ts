import { $Enums } from '@prisma/client';
import prisma from '../config/database.js';

const combatServices = {
  getCombats: async (campaignId: number) => {
    try {
      const combats = await prisma.combat.findMany({
        where: {
          campaignId,
        },
        include: {
          characters: { select: { id: true } },
          history: {
            include: {
              character: true,
              target: true,
              action: true,
              item: true,
            },
          },
        },
        orderBy: { id: 'asc' },
      });

      return combats;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch owner combats');
    }
  },

  getCombatById: async (combatId: string) => {
    try {
      const combat = await prisma.combat.findUnique({
        where: { id: Number(combatId) },
        include: {
          characters: { select: { id: true } },
          history: {
            include: {
              character: true,
              target: true,
              action: true,
              item: true,
            },
          },
        },
      });

      if (!combat) {
        throw new Error('Failed to find combat');
      }

      return combat;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch combat');
    }
  },

  createOrUpdateCombat: async (
    campaignId: number,
    mapId: number,
    formData: {
      id?: number;
      characters: { id: number }[];
    },
  ) => {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      select: {
        date: true,
        time: true,
      },
    });

    const map = await prisma.map.findUnique({
      where: { id: mapId },
      select: { name: true },
    });

    if (!campaign || !map) throw new Error('No campaign or map found');

    const eventData = { name: `Combat at ${map.name}` } as {
      name: string;
      month: $Enums.Month;
      day: number;
      time?: { hour: number; minute: number; second: number };
    };

    //@ts-ignore
    if (campaign.date && 'month' in campaign.date) {
      //@ts-ignore
      eventData.month = campaign.date.month;
    }
    //@ts-ignore
    if (campaign.date && 'day' in campaign.date) {
      //@ts-ignore
      eventData.day = campaign.date.day;
    }
    //@ts-ignore
    if (campaign.time) {
      //@ts-ignore
      eventData.time = campaign.time;
    }

    try {
      const combat = await prisma.combat.upsert({
        where: { id: formData?.id || 0 },
        update: {
          campaign: { connect: { id: campaignId } },
          map: { connect: { id: mapId } },
          characters: {
            set: formData.characters,
          },
        },
        create: {
          campaign: { connect: { id: campaignId } },
          map: { connect: { id: mapId } },
          characters: {
            connect: formData.characters,
          },
          event: {
            create: { campaign: { connect: { id: campaignId } }, ...eventData },
          },
        },
      });

      return combat;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create or update combat');
    }
  },

  deleteCombat: async (combatId: number) => {
    try {
      const combat = await prisma.combat.findUnique({
        where: { id: combatId },
      });

      if (!combat) {
        throw new Error('Failed to find combat');
      }

      await prisma.combat.delete({
        where: {
          id: Number(combatId),
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message || 'Failed to delete combat');
    }
  },
};

export default combatServices;
