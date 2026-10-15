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
    orderBy: { character: { name: 'asc' as const } },
  },
  encounters: true,
  generatedPicture: { select: { publicId: true } },
};

const mapServices = {
  getCodexMaps: async () => {
    const maps = await prisma.map.findMany({
      where: { userId: null, baseMapId: null },
      select: { id: true },
    });

    return maps;
  },

  getBatchMaps: async (mapIds: number[]) => {
    const maps = await prisma.map.findMany({
      where: { id: { in: mapIds } },
      orderBy: { name: 'asc' },
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

  createOrUpdateCodexMap: async (formData: MapInput) => {
    const { id, ...data } = formData;

    const map = await prisma.map.upsert({
      where: { id: id || 0 },
      update: data,
      create: data,
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
