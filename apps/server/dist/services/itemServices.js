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
import actionServices, { actionSelectForCopy } from './actionServices.js';
import { ItemCopyInput, } from '../validation/itemSchema.js';
import { ConditionReferenceInput } from '../validation/conditionSchema.js';
import addVariableStats from '../utils/addVariableStats.js';
import { ActionCopyInput } from '../validation/actionSchema.js';
import { keywordSelectForCopy } from './keywordServices.js';
import { KeywordReferenceCopyInput } from '../validation/keywordSchema.js';
export const itemSelectForCopy = {
    id: true,
    name: true,
    itemTypes: true,
    rarity: true,
    grade: true,
    generatedPictureId: true,
    description: true,
    stats: true,
    modifiedStats: true,
    price: true,
    equipped: true,
    keywords: { select: keywordSelectForCopy },
    modifiedKeywords: { select: keywordSelectForCopy },
    baseItemId: true,
    linkedItems: {
        select: {
            id: true,
            name: true,
            itemTypes: true,
            rarity: true,
            grade: true,
            generatedPictureId: true,
            description: true,
            stats: true,
            modifiedStats: true,
            price: true,
            equipped: true,
            keywords: { select: keywordSelectForCopy },
            modifiedKeywords: { select: keywordSelectForCopy },
            baseItemId: true,
            linkedActions: {
                select: actionSelectForCopy,
            },
        },
    },
    linkedActions: {
        select: actionSelectForCopy,
    },
};
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
    },
    getCodexItems: async (types) => {
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
    },
    getBatchItems: async (itemIds) => {
        const items = await prisma.item.findMany({
            where: { id: { in: itemIds } },
            include: itemInclude,
        });
        return items;
    },
    getItemById: async (itemId) => {
        const item = await prisma.item.findUnique({
            where: { id: itemId },
            include: itemInclude,
        });
        if (!item) {
            throw new Error('Failed to find item');
        }
        return item;
    },
    createOrUpdateItem: async (formData) => {
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
    },
    upgradeItem: async (formData) => {
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
    },
    createItemCopy: async (itemId) => {
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
    },
    createCharacterItemCopies: async (inventoryId, itemList, tx) => {
        const client = tx !== null && tx !== void 0 ? tx : prisma;
        const itemIds = itemList === null || itemList === void 0 ? void 0 : itemList.map((item) => item.itemId);
        const items = await client.item.findMany({
            where: { id: { in: itemIds } },
            select: itemSelectForCopy,
        });
        if (items.length === 0) {
            throw new Error('No items found');
        }
        let nested = new Map();
        items.forEach((item) => {
            var _a, _b, _c, _d;
            const id = (_a = item.baseItemId) !== null && _a !== void 0 ? _a : item.id;
            nested.set(`item ${id}`, {
                items: (_b = item.linkedItems) !== null && _b !== void 0 ? _b : [],
                actions: (_c = item.linkedActions) !== null && _c !== void 0 ? _c : [],
                keywords: (_d = item.keywords) !== null && _d !== void 0 ? _d : [],
            });
            if (item.linkedItems.length > 0) {
                item.linkedItems.forEach((item) => {
                    var _a, _b, _c;
                    const id = (_a = item.baseItemId) !== null && _a !== void 0 ? _a : item.id;
                    nested.set(`linked item ${id}`, {
                        keywords: (_b = item.keywords) !== null && _b !== void 0 ? _b : [],
                        actions: (_c = item.linkedActions) !== null && _c !== void 0 ? _c : [],
                    });
                });
            }
            if (item.linkedActions.length > 0) {
                item.linkedActions.forEach((action) => {
                    var _a, _b;
                    const id = (_a = action.baseActionId) !== null && _a !== void 0 ? _a : action.id;
                    nested.set(`linked action ${id}`, {
                        keywords: (_b = action.keywordModifiers) !== null && _b !== void 0 ? _b : [],
                    });
                });
            }
            const linkedLinkedActions = item.linkedItems.flatMap((item) => item.linkedActions);
            if (linkedLinkedActions.length > 0) {
                linkedLinkedActions.forEach((action) => {
                    var _a, _b;
                    const id = (_a = action.baseActionId) !== null && _a !== void 0 ? _a : action.id;
                    nested.set(`linked linked action ${id}`, {
                        keywords: (_b = action.keywordModifiers) !== null && _b !== void 0 ? _b : [],
                    });
                });
            }
        });
        const newItems = await client.item.createManyAndReturn({
            data: items.flatMap((item) => {
                var _a, _b;
                const quantity = (_b = (_a = itemList.find((i) => i.itemId === item.id)) === null || _a === void 0 ? void 0 : _a.quantity) !== null && _b !== void 0 ? _b : 1;
                const _c = ItemCopyInput.parse(item), { id } = _c, validatedItem = __rest(_c, ["id"]);
                return Array.from({ length: quantity }, () => {
                    var _a;
                    return (Object.assign(Object.assign({}, validatedItem), { baseItemId: (_a = validatedItem.baseItemId) !== null && _a !== void 0 ? _a : id, characterInventoryId: inventoryId }));
                });
            }),
            select: { id: true, baseItemId: true },
        });
        const newLinkedItems = await client.item.createManyAndReturn({
            data: newItems.flatMap((item) => {
                const linkedItems = nested.get(`item ${item.baseItemId}`).items;
                const l = linkedItems.map((i) => {
                    var _a;
                    const _b = ItemCopyInput.parse(i), { id } = _b, validatedItem = __rest(_b, ["id"]);
                    return Object.assign(Object.assign({}, validatedItem), { baseItemId: (_a = validatedItem.baseItemId) !== null && _a !== void 0 ? _a : id, parentItemId: item.id });
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
                    const _b = ActionCopyInput.parse(a), { id } = _b, validatedAction = __rest(_b, ["id"]);
                    return Object.assign(Object.assign({}, validatedAction), { baseActionId: (_a = validatedAction.baseActionId) !== null && _a !== void 0 ? _a : id, parentItemId: item.id });
                });
                return l;
            }),
            select: { id: true, baseActionId: true },
        });
        const newLinkedLinkedActions = await client.action.createManyAndReturn({
            data: newLinkedItems.flatMap((item) => {
                const linkedActions = nested.get(`linked item ${item.baseItemId}`).actions;
                const l = linkedActions.map((a) => {
                    var _a;
                    const _b = ActionCopyInput.parse(a), { id } = _b, validatedAction = __rest(_b, ["id"]);
                    return Object.assign(Object.assign({}, validatedAction), { baseActionId: (_a = validatedAction.baseActionId) !== null && _a !== void 0 ? _a : id, parentItemId: item.id });
                });
                return l;
            }),
            select: { id: true, baseActionId: true },
        });
        const keywordData = newItems.flatMap((item) => {
            const keywords = nested.get(`item ${item.baseItemId}`).keywords;
            const l = keywords.map((k) => {
                const validatedKeyword = KeywordReferenceCopyInput.parse(k);
                return Object.assign(Object.assign({}, validatedKeyword), { itemId: item.id });
            });
            return l;
        });
        newLinkedItems.forEach((item) => {
            const keywords = nested.get(`linked item ${item.baseItemId}`).keywords;
            keywords.map((k) => {
                const validatedKeyword = KeywordReferenceCopyInput.parse(k);
                keywordData.push(Object.assign(Object.assign({}, validatedKeyword), { itemId: item.id }));
            });
        });
        newLinkedActions.forEach((action) => {
            const keywords = nested.get(`linked action ${action.baseActionId}`).keywords;
            keywords.map((k) => {
                const validatedKeyword = KeywordReferenceCopyInput.parse(k);
                keywordData.push(Object.assign(Object.assign({}, validatedKeyword), { actionId: action.id }));
            });
        });
        newLinkedLinkedActions.forEach((action) => {
            const keywords = nested.get(`linked linked action ${action.baseActionId}`).keywords;
            keywords.map((k) => {
                const validatedKeyword = KeywordReferenceCopyInput.parse(k);
                keywordData.push(Object.assign(Object.assign({}, validatedKeyword), { actionId: action.id }));
            });
        });
        await client.keywordReference.createManyAndReturn({
            data: keywordData,
        });
    },
    createItemConditions: async (itemId, formData) => {
        const validatedConditionReference = ConditionReferenceInput.parse(formData);
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
    },
    setItemAvailable: async (itemId) => {
        const item = await prisma.item.update({
            where: { id: itemId },
            data: { available: true },
            include: itemInclude,
        });
        return item;
    },
    setAllCharacterItemsAvailable: async (characterId) => {
        await prisma.item.updateMany({
            where: { characterInventory: { characterId }, available: false },
            data: { available: true },
        });
    },
    setItemNotAvailable: async (itemId) => {
        await prisma.item.update({
            where: { id: itemId },
            data: { available: false },
        });
    },
    deleteItem: async (itemId) => {
        await prisma.item.delete({
            where: {
                id: itemId,
            },
        });
    },
    deleteItems: async (itemIds) => {
        await prisma.item.deleteMany({
            where: {
                id: { in: itemIds },
            },
        });
    },
};
export default itemServices;
