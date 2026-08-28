import prisma from '../config/database.js';
import { includeCharacterCart } from '../utils/linkQueryStructures.js';
import itemServices, { itemInclude } from './itemServices.js';
import { getIO } from '../sockets/socket.js';
import validateLevelUpBonus from '../utils/validateLevelUpBonus.js';
import {
  CharacterInput,
  CharacterLevelBonus,
  CharacterUpdateInput,
} from '../validation/characterSchema.js';
import { ConditionReferenceInput } from '../validation/conditionSchema.js';
import { Prisma } from '@prisma/client';
import perkServices from './perkServices.js';

export const characterInclude = {
  campaign: {
    select: {
      name: true,
      ownerId: true,
    },
  },
  conditions: {
    include: { condition: true },
    orderBy: { condition: { name: 'asc' as const } },
  },
  affiliations: { select: { id: true } },
  gang: { select: { name: true } },
  controlledGang: { select: { name: true } },
  characterInventory: {
    include: {
      items: { select: { id: true } },
    },
  },
  characterCart: {
    include: includeCharacterCart,
  },
  location: { include: { map: { select: { name: true } } } },
  characterLevelBonuses: { include: { perks: { include: { actions: true } } } },
  generatedPicture: { select: { publicId: true } },
};

const characterServices = {
  getSocialCharacters: async () => {
    try {
      const characters = await prisma.character.findMany({
        orderBy: {
          firstName: 'asc',
        },
        include: {
          characterInventory: {
            include: { items: { select: { id: true } } },
          },
          characterLevelBonuses: {
            include: { perks: { include: { actions: true } } },
          },
        },
      });

      if (characters.length === 0) {
        throw new Error('No public characters exist');
      }

      return characters;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch social characters');
    }
  },

  getCodexCharacters: async () => {
    try {
      const characters = await prisma.character.findMany({
        where: { userId: null },
        select: { id: true },
        orderBy: { firstName: 'asc' },
      });

      if (characters.length === 0) {
        throw new Error('No public characters exist');
      }

      return characters;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch social characters');
    }
  },

  getBatchCharacters: async (characterIds: number[]) => {
    try {
      const characters = await prisma.character.findMany({
        where: {
          id: { in: characterIds },
        },
        include: characterInclude,
        orderBy: { firstName: 'asc' },
      });

      return characters;
    } catch (error: any) {
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
        include: characterInclude,
      });

      return character;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch character');
    }
  },

  getCharacterNotes: async (characterId: number) => {
    try {
      const notes = await prisma.note.findMany({
        where: { characterId },
        include: {
          character: {
            select: {
              userId: true,
              firstName: true,
              lastName: true,
              generatedPicture: { select: { publicId: true } },
            },
          },
          session: {
            select: { sessionNumber: true, createdAt: true, name: true },
          },
        },
        orderBy: { session: { sessionNumber: 'asc' } },
      });

      return notes;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch notes');
    }
  },

  toggleEquipment: async (inventoryId: number, itemId: number) => {
    try {
      const item = await prisma.item.findUnique({
        where: {
          id: Number(itemId),
          characterInventoryId: Number(inventoryId),
        },
        select: {
          id: true,
          equipped: true,
          linkedItems: { select: { id: true } },
        },
      });

      if (!item) {
        throw new Error('Item not found');
      }
      const itemIds = [...item?.linkedItems.map((item) => item.id), item.id];
      const equipped = item?.equipped;

      await prisma.item.updateMany({
        where: { id: { in: itemIds } },
        data: { equipped: !equipped },
      });

      const updatedItem = await prisma.item.findUnique({
        where: { id: item.id },
        include: itemInclude,
      });

      return updatedItem;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to toggle equipment');
    }
  },

  createCharacter: async (
    formData: CharacterInput,
    userId?: number,
    template?: boolean,
  ) => {
    const stats = {
      ...formData.stats,
      currentHealth: formData.stats.maxHealth
        ? formData.stats.maxHealth +
          10 +
          formData.attributes.violence.skills.threshold.points * 2
        : 10 + formData.attributes.violence.skills.threshold.points * 2,
      currentSanity: formData.stats.maxSanity
        ? formData.stats.maxSanity +
          5 +
          formData.attributes.esoterica.skills.mysticism.points
        : 5 + formData.attributes.esoterica.skills.mysticism.points,
      currentActions: formData.stats.actions ? formData.stats.actions + 3 : 3,
      currentReactions: formData.stats.reactions
        ? formData.stats.reactions + 1
        : 1,
      currentHands: formData.stats.hands ? formData.stats.hands + 2 : 2,
      currentFeet: formData.stats.feet ? formData.stats.feet + 2 : 2,
      injuries: 0,
      insanities: 0,
    };

    const { perkIds, attributes, ...data } = formData;

    await validateLevelUpBonus({ level: data.level, attributes, perkIds });

    const character = await prisma.$transaction(
      async (tx) => {
        let newPerkIds = [] as number[];

        if (perkIds) {
          for (const id of perkIds) {
            const newPerk = await perkServices.createPerkCopy(id, tx);

            newPerkIds.push(newPerk.id);
          }
        }

        const character = await tx.character.create({
          data: {
            ...data,
            level: data.playerCharacter ? data.level : undefined,
            stats,
            userId,
            characterLevelBonuses: {
              create: {
                level: data.level ?? 0,
                attributes,
                perks: {
                  connect: newPerkIds.map((perkId) => ({ id: perkId })),
                },
              },
            },
            characterCart: { create: {} },
            characterInventory: { create: {} },
          },
          include: { characterInventory: true },
        });

        if (!template && !character.npcTypes.includes('monster')) {
          const unarmed = await tx.item.findFirst({
            where: { name: 'Unarmed', baseItemId: null },
          });

          if (!unarmed) {
            throw new Error('Failed to find base Unarmed item');
          }

          if (!character.characterInventory) {
            throw new Error('Failed to create character inventory');
          }

          await itemServices.createCharacterItemCopy(
            character.characterInventory.id,
            [{ itemId: unarmed.id, quantity: 1 }],
            tx,
          );
        }

        return character;
      },
      {
        timeout: 15000,
      },
    );

    const newCharacter = await characterServices.getCharacterById(character.id);

    return newCharacter;
  },

  createTemplateCharacter: async (characterId: number) => {
    try {
      const templateCharacter = await prisma.character.findUnique({
        where: { id: characterId },
        select: {
          userId: true,
          firstName: true,
          lastName: true,
          level: true,
          stats: true,
          generatedPictureId: true,
          height: true,
          weight: true,
          age: true,
          sex: true,
          backstory: true,
          firstTaste: true,
          badMedicine: true,
          playerCharacter: true,
          npcTypes: true,
          preferences: true,
          campaignId: true,
          gangId: true,
          controlledGangId: true,
          characterInventory: {
            include: { items: { select: { id: true } } },
          },
          characterLevelBonuses: {
            include: { perks: { include: { actions: true } } },
          },
        },
      });

      if (!templateCharacter) {
        throw new Error('Failed to find template character');
      }

      const { npcTypes, characterInventory, characterLevelBonuses, ...data } =
        templateCharacter;

      const filteredData = Object.fromEntries(
        Object.entries(data)
          .map(([key, value]) => {
            if (value) {
              return [key, value];
            } else {
              return [];
            }
          })
          .filter((item) => item.length > 0),
      );

      const character = await prisma.character.create({
        data: {
          ...filteredData,
          npcTypes: npcTypes.filter((type) => type !== 'template'),
          characterCart: { create: {} },
          characterInventory: { create: {} },
          characterLevelBonuses: {
            createMany: {
              data: characterLevelBonuses.map((bonus) => ({
                characterId: bonus.characterId,
                level: bonus.level,
                attributes: bonus.attributes ? bonus.attributes : undefined,
                perk: bonus.perks
                  ? { connect: bonus.perks.map((perk) => ({ id: perk.id })) }
                  : null,
              })),
            },
          },
        },
        include: characterInclude,
      });

      if (characterInventory && character.characterInventory) {
        const itemList = characterInventory.items.map((item) => ({
          itemId: item.id,
          price: null,
          quantity: 1,
        }));

        await itemServices.createCharacterItemCopy(
          character.characterInventory.id,
          itemList,
        );
      }

      return character;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create character');
    }
  },

  addToInventory: async (
    characterId: number,
    inventoryId: number,
    tx?: Prisma.TransactionClient,
  ) => {
    try {
      const client = tx ?? prisma;

      const character = await client.character.findUnique({
        where: { id: characterId },
        select: {
          profits: true,
          characterCart: {
            select: {
              items: {
                include: {
                  item: { select: { id: true, price: true, itemTypes: true } },
                },
              },
            },
          },
        },
      });

      const profits = character?.profits || 0;
      const cart = character?.characterCart;

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
        await itemServices.createCharacterItemCopy(inventoryId, items, client);
      }

      const updatedCharacter = await client.character.update({
        where: { id: characterId },
        data: { profits: { decrement: totalPrice } },
        include: characterInclude,
      });

      return updatedCharacter;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to add items to inventory');
    }
  },

  clearCart: async (characterId: number, tx?: Prisma.TransactionClient) => {
    try {
      const client = tx ?? prisma;

      await client.characterCart.update({
        where: { characterId: Number(characterId) },
        data: {
          items: {
            deleteMany: {},
          },
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to clear cart');
    }
  },

  updateCharacter: async (formData: CharacterUpdateInput) => {
    try {
      const { id, stats, ...data } = formData;

      const oldCharacter = await prisma.character.findUnique({
        where: { id },
        select: {
          characterInventory: {
            select: {
              id: true,
            },
          },
          stats: true,
        },
      });

      const newStats = {
        ...(oldCharacter?.stats as Record<string, number>),
        ...stats,
      };

      const character = await prisma.$transaction(async (tx) => {
        const character = await tx.character.update({
          where: {
            id,
          },
          data: {
            ...data,
            stats: newStats,
          },
          include: characterInclude,
        });

        return character;
      });

      return character;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to update character');
    }
  },

  updateCharacterLevel: async (characterId: number, levelChange: number) => {
    try {
      const character = await prisma.character.update({
        where: {
          id: characterId,
        },
        data: {
          level: { increment: levelChange },
        },
        include: characterInclude,
      });

      return character;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to change character level');
    }
  },

  selectLevelUpBonus: async (bonus: CharacterLevelBonus) => {
    const character = await characterServices.getCharacterById(
      bonus.characterId,
    );

    if (!character) {
      throw new Error('Failed to find character');
    }

    const updatedCharacter = prisma.$transaction(async (tx) => {
      let newPerkIds = [] as number[];

      if (bonus.perkIds) {
        for (const id of bonus.perkIds) {
          const newPerk = await perkServices.createPerkCopy(id, tx);

          newPerkIds.push(newPerk.id);
        }
      }

      const updatedCharacter = await tx.character.update({
        where: {
          id: bonus.characterId,
        },
        data: {
          characterLevelBonuses: {
            upsert: {
              where: {
                characterId_level: {
                  characterId: bonus.characterId,
                  level: bonus.level,
                },
              },
              update: {
                attributes: bonus.attributes ?? undefined,
                perks: {
                  deleteMany: {},
                  connect: newPerkIds.map((newPerkId) => ({ id: newPerkId })),
                },
              },
              create: {
                level: bonus.level,
                attributes: bonus.attributes ?? undefined,
                perks: {
                  connect: newPerkIds.map((newPerkId) => ({ id: newPerkId })),
                },
              },
            },
          },
        },
        include: characterInclude,
      });

      return updatedCharacter;
    });

    return updatedCharacter;
  },

  createCharacterConditions: async (
    characterId: number,
    formData: { conditionId: number; stacks?: number | null }[],
  ) => {
    const validatedConditionReference = ConditionReferenceInput.parse(formData);

    try {
      const character = await prisma.character.update({
        where: {
          id: characterId,
        },
        data: {
          conditions: {
            deleteMany: {},
            createMany: { data: validatedConditionReference },
          },
        },
        include: characterInclude,
      });

      return character;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create character conditions');
    }
  },

  createOrUpdateLocation: async (
    characterId: number,
    formData: { mapId: number; row: number; col: number },
  ) => {
    try {
      const io = getIO();

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
        include: { character: { select: { campaignId: true } } },
      });

      io.to(`campaign ${location.character?.campaignId}`).emit('location', {
        characterId,
        locationId: location.id,
        mapId: location.mapId,
        row: location.row,
        col: location.col,
      });
    } catch (error: any) {
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
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to delete character location');
    }
  },

  deleteCharacter: async (userId: number, characterId: number) => {
    try {
      const character = await prisma.character.findUnique({
        where: {
          id: characterId,
        },
        select: {
          affiliations: { select: { id: true } },
        },
      });

      if (!character) {
        throw new Error('Failed to find character');
      }

      await prisma.$transaction(async (tx) => {
        await tx.affiliation.deleteMany({
          where: {
            id: {
              in: character.affiliations.map((affiliation) => affiliation.id),
            },
          },
        });

        await tx.character.delete({
          where: {
            id: characterId,
            userId,
          },
        });
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to delete character');
    }
  },
};

export default characterServices;
