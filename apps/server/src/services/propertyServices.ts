import prisma from '../config/database.js';
import { PropertyInput } from '../validation/propertySchema.js';

const propertyInclude = {
  gang: true,
  generatedPicture: { select: { publicId: true } },
};

const propertyServices = {
  getBaseProperties: async () => {
    const properties = await prisma.property.findMany({
      where: { basePropertyId: null },
      include: propertyInclude,
    });

    return properties;
  },

  getBatchProperties: async (propertyIds: number[]) => {
    const properties = await prisma.property.findMany({
      where: { id: { in: propertyIds } },
      include: propertyInclude,
    });

    return properties;
  },

  getPropertyById: async (propertyId: number) => {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: propertyInclude,
    });

    return property;
  },

  createOrUpdateBaseProperty: async (formData: PropertyInput) => {
    const { id, ...data } = formData;

    const property = await prisma.property.upsert({
      where: { id: id || 0 },
      update: data,
      create: data,
    });

    return property;
  },

  deleteProperty: async (propertyId: number) => {
    await prisma.property.delete({
      where: {
        id: propertyId,
      },
    });
  },
};

export default propertyServices;
