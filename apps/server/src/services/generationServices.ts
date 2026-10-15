import { $Enums } from '@prisma/client';
import prisma from '../config/database.js';

import { deleteManyFromCloudinary } from '../utils/cloudinary.js';
import { userInclude } from './userServices.js';

const generationInclude = {
  id: true,
  publicId: true,
  type: true,
};

const generationServices = {
  getGenerationById: async (generationId: number) => {
    const picture = await prisma.generatedPicture.findUnique({
      where: {
        id: generationId,
      },
      select: generationInclude,
    });

    return picture;
  },

  getTitlePicture: async () => {
    const count = await prisma.generatedPicture.count({
      where: {
        userId: null,
        type: 'scene',
      },
    });

    const picture = await prisma.generatedPicture.findFirst({
      where: { userId: null, type: 'scene' },
      skip: Math.floor(Math.random() * count),
      select: { publicId: true },
    });

    return picture;
  },

  getStandardPictures: async () => {
    const pictures = await prisma.generatedPicture.findMany({
      where: {
        userId: null,
      },
      select: { publicId: true, id: true, type: true },
    });

    return pictures;
  },

  addStandardPicture: async (
    pictures: { imageUrl: string; publicId: string }[],
    prompt: string,
    type: $Enums.GeneratedPictureType,
  ) => {
    const newPictures = await prisma.generatedPicture.createManyAndReturn({
      data: pictures.map((picture) => ({
        imageUrl: picture.imageUrl,
        publicId: picture.publicId,
        type,
        prompt,
      })),
      select: { publicId: true },
    });

    return newPictures;
  },

  addUserGeneratedPicture: async (
    pictures: { imageUrl: string; publicId: string }[],
    prompt: string,
    type: $Enums.GeneratedPictureType,
    userId: number,
  ) => {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        generatedPictures: {
          createMany: {
            data: pictures.map((picture) => ({
              imageUrl: picture.imageUrl,
              publicId: picture.publicId,
              type,
              prompt,
            })),
          },
        },
        generationCount: { increment: pictures.length },
      },
      include: userInclude,
    });

    const newPictures = user.generatedPictures.slice(0, pictures.length);

    return { user, newPictures };
  },

  deleteUnusedGeneratedPictures: async (
    userId: number,
    type: $Enums.GeneratedPictureType,
    count: number,
  ) => {
    const publicIds = await prisma.$transaction(async (tx) => {
      const pictures = await tx.generatedPicture.findMany({
        where: {
          userId,
          type,
          characters: { none: {} },
          items: { none: {} },
          properties: { none: {} },
          gangs: { none: {} },
          sessions: { none: {} },
          factions: { none: {} },
          maps: { none: {} },
          campaigns: { none: {} },
        },
        orderBy: { createdAt: 'asc' },
        take: count,
        select: { id: true, publicId: true },
      });

      const publicIds = pictures.map((picture) => picture.publicId);

      await tx.generatedPicture.deleteMany({
        where: { publicId: { in: publicIds } },
      });

      return publicIds;
    });

    await deleteManyFromCloudinary(publicIds);

    return publicIds.length;
  },
};

export default generationServices;
