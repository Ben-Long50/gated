import prisma from '../config/database.js';
import { ConditionInput } from '../validation/conditionSchema.js';

const conditionServices = {
  getConditions: async () => {
    try {
      const conditions = await prisma.condition.findMany({
        orderBy: { name: 'asc' },
      });
      return conditions;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch conditions');
    }
  },

  getConditionById: async (conditionId: number) => {
    try {
      const condition = await prisma.condition.findUnique({
        where: { id: conditionId },
      });
      return condition;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch condition');
    }
  },

  getConditionByName: async (conditionName: string) => {
    try {
      const condition = await prisma.condition.findUnique({
        where: { name: conditionName },
      });

      return condition;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch condition');
    }
  },

  createCondition: async (formData: ConditionInput) => {
    try {
      const { id, ...data } = formData;

      const condition = await prisma.condition.upsert({
        where: { id: formData.id || 0 },
        update: data,
        create: data,
      });

      return condition;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create or update condition');
    }
  },

  updateCharacterConditionStacks: async (
    conditionId: number,
    value: number,
  ) => {
    try {
      const conditionReference =
        await prisma.characterConditionReference.findUnique({
          where: { id: conditionId },
          select: { stacks: true },
        });

      if (!conditionReference) {
        throw new Error('Failed to find condition reference');
      }

      const condition = await prisma.characterConditionReference.update({
        where: { id: conditionId },
        data: {
          stacks: conditionReference.stacks ? { increment: value } : value,
        },
        include: { condition: { select: { name: true } } },
      });

      return condition.condition.name;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to udpate character condition stacks');
    }
  },

  updateItemConditionStacks: async (conditionId: number, value: number) => {
    try {
      const conditionReference = await prisma.itemConditionReference.findUnique(
        {
          where: { id: conditionId },
          select: { stacks: true },
        },
      );

      if (!conditionReference) {
        throw new Error('Failed to find condition reference');
      }

      const condition = await prisma.itemConditionReference.update({
        where: { id: conditionId },
        data: {
          stacks: conditionReference.stacks ? { increment: value } : value,
        },
        include: { condition: { select: { name: true } } },
      });

      return condition.condition.name;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to udpate item condition stacks');
    }
  },

  deleteCondition: async (conditionId: number) => {
    try {
      await prisma.condition.delete({
        where: {
          id: conditionId,
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to delete condition');
    }
  },

  deleteCharacterCondition: async (conditionId: number) => {
    try {
      await prisma.characterConditionReference.delete({
        where: {
          id: conditionId,
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to delete character condition');
    }
  },

  deleteItemCondition: async (conditionId: number) => {
    try {
      await prisma.itemConditionReference.delete({
        where: {
          id: conditionId,
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to delete item condition');
    }
  },
};

export default conditionServices;
