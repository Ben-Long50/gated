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
import actionServices from './actionServices.js';
import { ItemInput } from '../validation/itemSchema.js';
import { ConditionReferenceInput } from '../validation/conditionSchema.js';
import addVariableStats from '../utils/addVariableStats.js';
import { ActionInput } from '../validation/actionSchema.js';
export const itemInclude = {
    baseItem: true,
    characterInventory: {
        select: { characterId: true, character: { select: { userId: true } } },
    },
    linkedItems: {
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
    linkedActions: {
        include: {
            keywordModifiers: { include: { keyword: { select: { id: true } } } },
            parentItem: { select: { name: true } },
        },
        orderBy: { name: 'asc' },
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
    generatedPicture: { select: { publicId: true } },
};
const itemServices = {
    getCodexPreviewItems: async () => {
        try {
            const itemData = [
                {
                    itemTypes: { hasEvery: ['weapon'] },
                    baseItemId: null,
                },
                {
                    itemTypes: { hasEvery: ['weapon'] },
                    keywords: { some: { keyword: { name: 'Ranged' } } },
                    baseItemId: null,
                },
                {
                    itemTypes: { hasEvery: ['weapon'] },
                    keywords: { some: { keyword: { name: 'Melee' } } },
                    baseItemId: null,
                },
                {
                    itemTypes: { hasEvery: ['weapon'] },
                    keywords: {
                        some: {
                            keyword: {
                                OR: [{ name: 'Consumable' }, { name: 'Light Consumable' }],
                            },
                        },
                    },
                    baseItemId: null,
                },
                {
                    itemTypes: { hasEvery: ['armor'] },
                    baseItemId: null,
                },
                {
                    itemTypes: { hasEvery: ['armor'] },
                    keywords: { some: { keyword: { name: 'Head' } } },
                    baseItemId: null,
                },
                {
                    itemTypes: { hasEvery: ['armor'] },
                    keywords: { some: { keyword: { name: 'Body' } } },
                    baseItemId: null,
                },
                {
                    itemTypes: { hasEvery: ['armor'] },
                    keywords: { some: { keyword: { name: 'Cloak' } } },
                    baseItemId: null,
                },
                {
                    itemTypes: { hasEvery: ['cybernetic'] },
                    baseItemId: null,
                },
                {
                    itemTypes: { hasEvery: ['mutation'] },
                    baseItemId: null,
                },
                {
                    itemTypes: { hasEvery: ['vehicle'] },
                    baseItemId: null,
                },
                {
                    itemTypes: { hasEvery: ['weapon'] },
                    keywords: { some: { keyword: { name: 'Vehicle Weapon' } } },
                    baseItemId: null,
                },
                {
                    itemTypes: { hasEvery: ['drone'] },
                    baseItemId: null,
                },
                {
                    itemTypes: { hasEvery: ['weapon'] },
                    keywords: { some: { keyword: { name: 'Drone Weapon' } } },
                    baseItemId: null,
                },
                {
                    itemTypes: { hasEvery: ['reusable'] },
                    baseItemId: null,
                },
                {
                    itemTypes: { hasEvery: ['consumable'] },
                    baseItemId: null,
                },
            ];
            const characterData = [
                { playerCharacter: true, userId: null },
                { playerCharacter: false, npcTypes: { isEmpty: true }, userId: null },
                {
                    playerCharacter: false,
                    npcTypes: { hasEvery: ['goon'] },
                    userId: null,
                },
                {
                    playerCharacter: false,
                    npcTypes: { hasEvery: ['shop'] },
                    userId: null,
                },
                {
                    playerCharacter: false,
                    npcTypes: { hasEvery: ['monster'] },
                    userId: null,
                },
            ];
            const itemCounts = await Promise.all(itemData.map((data) => prisma.item.count({
                //@ts-ignore
                where: data,
            })));
            const characterCounts = await Promise.all(characterData.map((data) => prisma.character.count({
                //@ts-ignore
                where: data,
            })));
            const itemPromises = itemData.map((data, index) => {
                const count = itemCounts[index];
                if (count === 0) {
                    return null;
                }
                return prisma.item.findFirst({
                    //@ts-ignore
                    where: data,
                    skip: Math.floor(Math.random() * count),
                    select: { generatedPicture: { select: { publicId: true } } },
                });
            });
            const characterPromises = characterData.map((data, index) => {
                const count = characterCounts[index];
                if (count === 0) {
                    return null;
                }
                return prisma.character.findFirst({
                    //@ts-ignore
                    where: data,
                    skip: Math.floor(Math.random() * count),
                    select: { generatedPicture: { select: { publicId: true } } },
                });
            });
            const [items, characters] = await Promise.all([
                Promise.all(itemPromises),
                Promise.all(characterPromises),
            ]);
            return { items, characters };
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch items');
        }
    },
    getCodexItems: async (types) => {
        try {
            const items = await prisma.item.findMany({
                where: types
                    ? {
                        baseItemId: null,
                        parentItemId: null,
                        itemTypes: { hasSome: types },
                    }
                    : { baseItemId: null, parentItemId: null },
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
            const { id, itemIds, actionIds, keywords, stats } = formData, data = __rest(formData, ["id", "itemIds", "actionIds", "keywords", "stats"]);
            const newStats = addVariableStats(stats);
            formData.id &&
                (await enforceSingularLinking(formData.id, itemIds, actionIds));
            const item = await prisma.item.upsert({
                where: { id: id || 0 },
                update: Object.assign(Object.assign({}, data), { stats: newStats, updatedAt: new Date(), linkedItems: {
                        set: itemIds === null || itemIds === void 0 ? void 0 : itemIds.map((id) => ({ id })),
                    }, linkedActions: {
                        set: actionIds === null || actionIds === void 0 ? void 0 : actionIds.map((id) => ({ id })),
                    }, keywords: { deleteMany: {}, createMany: { data: keywords } } }),
                create: Object.assign(Object.assign({}, data), { stats: newStats, linkedItems: {
                        connect: itemIds === null || itemIds === void 0 ? void 0 : itemIds.map((id) => ({ id })),
                    }, linkedActions: {
                        connect: actionIds === null || actionIds === void 0 ? void 0 : actionIds.map((id) => ({ id })),
                    }, keywords: { createMany: { data: keywords } } }),
                include: itemInclude,
            });
            if (id) {
                await prisma.item.updateMany({
                    where: { baseItemId: item.id },
                    data: Object.assign(Object.assign({}, data), { stats: newStats, updatedAt: new Date() }),
                });
            }
            return item;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create or update item');
        }
    },
    upgradeItem: async (formData) => {
        try {
            const prevCharacter = await prisma.character.findUnique({
                where: { id: formData.characterId },
                select: { profits: true },
            });
            if (!prevCharacter || prevCharacter.profits < formData.upgradePrice) {
                throw new Error('You do not have enough profits to purchase the chosen upgrades');
            }
            const { character, item } = await prisma.$transaction(async (tx) => {
                const character = await tx.character.update({
                    where: { id: formData.characterId },
                    data: { profits: { decrement: formData.upgradePrice } },
                });
                const item = await tx.item.update({
                    where: { id: formData.id },
                    data: {
                        name: formData.name,
                        description: formData.description,
                        generatedPictureId: formData.generatedPictureId,
                        modifiedStats: formData.modifiedStats,
                        modifiedKeywords: {
                            deleteMany: {},
                            createMany: { data: formData.keywords },
                        },
                    },
                    include: itemInclude,
                });
                return { character, item };
            });
            return { item, character };
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
                    generatedPictureId: true,
                    itemTypes: true,
                    grade: true,
                    price: true,
                    baseItemId: true,
                    linkedItems: { select: { id: true } },
                    linkedActions: { select: { id: true } },
                    keywords: { select: { keywordId: true, value: true } },
                },
            });
            if (!itemDetails) {
                throw new Error('Failed to find original item');
            }
            const { id, baseItemId, stats, keywords, linkedItems, linkedActions } = itemDetails, data = __rest(itemDetails, ["id", "baseItemId", "stats", "keywords", "linkedItems", "linkedActions"]);
            const typedStats = stats;
            const itemIds = [];
            const actionIds = [];
            if (linkedItems.length > 0) {
                for (let item of linkedItems) {
                    const newItem = await itemServices.createItemCopy(item.id);
                    itemIds.push(newItem.id);
                }
            }
            if (linkedActions.length > 0) {
                for (let action of linkedActions) {
                    const newItem = await actionServices.createActionCopy(action.id);
                    actionIds.push(newItem.id);
                }
            }
            const item = await prisma.item.create({
                data: Object.assign(Object.assign({}, data), { stats: typedStats, linkedItems: {
                        connect: itemIds.map((id) => ({ id })),
                    }, linkedActions: {
                        connect: actionIds.map((id) => ({ id })),
                    }, keywords: { createMany: { data: keywords } }, baseItemId: id }),
            });
            return item;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create item copy');
        }
    },
    createCharacterItemCopy: async (inventoryId, itemList, tx) => {
        const client = tx !== null && tx !== void 0 ? tx : prisma;
        const itemIds = itemList === null || itemList === void 0 ? void 0 : itemList.map((item) => item.itemId);
        const items = await client.item.findMany({
            where: { id: { in: itemIds } },
            select: {
                id: true,
                name: true,
                rarity: true,
                description: true,
                stats: true,
                generatedPictureId: true,
                itemTypes: true,
                grade: true,
                price: true,
                baseItemId: true,
                linkedItems: {
                    select: {
                        id: true,
                        name: true,
                        rarity: true,
                        description: true,
                        stats: true,
                        generatedPictureId: true,
                        itemTypes: true,
                        grade: true,
                        price: true,
                        baseItemId: true,
                        keywords: { select: { keywordId: true, value: true } },
                    },
                },
                linkedActions: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        costs: true,
                        roll: true,
                        actionType: true,
                        actionSubtypes: true,
                        duration: true,
                        cooldown: true,
                        modifiers: true,
                        keywordModifiers: { select: { keywordId: true, value: true } },
                        baseActionId: true,
                    },
                },
                keywords: { select: { keywordId: true, value: true } },
            },
        });
        if (items.length === 0) {
            throw new Error('No items found');
        }
        let nested = new Map();
        items.forEach((item) => {
            var _a, _b, _c;
            if (item.baseItemId) {
                throw new Error('Cannot create an item copy from a non-base item');
            }
            nested.set(`item ${item.id}`, {
                items: (_a = item.linkedItems) !== null && _a !== void 0 ? _a : [],
                actions: (_b = item.linkedActions) !== null && _b !== void 0 ? _b : [],
                keywords: (_c = item.keywords) !== null && _c !== void 0 ? _c : [],
            });
            if (item.linkedItems.length > 0) {
                item.linkedItems.forEach((item) => {
                    var _a;
                    if (item.baseItemId) {
                        throw new Error('Cannot create an item copy from a non-base linked item');
                    }
                    nested.set(`linked item ${item.id}`, {
                        keywords: (_a = item.keywords) !== null && _a !== void 0 ? _a : [],
                    });
                });
            }
            if (item.linkedActions.length > 0) {
                item.linkedActions.forEach((action) => {
                    var _a;
                    if (action.baseActionId) {
                        throw new Error('Cannot create an item copy from a non-base linked action');
                    }
                    nested.set(`linked action ${action.id}`, {
                        keywords: (_a = action.keywordModifiers) !== null && _a !== void 0 ? _a : [],
                    });
                });
            }
        });
        const newItems = await client.item.createManyAndReturn({
            data: items.flatMap((item) => {
                var _a, _b;
                const quantity = (_b = (_a = itemList.find((i) => i.itemId === item.id)) === null || _a === void 0 ? void 0 : _a.quantity) !== null && _b !== void 0 ? _b : 1;
                const validatedItem = ItemInput.parse(item);
                const { id, keywords } = validatedItem, data = __rest(validatedItem, ["id", "keywords"]);
                return Array.from({ length: quantity }, () => {
                    var _a;
                    return (Object.assign(Object.assign({}, data), { baseItemId: (_a = item.baseItemId) !== null && _a !== void 0 ? _a : id, characterInventoryId: inventoryId }));
                });
            }),
            select: { id: true, baseItemId: true },
        });
        const newLinkedItems = await client.item.createManyAndReturn({
            data: newItems.flatMap((item) => {
                const linkedItems = nested.get(`item ${item.baseItemId}`).items;
                const l = linkedItems.map((i) => {
                    var _a;
                    const validatedItem = ItemInput.parse(i);
                    const { id, keywords } = validatedItem, data = __rest(validatedItem, ["id", "keywords"]);
                    return Object.assign(Object.assign({}, data), { baseItemId: (_a = i.baseItemId) !== null && _a !== void 0 ? _a : i.id, parentItemId: item.id });
                });
                return l;
            }),
            select: { id: true, baseItemId: true },
        });
        const newLinkedActions = await client.action.createManyAndReturn({
            data: newItems.flatMap((item) => {
                const linkedActions = nested.get(`item ${item.baseItemId}`).actions;
                const l = linkedActions.map((a) => {
                    var _a;
                    const validatedAction = ActionInput.parse(a);
                    const { id, keywords } = validatedAction, data = __rest(validatedAction, ["id", "keywords"]);
                    return Object.assign(Object.assign({}, data), { baseActionId: (_a = a.baseActionId) !== null && _a !== void 0 ? _a : a.id, parentItemId: item.id });
                });
                return l;
            }),
            select: { id: true, baseActionId: true },
        });
        const keywordData = newItems.flatMap((item) => {
            const keywords = nested.get(`item ${item.baseItemId}`).keywords;
            const l = keywords.map((k) => (Object.assign(Object.assign({}, k), { itemId: item.id })));
            return l;
        });
        newLinkedItems.forEach((item) => {
            const keywords = nested.get(`linked item ${item.baseItemId}`).keywords;
            keywords.map((k) => {
                keywordData.push(Object.assign(Object.assign({}, k), { itemId: item.id }));
            });
        });
        newLinkedActions.forEach((action) => {
            const keywords = nested.get(`linked action ${action.baseActionId}`).keywords;
            keywords.map((k) => {
                keywordData.push(Object.assign(Object.assign({}, k), { actionId: action.id }));
            });
        });
        await client.keywordReference.createManyAndReturn({
            data: keywordData,
        });
    },
    createItemConditions: async (itemId, formData) => {
        const validatedConditionReference = ConditionReferenceInput.parse(formData);
        try {
            const item = await prisma.item.update({
                where: {
                    id: itemId,
                },
                data: {
                    conditions: {
                        deleteMany: {},
                        createMany: { data: validatedConditionReference },
                    },
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
