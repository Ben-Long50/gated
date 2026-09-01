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
  generatedPicture: { select: { publicId: true } },
};

const mapServices = {
  getBatchMaps: async (mapIds: number[]) => {
    const maps = await prisma.map.findMany({
      where: { id: { in: mapIds } },
      include: mapInclude,
    });

    return maps;
  },

  getMapById: async (mapId: number) => {
    const map = await prisma.map.findUnique({
      where: { id: mapId },
      include: mapInclude,
    });

    return map;
  },

  createOrUpdateMap: async (userId: number, formData: MapInput) => {
    const { id, ...data } = formData;

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
  },

  deleteMap: async (mapId: number, userId: number) => {
    await prisma.map.delete({
      where: {
        id: mapId,
        OR: [{ userId }, { campaign: { ownerId: userId } }],
      },
    });
  },
};

export default mapServices;
