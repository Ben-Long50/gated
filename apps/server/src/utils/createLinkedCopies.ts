import { Item, Prisma } from '@prisma/client';
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

  const actionIds = [];

  for (const action of itemReference.actions) {
    const newAction = await actionServices.createActionCopy(action.id, client);

    actionIds.push(newAction.id);
  }

  return {
    itemIds: items.map((item) => item.id),
    actionIds,
  };
};
