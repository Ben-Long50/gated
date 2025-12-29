// @ts-nocheck

import prisma from '../config/database.js';
import { Character } from '../types/character.js';
import {
  includeCharacterCart,
  includeCharacterInventory,
  unequipLinked,
} from '../utils/linkQueryStructures.js';
import { ItemType } from '@prisma/client';
import itemServices from './itemServices.js';
import calculateCharacterStats from '../utils/characterStatUtils.js';

const characterServices = {
  getCharacters: async (userId: number) => {
    try {
      const characters = await prisma.character.findMany({
        where: {
          userId,
        },
        select: { id: true },
      });

      if (characters.length === 0) {
        throw new Error('You have not created any characters');
      }

      return characters;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch characters');
    }
  },

  getBatchCharacters: async (characterIds: number[]) => {
    try {
      const characters = await prisma.character.findMany({
        where: {
          id: { in: characterIds },
        },
        include: {
          campaign: {
            select: {
              name: true,
              ownerId: true,
            },
          },
          conditions: {
            include: { condition: true },
            orderBy: { condition: { name: 'asc' } },
          },
          affiliations: { select: { id: true } },
          perks: true,
          characterInventory: {
            include: includeCharacterInventory,
          },
          characterCart: {
            include: includeCharacterCart,
          },
          location: { include: { map: { select: { name: true } } } },
        },
      });

      if (characters.length === 0) {
        throw new Error('You have not created any characters');
      }

      characters.forEach(
        (character) => (character.stats = calculateCharacterStats(character)),
      );

      return characters;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch characters');
    }
  },

  getCharacterById: async (characterId: number) => {
    try {
      const character = await prisma.character.findUnique({
        where: {
          id: characterId,
        },
        include: {
          campaign: {
            select: {
              name: true,
              ownerId: true,
            },
          },
          conditions: {
            include: { condition: true },
            orderBy: { condition: { name: 'asc' } },
          },
          affiliations: { select: { id: true } },
          perks: true,
          characterInventory: {
            include: includeCharacterInventory,
          },
          characterCart: {
            include: includeCharacterCart,
          },
          location: { include: { map: { select: { name: true } } } },
        },
      });

      character.stats = calculateCharacterStats(character);

      return character;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch character');
    }
  },

  setActiveCharacter: async (userId: number, characterId: string) => {
    try {
      await prisma.character.updateMany({
        where: { id: { not: Number(characterId) }, userId },
        data: { active: false },
      });
      const activeCharacter = await prisma.character.update({
        where: { id: Number(characterId), userId },
        data: { active: true },
      });

      return activeCharacter;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to switch active character');
    }
  },

  toggleEquipment: async (
    inventoryId: string,
    itemId: string,
    category: ItemType[],
  ) => {
    try {
      const item = await prisma.item.findUnique({
        where: {
          id: Number(itemId),
          itemTypes: { hasSome: category },
          characterInventoryId: Number(inventoryId),
        },
        select: { id: true, equipped: true },
      });

      if (!item) {
        throw new Error('Item not found');
      }

      await prisma.item.update({
        where: { id: item.id },
        data: { equipped: item.equipped ? false : true },
      });

      await prisma.$transaction([
        prisma.itemLinkReference.update({
          where: { itemId: item.id },
          data: item.equipped
            ? unequipLinked
            : {
                items: {
                  updateMany: {
                    where: {},
                    data: {
                      equipped: true,
                    },
                  },
                },
                actions: {
                  updateMany: {
                    where: { actionType: 'passive' },
                    data: {
                      active: true,
                      equipped: true,
                    },
                  },
                },
              },
        }),
        prisma.itemLinkReference.update({
          where: { itemId: item.id },
          data: item.equipped
            ? unequipLinked
            : {
                actions: {
                  updateMany: {
                    where: { actionType: { not: 'passive' } },
                    data: {
                      equipped: true,
                    },
                  },
                },
              },
        }),
      ]);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to toggle equipment');
    }
  },

  createCharacter: async (
    formData: Character,
    userId: number,
    template?: boolean,
  ) => {
    try {
      const startingStats = {
        currentHealth: formData.stats?.currentHealth,
        currentSanity: formData.stats?.currentSanity,
        currentActions: 3,
        currentReactions: 1,
        currentHands: 2,
        injuries: 0,
        insanities: 0,
      };

      const data = {
        ...formData,
        userId,
        stats: {
          ...formData.stats,
          ...startingStats,
        },
        perks: {
          connect: formData.perks?.map((id: number) => ({ id })) || [],
        },
      };

      const newCharacter = await prisma.character.create({
        data,
      });

      await characterServices.createCharacterCart(newCharacter.id);
      const characterInventory =
        await characterServices.createCharacterInventory(newCharacter.id);

      if (!template) {
        const unarmed = await prisma.item.findFirst({
          where: { name: 'Unarmed', baseItemId: null },
        });

        if (!unarmed) {
          throw new Error('Failed to find base Unarmed item');
        }

        await itemServices.createCharacterItemCopy(
          userId,
          characterInventory.id,
          [{ itemId: unarmed.id, price: null, quantity: 2 }],
        );
      }

      return newCharacter;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create character');
    }
  },

  createTemplateCharacter: async (characterId: number, userId: number) => {
    try {
      const templateCharacter =
        await characterServices.getCharacterById(characterId);

      if (!templateCharacter) {
        throw new Error('Failed to find template character');
      }

      if (templateCharacter.userId !== userId) {
        throw new Error(
          "Only the template character's owner may make copies of it",
        );
      }

      const {
        id,
        createdAt,
        user,
        userId: prevUserId,
        profits,
        location,
        locationId,
        active,
        sessions,
        conditions,
        characterCart,
        characterInventory,
        Note,
        affiliations,
        activeHistory,
        targetHistory,
        encounters,
        campaign,
        npcTypes,
        perks,
        ...data
      } = templateCharacter;

      const newCharacter = await characterServices.createCharacter(
        { ...data, perks: perks.map((perk) => perk.id) },
        userId,
        true,
      );

      const createdCharacter = await characterServices.getCharacterById(
        newCharacter.id,
      );

      if (characterInventory && createdCharacter?.characterInventory) {
        const itemList = characterInventory.items.map((item) => ({
          itemId: item.id,
          price: null,
          quantity: 1,
        }));

        await itemServices.createCharacterItemCopy(
          userId,
          createdCharacter.characterInventory?.id,
          itemList,
        );
      }

      return newCharacter;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create character');
    }
  },

  createCharacterCart: async (characterId: number) => {
    try {
      await prisma.characterCart.create({
        data: {
          character: { connect: { id: characterId } },
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create character cart');
    }
  },

  createCharacterInventory: async (characterId: number) => {
    try {
      const characterInventory = await prisma.characterInventory.create({
        data: {
          character: { connect: { id: characterId } },
        },
      });

      return characterInventory;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create character inventory');
    }
  },

  addToInventory: async (
    userId: number,
    characterId: number,
    inventoryId: number,
  ) => {
    try {
      const profits =
        (
          await prisma.character.findUnique({
            where: { id: characterId },
            select: { profits: true },
          })
        )?.profits || 0;

      const cart = await prisma.characterCart.findUnique({
        where: { characterId },
        select: {
          items: {
            include: {
              item: { select: { id: true, price: true, itemTypes: true } },
            },
          },
        },
      });

      const items =
        cart?.items.map((item) => ({
          itemId: item.item.id,
          quantity: item.quantity,
          price: item.item.price,
        })) || [];

      const totalPrice = cart?.items
        .flat()
        .map((reference) => {
          const targetObject = Object.values(reference).find(
            (item) => typeof item === 'object',
          );
          return targetObject?.price
            ? reference.quantity * targetObject.price
            : 0;
        })
        .reduce((sum, item) => sum + item, 0);

      if (typeof totalPrice !== 'number') {
        throw new Error('Failed to calculate total cart price');
      }

      if (totalPrice > profits) {
        throw new Error(
          'You do not have enough profits to complete this purchase',
        );
      }

      if (items.length > 0) {
        itemServices.createCharacterItemCopy(userId, inventoryId, items);
      }

      await prisma.character.update({
        where: { id: Number(characterId) },
        data: { profits: profits - totalPrice },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to add items to inventory');
    }
  },

  clearCart: async (characterId: number) => {
    try {
      await prisma.characterCart.update({
        where: { characterId: Number(characterId) },
        data: {
          items: {
            deleteMany: {},
          },
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to clear cart');
    }
  },

  updateCharacter: async (
    formData: Partial<Character>,
    userId: number,
    characterId: number,
  ) => {
    try {
      const data = {
        ...formData,
      };

      if (formData.perks) {
        //@ts-ignore
        data.perks = { set: formData.perks.map((perk) => ({ id: perk })) };
      }

      const updatedCharacter = await prisma.character.update({
        where: {
          userId,
          id: Number(characterId),
        },
        //@ts-ignore
        data,
      });

      return updatedCharacter.campaignId;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update character');
    }
  },

  createCharacterConditions: async (
    characterId: number,
    formData: { conditionId: number; stacks?: number | null }[],
  ) => {
    try {
      const character = await prisma.character.findUnique({
        where: { id: characterId },
        include: {
          conditions: { select: { id: true } },
        },
      });

      if (!character) {
        throw new Error('Failed to find character');
      }

      if (character && character.conditions) {
        await prisma.characterConditionReference.deleteMany({
          where: {
            id: { in: character.conditions.map((condition) => condition.id) },
          },
        });
      }

      const conditionData =
        formData?.map((condition) => ({
          conditionId: condition.conditionId,
          stacks: condition.stacks ? condition.stacks : null,
        })) || [];

      await prisma.character.update({
        where: {
          id: characterId,
        },
        data: {
          conditions: { createMany: { data: conditionData } },
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create character conditions');
    }
  },

  createOrUpdateLocation: async (
    characterId: number,
    formData: { mapId: number; row: number; col: number },
  ) => {
    try {
      const location = await prisma.location.upsert({
        where: {
          characterId: characterId || 0,
        },
        update: {
          map: { connect: { id: formData.mapId } },
          row: formData.row,
          col: formData.col,
        },
        create: {
          character: { connect: { id: characterId } },
          map: { connect: { id: formData.mapId } },
          row: formData.row,
          col: formData.col,
        },
      });

      return location.id;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update character location');
    }
  },

  deleteLocation: async (characterId: number) => {
    try {
      await prisma.location.delete({
        where: {
          characterId,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to delete character location');
    }
  },

  deleteCharacter: async (userId: number, characterId: string) => {
    try {
      await prisma.character.delete({
        where: {
          userId: userId,
          id: Number(characterId),
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to delete character');
    }
  },
};

export default characterServices;
