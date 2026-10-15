import { ItemRarity, ItemType, Prisma } from '@prisma/client';
import prisma from '../config/database.js';
import { characterInclude } from './characterServices.js';

const cartServices = {
  editCartItem: async (
    characterId: number,
    cartId: number,
    itemId: number,
    value: number,
    tx?: Prisma.TransactionClient,
  ) => {
    const client = tx ?? prisma;

    const cartItem = await client.cartItemRelation.findUnique({
      where: { characterCartId_itemId: { characterCartId: cartId, itemId } },
    });

    let remove = false;

    if (cartItem && cartItem.quantity + value === 0) {
      remove = true;
    }

    const character = await client.character.update({
      where: { id: characterId },
      data: {
        characterCart: {
          update: {
            items: remove
              ? {
                  delete: {
                    characterCartId_itemId: {
                      characterCartId: cartId,
                      itemId,
                    },
                  },
                }
              : {
                  upsert: {
                    where: {
                      characterCartId_itemId: {
                        characterCartId: cartId,
                        itemId,
                      },
                    },
                    update: {
                      quantity: { increment: value },
                    },
                    create: {
                      itemId,
                      quantity: value,
                    },
                  },
                },
          },
        },
      },
      include: characterInclude,
    });

    return character;
  },

  addBulkItems: async (
    characterId: number,
    formData: {
      quantity: number;
      rarities: ItemRarity[];
      itemTypes: ItemType[];
    },
  ) => {
    const character = await prisma.$transaction(
      async (tx) => {
        const character = await tx.character.findUnique({
          where: { id: characterId },
          select: {
            characterCart: {
              select: {
                id: true,
                items: { select: { itemId: true } },
              },
            },
            profits: true,
            npcTypes: true,
          },
        });

        const cartItemIds = character?.characterCart?.items.map(
          (item) => item.itemId,
        );

        if (!character?.npcTypes.includes('shop')) {
          throw new Error('Only merchant npcs can make bulk item purchases');
        }

        if (!character || !character.characterCart) {
          throw new Error('Failed to find character');
        }

        const items = await tx.item.findMany({
          where: {
            baseItemId: null,
            characterInventoryId: null,
            itemTypes: { hasSome: formData.itemTypes },
            rarity: { in: formData.rarities },
          },
          select: { id: true, price: true },
        });

        const updateItemIds = items
          .filter((item) => cartItemIds?.includes(item.id))
          .map((item) => item.id);

        const createItemIds = items
          .filter((item) => !cartItemIds?.includes(item.id))
          .map((item) => item.id);

        await tx.cartItemRelation.updateMany({
          where: {
            characterCartId: character.characterCart.id,
            itemId: { in: updateItemIds },
          },
          data: { quantity: { increment: formData.quantity } },
        });

        await tx.cartItemRelation.createMany({
          data: createItemIds.map((itemId) => ({
            characterCartId: character.characterCart?.id,
            itemId,
            quantity: formData.quantity,
          })),
        });

        const updatedCharacter = await tx.character.findUnique({
          where: { id: characterId },
          include: characterInclude,
        });

        return updatedCharacter;
      },
      { timeout: 15000 },
    );

    return character;
  },
};

export default cartServices;
