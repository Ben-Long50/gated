import actionServices from '../services/actionServices.js';
import itemServices from '../services/itemServices.js';
export const createLinkedCopies = async (userId, itemReference, inventoryId, quantity) => {
    let items = [];
    let actions = [];
    if (itemReference &&
        'items' in itemReference &&
        (itemReference === null || itemReference === void 0 ? void 0 : itemReference.items.length) > 0) {
        const itemInfo = itemReference.items.map((item) => {
            return { itemId: item.id, price: 0, quantity };
        });
        items = await itemServices.createCharacterItemCopy(userId, inventoryId, itemInfo);
    }
    if (itemReference &&
        'actions' in itemReference &&
        (itemReference === null || itemReference === void 0 ? void 0 : itemReference.actions.length) > 0) {
        const actionInfo = itemReference.actions.map((action) => {
            return { actionId: action.id, quantity };
        });
        actions = await actionServices.createCharacterActionCopy(inventoryId, actionInfo);
    }
    return {
        itemIds: items.map((item) => item.id),
        actionIds: actions.map((action) => action.id),
    };
};
