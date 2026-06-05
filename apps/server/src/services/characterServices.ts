import prisma from '../config/database.js';
import {
  includeCharacterCart,
  unequipLinked,
} from '../utils/linkQueryStructures.js';
import itemServices, { itemInclude } from './itemServices.js';
import { getIO } from '../sockets/socket.js';
import subtractAttributeTrees from '../utils/subtractAttributeTrees.js';
import validateLevelUpBonus from '../utils/validateLevelUpBonus.js';
import {
  CharacterInput,
  CharacterLevelBonus,
  CharacterUpdateInput,
} from '../validation/characterSchema.js';
import { Attributes } from '../validation/fieldSchemas.js';
import { ConditionReferenceInput } from '../validation/conditionSchema.js';

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
  perks: true,
  characterInventory: {
    include: { items: { select: { id: true } } },
  },
  characterCart: {
    include: includeCharacterCart,
  },
  location: { include: { map: { select: { name: true } } } },
  characterLevelBonuses: { include: { perks: true } },
};

const characterServices = {
  getSocialCharacters: async () => {
    try {
      const characters = await prisma.character.findMany({
        orderBy: {
          firstName: 'asc',
        },
        include: {
          perks: true,
          characterInventory: {
            include: { items: { select: { id: true } } },
          },
          characterLevelBonuses: { include: { perks: true } },
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
        where: { base: true },
        select: { id: true },
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
              picture: true,
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
        select: { id: true, equipped: true },
      });

      if (!item) {
        throw new Error('Item not found');
      }

      const updatedItem = await prisma.$transaction(async (tx) => {
        await tx.itemLinkReference.update({
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
        });

        await tx.itemLinkReference.update({
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
        });

        return await tx.item.update({
          where: { id: item.id },
          data: { equipped: !item.equipped },
          include: itemInclude,
        });
      });

      return updatedItem;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to toggle equipment');
    }
  },

  createCharacter: async (
    formData: CharacterInput & { base?: boolean },
    userId?: number,
    template?: boolean,
  ) => {
    try {
      const stats = {
        ...formData.stats,
        currentHealth:
          10 + formData.attributes.violence.skills.threshold.points * 2,
        currentSanity:
          5 + formData.attributes.esoterica.skills.mysticism.points,
        currentActions: 3,
        currentReactions: 1,
        currentHands: 2,
        currentFeet: 2,
        injuries: 0,
        insanities: 0,
      };

      const { perkIds, ...data } = formData;

      const character = await prisma.character.create({
        data: {
          ...data,
          stats,
          userId,
          perks: { connect: perkIds.map((id) => ({ id })) },
          characterLevelBonuses: {
            create: {
              level: 1,
              attributes: formData.attributes,
              perks: { connect: perkIds.map((id) => ({ id })) },
            },
          },
          characterCart: { create: {} },
          characterInventory: { create: {} },
        },
        include: characterInclude,
      });

      if (!template) {
        const unarmed = await prisma.item.findFirst({
          where: { name: 'Unarmed', baseItemId: null },
        });

        if (!unarmed) {
          throw new Error('Failed to find base Unarmed item');
        }

        if (!character.characterInventory) {
          throw new Error('Failed to create character inventory');
        }

        await itemServices.createCharacterItemCopy(
          userId,
          character.characterInventory.id,
          [{ itemId: unarmed.id, price: null, quantity: 2 }],
        );
      }

      return character;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create character');
    }
  },

  createTemplateCharacter: async (characterId: number, userId: number) => {
    try {
      const templateCharacter = await prisma.character.findUnique({
        where: { id: characterId },
        select: {
          userId: true,
          firstName: true,
          lastName: true,
          level: true,
          stats: true,
          picture: true,
          height: true,
          weight: true,
          age: true,
          sex: true,
          backstory: true,
          firstTaste: true,
          badMedicine: true,
          attributes: true,
          playerCharacter: true,
          npcTypes: true,
          preferences: true,
          campaignId: true,
          gangId: true,
          controlledGangId: true,
          perks: true,
          characterInventory: {
            include: { items: { select: { id: true } } },
          },
          characterLevelBonuses: { include: { perks: true } },
        },
      });

      if (!templateCharacter) {
        throw new Error('Failed to find template character');
      }

      const {
        npcTypes,
        perks,
        characterInventory,
        characterLevelBonuses,
        ...data
      } = templateCharacter;

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
          base: false,
          characterCart: { create: {} },
          characterInventory: { create: {} },
          characterLevelBonuses: {
            createMany: {
              data: characterLevelBonuses.map((bonus) => ({
                characterId: bonus.characterId,
                level: bonus.level,
                attributes: bonus.attributes ? bonus.attributes : undefined,
                perks:
                  bonus.perks.length > 0
                    ? {
                        connect: bonus.perks.map((perk) => ({ id: perk.id })),
                      }
                    : [],
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
          userId,
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

  createCharacterCart: async (characterId: number) => {
    try {
      await prisma.characterCart.create({
        data: {
          character: { connect: { id: characterId } },
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create character cart');
    }
  },

  createCharacterInventory: async (characterId: number) => {
    try {
      await prisma.characterInventory.create({
        data: {
          character: { connect: { id: characterId } },
        },
      });
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to clear cart');
    }
  },

  updateCharacter: async (formData: CharacterUpdateInput) => {
    try {
      const { id, ...data } = formData;

      const character = await prisma.character.update({
        where: {
          id,
        },
        data,
        include: characterInclude,
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

  selectLevelUpBonus: async (
    characterId: number,
    bonus: CharacterLevelBonus,
  ) => {
    try {
      const character = await characterServices.getCharacterById(characterId);

      if (!character) {
        throw new Error('Failed to find character');
      }

      const perks = bonus.perkIds
        ? await prisma.perk.findMany({
            where: { id: { in: bonus.perkIds } },
            select: { id: true, name: true, attributes: true },
          })
        : [];

      const validated = validateLevelUpBonus({
        level: bonus.level,
        attributes: bonus.attributes,
        perks,
      });

      if (!validated) {
        throw new Error(
          'The incorrect amount of level up bonus points have been distributed',
        );
      }

      const levelUpBonusTree = bonus.attributes
        ? subtractAttributeTrees(bonus.attributes, character?.attributes)
        : null;

      const data = {} as {
        attributes: Attributes;
        perks: { connect: { id: number | undefined }[] };
      };
      const bonusData = { level: bonus.level } as {
        level: number;
        attributes: Attributes;
        perks: { connect: { id: number | undefined }[] };
      };

      if (bonus.attributes) {
        data.attributes = bonus.attributes;
        bonusData.attributes = levelUpBonusTree;
      }

      if (bonus.perkIds) {
        data.perks = {
          connect: bonus.perkIds.map((perkId) => ({ id: perkId })),
        };
        bonusData.perks = {
          connect: bonus.perkIds
            .filter(
              (perkId) => !character?.perks.some((perk) => perk.id === perkId),
            )
            .map((perkId) => ({ id: perkId })),
        };
      }

      const updatedCharacter = await prisma.character.update({
        where: {
          id: characterId,
        },
        data: {
          ...data,
          characterLevelBonuses: {
            create: bonusData,
          },
        },
        include: characterInclude,
      });

      return updatedCharacter;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to select level up bonus');
    }
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
