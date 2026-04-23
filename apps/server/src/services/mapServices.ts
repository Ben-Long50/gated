import prisma from '../config/database.js';
import { MapInput } from '../validation/mapSchema.js';

const mapInclude = {
  user: {
    select: {
      username: true,
    },
  },
  locations: {
    select: {
      id: true,
    },
    orderBy: { character: { firstName: 'asc' as const } },
  },
  encounters: true,
};

const mapServices = {
  getBatchMaps: async (mapIds: number[]) => {
    try {
      const maps = await prisma.map.findMany({
        where: { id: { in: mapIds } },
        include: mapInclude,
      });

      return maps;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch characters');
    }
  },

  getMapById: async (mapId: number) => {
    try {
      const map = await prisma.map.findUnique({
        where: { id: mapId },
        include: mapInclude,
      });

      return map;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch map');
    }
  },

  createOrUpdateMap: async (userId: number, formData: MapInput) => {
    const { id, ...data } = formData;

    try {
      const map = await prisma.map.upsert({
        where: { id: id || 0 },
        update: data,
        create: {
          ...data,
          userId,
        },
        include: mapInclude,
      });

      return map;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create or update map');
    }
  },

  deleteMap: async (mapId: number, userId: number) => {
    try {
      await prisma.map.delete({
        where: {
          id: mapId,
          OR: [{ userId }, { campaign: { ownerId: userId } }],
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to delete map');
    }
  },
};

export default mapServices;
