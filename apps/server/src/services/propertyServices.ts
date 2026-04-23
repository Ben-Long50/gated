import prisma from '../config/database.js';
import { PropertyInput } from '../validation/propertySchema.js';

const propertyServices = {
  getBaseProperties: async () => {
    try {
      const properties = await prisma.property.findMany({
        where: { basePropertyId: null },
        include: {
          gang: true,
        },
      });

      return properties;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch owner properties');
    }
  },

  getBatchProperties: async (propertyIds: number[]) => {
    try {
      const properties = await prisma.property.findMany({
        where: { id: { in: propertyIds } },
        include: {
          gang: true,
        },
      });

      return properties;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch properties');
    }
  },

  getPropertyById: async (propertyId: number) => {
    try {
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        include: {
          gang: true,
        },
      });

      return property;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch property');
    }
  },

  createOrUpdateBaseProperty: async (formData: PropertyInput) => {
    try {
      const { id, ...data } = formData;

      const property = await prisma.property.upsert({
        where: { id: id || 0 },
        update: data,
        create: data,
      });

      return property;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create or update property');
    }
  },

  deleteProperty: async (propertyId: number) => {
    try {
      await prisma.property.delete({
        where: {
          id: propertyId,
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message || 'Failed to delete property');
    }
  },
};

export default propertyServices;
