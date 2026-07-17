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
