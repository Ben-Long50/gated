import prisma from '../config/database.js';
import actionServices from '../services/actionServices.js';
import itemServices from '../services/itemServices.js';
export const createLinkedCopies = async (itemReference, inventoryId, quantity, tx) => {
    const client = tx !== null && tx !== void 0 ? tx : prisma;
    if (!itemReference) {
        throw new Error('Item reference not found');
    }
    const itemInfo = itemReference.items.map((item) => ({
        itemId: item.id,
        price: 0,
        quantity,
    }));
    const items = (await itemServices.createCharacterItemCopy(inventoryId, itemInfo, client));
    const actionInfo = itemReference.actions.map((action) => ({
        actionId: action.id,
        quantity,
    }));
    const actions = (await actionServices.createCharacterActionCopy(actionInfo, undefined, client));
    return {
        itemIds: items.map((item) => item.id),
        actionIds: actions.map((action) => action.id),
    };
};
