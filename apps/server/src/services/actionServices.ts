import prisma from '../config/database.js';
import addVariableStats from '../utils/addVariableStats.js';
import { ActionInput } from '../validation/actionSchema.js';

const actionInclude = {
  keywordModifiers: { select: { id: true } },
};

const actionServices = {
  getActions: async () => {
    try {
      const actions = await prisma.action.findMany({
        where: { characterInventory: null, baseActionId: null },
        include: actionInclude,
        orderBy: { name: 'asc' },
      });
      return actions;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch actions');
    }
  },

  getActionById: async (actionId: number) => {
    try {
      const action = await prisma.action.findUnique({
        where: { id: actionId },
        include: actionInclude,
      });
      return action;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch action');
    }
  },

  getBatchActions: async (actionIds: number[]) => {
    try {
      const actions = await prisma.action.findMany({
        where: {
          id: { in: actionIds },
        },
        include: actionInclude,
      });

      return actions;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch actions');
    }
  },

  createOrUpdateAction: async (formData: ActionInput) => {
    try {
      const { modifiers, keywords, ...data } = formData;

      const modifierStats = modifiers ? addVariableStats(modifiers) : undefined;

      const newAction = await prisma.action.upsert({
        where: { id: formData.id || 0 },
        update: {
          ...data,
          modifiers: modifierStats,
          keywordModifiers: {
            deleteMany: {},
            createMany: { data: keywords || [] },
          },
        },
        create: {
          ...data,
          modifiers: modifierStats,
          keywordModifiers: { createMany: { data: keywords || [] } },
        },
        include: actionInclude,
      });

      return newAction;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create or update action');
    }
  },

  createActionCopy: async (actionId: number) => {
    try {
      const actionInfo = await prisma.action.findUnique({
        where: { id: actionId },
        include: {
          keywordModifiers: { select: { keywordId: true, value: true } },
        },
      });

      if (!actionInfo) {
        throw new Error('Failed to find action');
      }

      const validatedAction = ActionInput.parse(actionInfo);

      const { id, ...data } = validatedAction;

      const action = await prisma.action.create({
        data: {
          ...data,
          keywordModifiers: {
            createMany: { data: actionInfo.keywordModifiers || [] },
          },
          baseActionId: actionInfo.baseActionId || id,
        },
        include: actionInclude,
      });

      return action;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create action copy');
    }
  },

  createCharacterActionCopy: async (
    inventoryId: number,
    actionList: { actionId: number; quantity: number }[],
  ) => {
    const actionIds = actionList?.map((action) => action.actionId);

    const actions = await prisma.action.findMany({
      where: { id: { in: actionIds } },
      include: {
        keywordModifiers: { select: { keywordId: true, value: true } },
      },
    });

    const newActions = await Promise.all(
      actionList.flatMap(({ actionId, quantity }) => {
        const actionDetails = actions.find((action) => action.id === actionId);

        const validatedAction = ActionInput.parse(actionDetails);

        const { id, ...data } = validatedAction;

        if (actionDetails) {
          return Array.from({ length: quantity }).map(() =>
            prisma.action.create({
              data: {
                ...data,
                keywordModifiers: {
                  createMany: { data: actionDetails.keywordModifiers || [] },
                },
                baseActionId: actionDetails.baseActionId || actionDetails.id,
                characterInventoryId: inventoryId,
              },
              include: actionInclude,
            }),
          );
        }
        return;
      }),
    );

    return newActions;
  },

  activateAction: async (actionId: number, value: boolean) => {
    try {
      const action = await prisma.action.update({
        where: { id: actionId },
        data: { active: !value },
        include: actionInclude,
      });
      return action;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to toggle action');
    }
  },

  deleteAction: async (actionId: number) => {
    try {
      await prisma.action.delete({
        where: {
          id: actionId,
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to delete action');
    }
  },

  deleteActions: async (actionIds: number[]) => {
    try {
      await prisma.action.deleteMany({
        where: {
          id: { in: actionIds },
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to delete actions');
    }
  },
};

export default actionServices;
