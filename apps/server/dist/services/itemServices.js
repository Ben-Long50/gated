var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import prisma from '../config/database.js';
import { enforceSingularLinking } from '../utils/enforceSingularLinking.js';
import { createLinkedCopies } from '../utils/createLinkedCopies.js';
import actionServices from './actionServices.js';
const itemInclude = {
    baseItem: true,
    itemLinkReference: {
        include: {
            items: {
                include: {
                    keywords: {
                        include: { keyword: true },
                        orderBy: { keyword: { name: 'asc' } },
                    },
                    modifiedKeywords: {
                        include: { keyword: true },
                        orderBy: { keyword: { name: 'asc' } },
                    },
                    conditions: {
                        include: { condition: true },
                        orderBy: { condition: { name: 'asc' } },
                    },
                },
            },
            actions: {
                include: { keywordModifiers: { include: { keyword: true } } },
            },
        },
    },
    keywords: {
        include: { keyword: true },
        orderBy: { keyword: { name: 'asc' } },
    },
    modifiedKeywords: {
        include: { keyword: true },
        orderBy: { keyword: { name: 'asc' } },
    },
    conditions: {
        include: { condition: true },
        orderBy: { condition: { name: 'asc' } },
    },
};
const itemServices = {
    getItems: async (category) => {
        try {
            const items = await prisma.item.findMany({
                where: category
                    ? {
                        characterInventory: null,
                        itemLinkId: null,
                        itemTypes: { hasSome: category },
                    }
                    : { characterInventory: null, itemLinkId: null },
                include: itemInclude,
                orderBy: { name: 'asc' },
            });
            return items;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch items');
        }
    },
    getBatchItems: async (itemIds) => {
        try {
            const items = await prisma.item.findMany({
                where: { id: { in: itemIds } },
                include: itemInclude,
            });
            return items;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch item');
        }
    },
    getItemById: async (itemId) => {
        try {
            const item = await prisma.item.findUnique({
                where: { id: itemId },
                include: itemInclude,
            });
            if (!item) {
                throw new Error('Failed to find item');
            }
            return item;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch item');
        }
    },
    createOrUpdateItem: async (formData) => {
        try {
            const { id, itemIds, actionIds, keywords, pictureFile } = formData, data = __rest(formData, ["id", "itemIds", "actionIds", "keywords", "pictureFile"]);
            formData.id &&
                (await enforceSingularLinking(formData.id, itemIds, actionIds));
            const item = await prisma.item.upsert({
                where: { id: formData.id || 0 },
                update: Object.assign(Object.assign({}, data), { updatedAt: new Date(), itemLinkReference: {
                        upsert: {
                            where: { itemId: formData.id || 0 },
                            update: {
                                items: {
                                    set: itemIds === null || itemIds === void 0 ? void 0 : itemIds.map((id) => ({ id })),
                                },
                                actions: {
                                    set: actionIds === null || actionIds === void 0 ? void 0 : actionIds.map((id) => ({ id })),
                                },
                            },
                            create: {
                                items: {
                                    connect: itemIds === null || itemIds === void 0 ? void 0 : itemIds.map((id) => ({ id })),
                                },
                                actions: {
                                    connect: actionIds === null || actionIds === void 0 ? void 0 : actionIds.map((id) => ({ id })),
                                },
                            },
                        },
                    }, keywords: { deleteMany: {}, createMany: { data: formData.keywords } } }),
                create: Object.assign(Object.assign({}, data), { itemLinkReference: {
                        create: {
                            items: {
                                connect: itemIds === null || itemIds === void 0 ? void 0 : itemIds.map((id) => ({ id })),
                            },
                            actions: {
                                connect: actionIds === null || actionIds === void 0 ? void 0 : actionIds.map((id) => ({ id })),
                            },
                        },
                    }, keywords: { createMany: { data: formData.keywords } } }),
                include: itemInclude,
            });
            return item;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create or update item');
        }
    },
    upgradeItem: async (formData) => {
        try {
            const item = await prisma.item.update({
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
            return item;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create or update item');
        }
    },
    createItemCopy: async (itemId) => {
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
                    itemLinkReference: {
                        include: {
                            items: { select: { id: true } },
                            actions: { select: { id: true } },
                        },
                    },
                    keywords: { select: { keywordId: true, value: true } },
                },
            });
            if (!itemDetails) {
                throw new Error('Failed to find original item');
            }
            const { id, baseItemId, stats, picture, keywords, itemLinkReference } = itemDetails, data = __rest(itemDetails, ["id", "baseItemId", "stats", "picture", "keywords", "itemLinkReference"]);
            const typedPicture = picture;
            const typedStats = stats;
            const itemIds = [];
            const actionIds = [];
            if (itemLinkReference === null || itemLinkReference === void 0 ? void 0 : itemLinkReference.items) {
                for (let item of itemLinkReference === null || itemLinkReference === void 0 ? void 0 : itemLinkReference.items) {
                    const newItem = await itemServices.createItemCopy(item.id);
                    itemIds.push(newItem.id);
                }
            }
            if (itemLinkReference === null || itemLinkReference === void 0 ? void 0 : itemLinkReference.actions) {
                for (let action of itemLinkReference === null || itemLinkReference === void 0 ? void 0 : itemLinkReference.actions) {
                    const newItem = await actionServices.createActionCopy(action.id);
                    actionIds.push(newItem.id);
                }
            }
            const item = await prisma.item.create({
                data: Object.assign(Object.assign({}, data), { picture: typedPicture, stats: typedStats, itemLinkReference: {
                        create: {
                            items: {
                                connect: itemIds.map((id) => ({ id })),
                            },
                            actions: {
                                connect: actionIds.map((id) => ({ id })),
                            },
                        },
                    }, keywords: { createMany: { data: keywords } }, baseItemId: id }),
            });
            return item;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create item copy');
        }
    },
    createCharacterItemCopy: async (userId, inventoryId, itemList) => {
        const itemIds = itemList === null || itemList === void 0 ? void 0 : itemList.map((item) => item.itemId);
        const items = await prisma.item.findMany({
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
                itemLinkReference: {
                    include: {
                        items: { select: { id: true } },
                        actions: { select: { id: true } },
                    },
                },
                keywords: { select: { keywordId: true, value: true } },
            },
        });
        const promises = [];
        for (const { itemId, quantity } of itemList) {
            const itemDetails = items.find((item) => item.id === itemId);
            if (!itemDetails)
                continue;
            const { id, baseItemId, itemLinkReference, keywords, picture, stats } = itemDetails, rest = __rest(itemDetails, ["id", "baseItemId", "itemLinkReference", "keywords", "picture", "stats"]);
            const typedPicture = picture;
            const typedStats = stats;
            const { itemIds, actionIds } = await createLinkedCopies(userId, itemLinkReference, inventoryId, quantity);
            if (itemDetails) {
                for (let i = 0; i < quantity; i++) {
                    promises.push(prisma.item.create({
                        data: Object.assign(Object.assign({}, rest), { picture: typedPicture, stats: typedStats, updatedAt: new Date(), characterInventoryId: inventoryId, baseItemId: baseItemId || id, userId, itemLinkReference: {
                                create: {
                                    items: {
                                        connect: itemIds === null || itemIds === void 0 ? void 0 : itemIds.map((id) => ({ id })),
                                    },
                                    actions: {
                                        connect: actionIds === null || actionIds === void 0 ? void 0 : actionIds.map((id) => ({ id })),
                                    },
                                },
                            }, keywords: {
                                createMany: {
                                    data: keywords,
                                },
                            } }),
                        include: itemInclude,
                    }));
                }
            }
        }
        const newItems = await Promise.all(promises);
        return newItems;
    },
    createItemConditions: async (itemId, formData) => {
        try {
            const item = await prisma.item.update({
                where: {
                    id: itemId,
                },
                data: {
                    conditions: { deleteMany: {}, createMany: { data: formData } },
                },
                include: itemInclude,
            });
            return item;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create item conditions');
        }
    },
    setItemAvailable: async (itemId) => {
        try {
            const item = await prisma.item.update({
                where: { id: itemId },
                data: { available: true },
                include: itemInclude,
            });
            return item;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to set item availability to true');
        }
    },
    setAllCharacterItemsAvailable: async (characterId) => {
        try {
            await prisma.item.updateMany({
                where: { characterInventory: { characterId }, available: false },
                data: { available: true },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to set item availability to true');
        }
    },
    setItemNotAvailable: async (itemId) => {
        try {
            await prisma.item.update({
                where: { id: itemId },
                data: { available: false },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to set item availability to false');
        }
    },
    deleteItem: async (itemId) => {
        try {
            await prisma.item.delete({
                where: {
                    id: itemId,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to delete item');
        }
    },
    deleteItems: async (itemIds) => {
        try {
            await prisma.item.deleteMany({
                where: {
                    id: { in: itemIds },
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to delete items');
        }
    },
};
export default itemServices;
