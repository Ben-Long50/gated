import { MapInput } from '@gated/shared/validation';
import prisma from '../config/database.js';

export const mapInclude = {
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

  createMapCopy: async (userId: number, mapId: number, campaignId?: number) => {
    const map = prisma.$transaction(async (tx) => {
      const map = await tx.map.findUnique({
        where: { id: mapId },
        select: {
          generatedPictureId: true,
          draft: true,
          name: true,
          description: true,
          type: true,
          width: true,
          height: true,
          baseColor: true,
          layerCount: true,
          layers: true,
          baseMapId: true,
        },
      });

      if (!map) {
        throw new Error('Failed to find map');
      }

      const validatedMap = MapInput.parse(map);

      const mapCopy = await tx.map.create({
        data: {
          ...validatedMap,
          campaignId,
          userId,
          baseMapId: map.baseMapId ?? mapId,
        },
        include: mapInclude,
      });

      return mapCopy;
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
