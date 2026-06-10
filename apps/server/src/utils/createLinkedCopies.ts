import { Action, Item, Prisma } from '@prisma/client';
import prisma from '../config/database.js';
import actionServices from '../services/actionServices.js';
import itemServices from '../services/itemServices.js';
import { LinkReferencePlaylaod } from '../types/linkReferencePayloads';

export const createLinkedCopies = async (
  itemReference: LinkReferencePlaylaod,
  inventoryId: number,
  quantity: number,
  tx?: Prisma.TransactionClient,
) => {
  const client = tx ?? prisma;

  if (!itemReference) {
    throw new Error('Item reference not found');
  }

  const itemInfo = itemReference.items.map((item) => ({
    itemId: item.id,
    price: 0,
    quantity,
  }));

  const items = (await itemServices.createCharacterItemCopy(
    inventoryId,
    itemInfo,
    client,
  )) as Item[];

  const actionInfo = itemReference.actions.map((action) => ({
    actionId: action.id,
    quantity,
  }));

  const actions = (await actionServices.createCharacterActionCopy(
    actionInfo,
    undefined,
    client,
  )) as Action[];

  return {
    itemIds: items.map((item) => item.id),
    actionIds: actions.map((action) => action.id),
  };
};
