// @ts-nocheck
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
import { ConditionReferenceInput } from '../validation/conditionSchema.js';
export const itemInclude = {
    baseItem: true,
    characterInventory: { select: { characterId: true } },
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
                include: {
                    keywordModifiers: { include: { keyword: true } },
                    itemLink: { select: { item: { select: { name: true } } } },
                },
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
    getCodexPreviewItems: async () => {
        try {
            const itemData = [
                {
                    itemTypes: { hasEvery: ['weapon'] },
                },
                {
                    itemTypes: { hasEvery: ['weapon'] },
                    keywords: { some: { keyword: { name: 'Ranged' } } },
                },
                {
                    itemTypes: { hasEvery: ['weapon'] },
                    keywords: { some: { keyword: { name: 'Melee' } } },
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
                },
                {
                    itemTypes: { hasEvery: ['armor'] },
                },
                {
                    itemTypes: { hasEvery: ['armor'] },
                    keywords: { some: { keyword: { name: 'Head' } } },
                },
                {
                    itemTypes: { hasEvery: ['armor'] },
                    keywords: { some: { keyword: { name: 'Body' } } },
                },
                {
                    itemTypes: { hasEvery: ['armor'] },
                    keywords: { some: { keyword: { name: 'Cloak' } } },
                },
                {
                    itemTypes: { hasEvery: ['cybernetic'] },
                },
                {
                    itemTypes: { hasEvery: ['mutation'] },
                },
                {
                    itemTypes: { hasEvery: ['vehicle'] },
                },
                {
                    itemTypes: { hasEvery: ['weapon'] },
                    keywords: { some: { keyword: { name: 'Vehicle Weapon' } } },
                },
                {
                    itemTypes: { hasEvery: ['drone'] },
                },
                {
                    itemTypes: { hasEvery: ['weapon'] },
                    keywords: { some: { keyword: { name: 'Drone Weapon' } } },
                },
                {
                    itemTypes: { hasEvery: ['reusable'] },
                },
                {
                    itemTypes: { hasEvery: ['consumable'] },
                },
            ];
            const characterData = [
                { playerCharacter: true },
                { playerCharacter: false, npcTypes: { isEmpty: true } },
                {
                    playerCharacter: false,
                    npcTypes: { hasEvery: ['goon'] },
                },
                {
                    playerCharacter: false,
                    npcTypes: { hasEvery: ['monster'] },
                },
            ];
            const itemCounts = await Promise.all(itemData.map((data) => prisma.item.count({
                where: Object.assign(Object.assign({}, data), { base: true }),
            })));
            const characterCounts = await Promise.all(characterData.map((data) => prisma.character.count({
                where: Object.assign(Object.assign({}, data), { base: true }),
            })));
            const itemPromises = itemData.map((data, index) => {
                const count = itemCounts[index];
                if (count === 0) {
                    return null;
                }
                return prisma.item.findFirst({
                    where: Object.assign(Object.assign({}, data), { base: true }),
                    skip: Math.floor(Math.random() * count),
                    select: { picture: true },
                });
            });
            const characterPromises = characterData.map((data, index) => {
                const count = characterCounts[index];
                if (count === 0) {
                    return null;
                }
                return prisma.character.findFirst({
                    where: Object.assign(Object.assign({}, data), { base: true }),
                    skip: Math.floor(Math.random() * count),
                    select: { picture: true },
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
    getCodexItems: async (category) => {
        try {
            const items = await prisma.item.findMany({
                where: category
                    ? {
                        base: true,
                        itemLinkId: null,
                        itemTypes: { hasSome: category },
                    }
                    : { base: true, itemLinkId: null },
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
                        picture: formData.picture,
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
                    }, keywords: { createMany: { data: keywords } }, base: false, baseItemId: id }),
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
                        data: Object.assign(Object.assign({}, rest), { picture: typedPicture, stats: typedStats, updatedAt: new Date(), characterInventoryId: inventoryId, base: false, baseItemId: baseItemId || id, userId, itemLinkReference: {
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
