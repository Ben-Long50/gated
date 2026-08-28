import prisma from '../config/database.js';
import { enforceSingularLinking } from '../utils/enforceSingularLinking.js';
import { $Enums, Prisma } from '@prisma/client';
import actionServices from './actionServices.js';
import { ItemInput, ItemUpgradeInput } from '../validation/itemSchema.js';
import { ItemStats, Picture } from '../validation/fieldSchemas.js';
import { ConditionReferenceInput } from '../validation/conditionSchema.js';
import addVariableStats from '../utils/addVariableStats.js';
import { ActionInput } from '../validation/actionSchema.js';

export const itemInclude = {
  baseItem: true,
  characterInventory: {
    select: { characterId: true, character: { select: { userId: true } } },
  },
  linkedItems: {
    include: {
      keywords: {
        include: { keyword: true },
        orderBy: { keyword: { name: 'asc' as const } },
      },
      modifiedKeywords: {
        include: { keyword: true },
        orderBy: { keyword: { name: 'asc' as const } },
      },
      conditions: {
        include: { condition: true },
        orderBy: { condition: { name: 'asc' as const } },
      },
    },
  },
  linkedActions: {
    include: {
      keywordModifiers: { include: { keyword: { select: { id: true } } } },
      parentItem: { select: { name: true } },
    },
    orderBy: { name: 'asc' as const },
  },
  keywords: {
    include: { keyword: true },
    orderBy: { keyword: { name: 'asc' as const } },
  },
  modifiedKeywords: {
    include: { keyword: true },
    orderBy: { keyword: { name: 'asc' as const } },
  },
  conditions: {
    include: { condition: true },
    orderBy: { condition: { name: 'asc' as const } },
  },
};

const itemServices = {
  getCodexPreviewItems: async () => {
    try {
      const itemData = [
        {
          itemTypes: { hasEvery: ['weapon'] },
          baseItemId: null,
        },
        {
          itemTypes: { hasEvery: ['weapon'] },
          keywords: { some: { keyword: { name: 'Ranged' } } },
          baseItemId: null,
        },
        {
          itemTypes: { hasEvery: ['weapon'] },
          keywords: { some: { keyword: { name: 'Melee' } } },
          baseItemId: null,
        },
        {
          itemTypes: { hasEvery: ['weapon'] },
          keywords: {
            some: {
              keyword: {
                OR: [{ name: 'Consumable' }, { name: 'Light Consumable' }],
              },
            },
          },
          baseItemId: null,
        },
        {
          itemTypes: { hasEvery: ['armor'] },
          baseItemId: null,
        },
        {
          itemTypes: { hasEvery: ['armor'] },
          keywords: { some: { keyword: { name: 'Head' } } },
          baseItemId: null,
        },
        {
          itemTypes: { hasEvery: ['armor'] },
          keywords: { some: { keyword: { name: 'Body' } } },
          baseItemId: null,
        },
        {
          itemTypes: { hasEvery: ['armor'] },
          keywords: { some: { keyword: { name: 'Cloak' } } },
          baseItemId: null,
        },
        {
          itemTypes: { hasEvery: ['cybernetic'] },
          baseItemId: null,
        },
        {
          itemTypes: { hasEvery: ['mutation'] },
          baseItemId: null,
        },
        {
          itemTypes: { hasEvery: ['vehicle'] },
          baseItemId: null,
        },
        {
          itemTypes: { hasEvery: ['weapon'] },
          keywords: { some: { keyword: { name: 'Vehicle Weapon' } } },
          baseItemId: null,
        },
        {
          itemTypes: { hasEvery: ['drone'] },
          baseItemId: null,
        },
        {
          itemTypes: { hasEvery: ['weapon'] },
          keywords: { some: { keyword: { name: 'Drone Weapon' } } },
          baseItemId: null,
        },
        {
          itemTypes: { hasEvery: ['reusable'] },
          baseItemId: null,
        },
        {
          itemTypes: { hasEvery: ['consumable'] },
          baseItemId: null,
        },
      ];

      const characterData = [
        { playerCharacter: true, userId: null },
        { playerCharacter: false, npcTypes: { isEmpty: true }, userId: null },
        {
          playerCharacter: false,
          npcTypes: { hasEvery: ['goon'] },
          userId: null,
        },
        {
          playerCharacter: false,
          npcTypes: { hasEvery: ['shop'] },
          userId: null,
        },
        {
          playerCharacter: false,
          npcTypes: { hasEvery: ['monster'] },
          userId: null,
        },
      ];

      const itemCounts = await Promise.all(
        itemData.map((data) =>
          prisma.item.count({
            //@ts-ignore
            where: data,
          }),
        ),
      );

      const characterCounts = await Promise.all(
        characterData.map((data) =>
          prisma.character.count({
            //@ts-ignore
            where: data,
          }),
        ),
      );

      const itemPromises = itemData.map((data, index) => {
        const count = itemCounts[index];

        if (count === 0) {
          return null;
        }

        return prisma.item.findFirst({
          //@ts-ignore
          where: data,
          skip: Math.floor(Math.random() * count),
          select: { picture: true },
        });
      });

      const characterPromises = characterData.map((data, index) => {
        const count = characterCounts[index];

        if (count === 0) {
          return null;
        }

        return prisma.character.findFirst({
          //@ts-ignore
          where: data,
          skip: Math.floor(Math.random() * count),
          select: { picture: true },
        });
      });

      const [items, characters] = await Promise.all([
        Promise.all(itemPromises),
        Promise.all(characterPromises),
      ]);

      return { items, characters };
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch items');
    }
  },

  getCodexItems: async (types: $Enums.ItemType[]) => {
    try {
      const items = await prisma.item.findMany({
        where: types
          ? {
              baseItemId: null,
              parentItemId: null,
              itemTypes: { hasSome: types },
            }
          : { baseItemId: null, parentItemId: null },
        include: itemInclude,
        orderBy: { name: 'asc' },
      });

      return items;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch items');
    }
  },

  getBatchItems: async (itemIds: number[]) => {
    try {
      const items = await prisma.item.findMany({
        where: { id: { in: itemIds } },
        include: itemInclude,
      });

      return items;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch item');
    }
  },

  getItemById: async (itemId: number) => {
    try {
      const item = await prisma.item.findUnique({
        where: { id: itemId },
        include: itemInclude,
      });

      if (!item) {
        throw new Error('Failed to find item');
      }

      return item;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch item');
    }
  },

  createOrUpdateItem: async (formData: ItemInput) => {
    try {
      const { id, itemIds, actionIds, keywords, pictureFile, stats, ...data } =
        formData;

      const newStats = addVariableStats(stats);

      formData.id &&
        (await enforceSingularLinking(formData.id, itemIds, actionIds));

      const item = await prisma.item.upsert({
        where: { id: id || 0 },
        update: {
          ...data,
          stats: newStats,
          updatedAt: new Date(),
          linkedItems: {
            set: itemIds?.map((id) => ({ id })),
          },
          linkedActions: {
            set: actionIds?.map((id) => ({ id })),
          },
          keywords: { deleteMany: {}, createMany: { data: keywords } },
        },
        create: {
          ...data,
          stats: newStats,
          linkedItems: {
            connect: itemIds?.map((id) => ({ id })),
          },
          linkedActions: {
            connect: actionIds?.map((id) => ({ id })),
          },
          keywords: { createMany: { data: keywords } },
        },
        include: itemInclude,
      });

      if (id) {
        await prisma.item.updateMany({
          where: { baseItemId: item.id },
          data: { ...data, stats: newStats, updatedAt: new Date() },
        });
      }

      return item;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create or update item');
    }
  },

  upgradeItem: async (formData: ItemUpgradeInput) => {
    try {
      const prevCharacter = await prisma.character.findUnique({
        where: { id: formData.characterId },
        select: { profits: true },
      });

      if (!prevCharacter || prevCharacter.profits < formData.upgradePrice) {
        throw new Error(
          'You do not have enough profits to purchase the chosen upgrades',
        );
      }

      const { character, item } = await prisma.$transaction(async (tx) => {
        const character = await tx.character.update({
          where: { id: formData.characterId },

          data: { profits: { decrement: formData.upgradePrice } },
        });

        const item = await tx.item.update({
          where: { id: formData.id },
          data: {
            name: formData.name,
            description: formData.description,
            picture: formData.picture,
            modifiedStats: formData.modifiedStats,
            modifiedKeywords: {
              deleteMany: {},
              createMany: { data: formData.keywords },
            },
          },
          include: itemInclude,
        });

        return { character, item };
      });

      return { item, character };
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create or update item');
    }
  },

  createItemCopy: async (itemId: number) => {
    try {
      const itemDetails = await prisma.item.findUnique({
        where: { id: itemId },
        select: {
          id: true,
          name: true,
          rarity: true,
          description: true,
          stats: true,
          picture: true,
          itemTypes: true,
          grade: true,
          price: true,
          baseItemId: true,
          linkedItems: { select: { id: true } },
          linkedActions: { select: { id: true } },
          keywords: { select: { keywordId: true, value: true } },
        },
      });

      if (!itemDetails) {
        throw new Error('Failed to find original item');
      }

      const {
        id,
        baseItemId,
        stats,
        picture,
        keywords,
        linkedItems,
        linkedActions,
        ...data
      } = itemDetails;

      const typedPicture = picture as Picture;
      const typedStats = stats as ItemStats;

      const itemIds = [] as number[];
      const actionIds = [] as number[];

      if (linkedItems.length > 0) {
        for (let item of linkedItems) {
          const newItem = await itemServices.createItemCopy(item.id);

          itemIds.push(newItem.id);
        }
      }

      if (linkedActions.length > 0) {
        for (let action of linkedActions) {
          const newItem = await actionServices.createActionCopy(action.id);

          actionIds.push(newItem.id);
        }
      }

      const item = await prisma.item.create({
        data: {
          ...data,
          picture: typedPicture,
          stats: typedStats,
          linkedItems: {
            connect: itemIds.map((id) => ({ id })),
          },
          linkedActions: {
            connect: actionIds.map((id) => ({ id })),
          },
          keywords: { createMany: { data: keywords } },
          baseItemId: id,
        },
      });

      return item;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create item copy');
    }
  },

  createCharacterItemCopy: async (
    inventoryId: number,
    itemList: { itemId: number; quantity: number }[],
    tx?: Prisma.TransactionClient,
  ) => {
    const client = tx ?? prisma;

    const itemIds = itemList?.map((item) => item.itemId);

    const items = await client.item.findMany({
      where: { id: { in: itemIds } },
      select: {
        id: true,
        name: true,
        rarity: true,
        description: true,
        stats: true,
        picture: true,
        itemTypes: true,
        grade: true,
        price: true,
        baseItemId: true,
        linkedItems: {
          select: {
            id: true,
            name: true,
            rarity: true,
            description: true,
            stats: true,
            picture: true,
            itemTypes: true,
            grade: true,
            price: true,
            baseItemId: true,
            keywords: { select: { keywordId: true, value: true } },
          },
        },
        linkedActions: {
          select: {
            id: true,
            name: true,
            description: true,
            costs: true,
            roll: true,
            actionType: true,
            actionSubtypes: true,
            duration: true,
            cooldown: true,
            modifiers: true,
            keywordModifiers: { select: { keywordId: true, value: true } },
            baseActionId: true,
          },
        },
        keywords: { select: { keywordId: true, value: true } },
      },
    });

    if (items.length === 0) {
      throw new Error('No items found');
    }

    let nested = new Map();

    items.forEach((item) => {
      if (item.baseItemId) {
        throw new Error('Cannot create an item copy from a non-base item');
      }

      nested.set(`item ${item.id}`, {
        items: item.linkedItems ?? [],
        actions: item.linkedActions ?? [],
        keywords: item.keywords ?? [],
      });

      if (item.linkedItems.length > 0) {
        item.linkedItems.forEach((item) => {
          if (item.baseItemId) {
            throw new Error(
              'Cannot create an item copy from a non-base linked item',
            );
          }

          nested.set(`linked item ${item.id}`, {
            keywords: item.keywords ?? [],
          });
        });
      }

      if (item.linkedActions.length > 0) {
        item.linkedActions.forEach((action) => {
          if (action.baseActionId) {
            throw new Error(
              'Cannot create an item copy from a non-base linked action',
            );
          }

          nested.set(`linked action ${action.id}`, {
            keywords: action.keywordModifiers ?? [],
          });
        });
      }
    });

    const newItems = await client.item.createManyAndReturn({
      data: items.flatMap((item) => {
        const quantity =
          itemList.find((i) => i.itemId === item.id)?.quantity ?? 1;

        const validatedItem = ItemInput.parse(item);

        const { id, keywords, ...data } = validatedItem;

        return Array.from({ length: quantity }, () => ({
          ...data,
          baseItemId: item.baseItemId ?? id,
          characterInventoryId: inventoryId,
        }));
      }),
      select: { id: true, baseItemId: true },
    });

    const newLinkedItems = await client.item.createManyAndReturn({
      data: newItems.flatMap((item) => {
        const linkedItems = nested.get(`item ${item.baseItemId}`).items;

        const l = linkedItems.map((i: any) => {
          const validatedItem = ItemInput.parse(i);

          const { id, keywords, ...data } = validatedItem;

          return {
            ...data,
            baseItemId: i.baseItemId ?? i.id,
            parentItemId: item.id,
          };
        });

        return l;
      }),
      select: { id: true, baseItemId: true },
    });

    const newLinkedActions = await client.action.createManyAndReturn({
      data: newItems.flatMap((item) => {
        const linkedActions = nested.get(`item ${item.baseItemId}`).actions;

        const l = linkedActions.map((a: any) => {
          const validatedAction = ActionInput.parse(a);

          const { id, keywords, ...data } = validatedAction;

          return {
            ...data,
            baseActionId: a.baseActionId ?? a.id,
            parentItemId: item.id,
          };
        });

        return l;
      }),
      select: { id: true, baseActionId: true },
    });

    const keywordData = newItems.flatMap((item) => {
      const keywords = nested.get(`item ${item.baseItemId}`).keywords;

      const l = keywords.map((k: any) => ({
        ...k,
        itemId: item.id,
      }));

      return l;
    });

    newLinkedItems.forEach((item) => {
      const keywords = nested.get(`linked item ${item.baseItemId}`).keywords;

      keywords.map((k: any) => {
        keywordData.push({
          ...k,
          itemId: item.id,
        });
      });
    });

    newLinkedActions.forEach((action) => {
      const keywords = nested.get(
        `linked action ${action.baseActionId}`,
      ).keywords;

      keywords.map((k: any) => {
        keywordData.push({
          ...k,
          actionId: action.id,
        });
      });
    });

    await client.keywordReference.createManyAndReturn({
      data: keywordData,
    });
  },

  createItemConditions: async (
    itemId: number,
    formData: { conditionId: number; stacks?: number | null }[],
  ) => {
    const validatedConditionReference = ConditionReferenceInput.parse(formData);

    try {
      const item = await prisma.item.update({
        where: {
          id: itemId,
        },
        data: {
          conditions: {
            deleteMany: {},
            createMany: { data: validatedConditionReference },
          },
        },
        include: itemInclude,
      });

      return item;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create item conditions');
    }
  },

  setItemAvailable: async (itemId: number) => {
    try {
      const item = await prisma.item.update({
        where: { id: itemId },
        data: { available: true },
        include: itemInclude,
      });

      return item;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to set item availability to true');
    }
  },

  setAllCharacterItemsAvailable: async (characterId: number) => {
    try {
      await prisma.item.updateMany({
        where: { characterInventory: { characterId }, available: false },
        data: { available: true },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to set item availability to true');
    }
  },

  setItemNotAvailable: async (itemId: number) => {
    try {
      await prisma.item.update({
        where: { id: itemId },
        data: { available: false },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to set item availability to false');
    }
  },

  deleteItem: async (itemId: number) => {
    try {
      await prisma.item.delete({
        where: {
          id: itemId,
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to delete item');
    }
  },

  deleteItems: async (itemIds: number[]) => {
    try {
      await prisma.item.deleteMany({
        where: {
          id: { in: itemIds },
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to delete items');
    }
  },
};

export default itemServices;
