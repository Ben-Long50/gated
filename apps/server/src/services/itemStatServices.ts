import prisma from '../config/database.js';
import getStatsObject from '../utils/getStatsObject.js';

const itemStatServices = {
  resetItemStats: async (itemId: string | number, value: object) => {
    try {
      const item = await prisma.item.findUnique({
        where: {
          id: Number(itemId),
        },
        select: { stats: true },
      });

      if (!item) {
        throw new Error('Item not found');
      }

      const statsObject = item.stats as Record<string, number>;

      const newStats = {
        ...statsObject,
        ...value,
      };

      await prisma.item.update({
        where: {
          id: Number(itemId),
        },
        data: {
          stats: newStats,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to update item stats ${value.toString()}`);
    }
  },

  editItemStat: async (
    itemId: number,
    value: { stat: string; value: number },
    userId: number,
  ) => {
    try {
      const item = await prisma.item.findUnique({
        where: {
          id: Number(itemId),
        },
        select: {
          stats: true,
          modifiedStats: true,
          characterInventory: {
            include: { character: { select: { userId: true } } },
          },
        },
      });

      if (userId !== item?.characterInventory?.character?.userId) {
        throw new Error(
          'You can only perform this action on a weapon your character owns',
        );
      }

      if (!item) {
        throw new Error('Armor not found');
      }

      const statsObject = getStatsObject(item);

      let adjustedValues = Object.fromEntries(
        Object.entries(value).map(([stat, value]) => [
          stat,
          statsObject[stat] + value,
        ]),
      );

      const newStats = {
        ...statsObject,
        ...adjustedValues,
      };

      await prisma.item.update({
        where: {
          id: itemId,
        },
        data: {
          stats: newStats,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update current block points');
    }
  },
};

export default itemStatServices;
