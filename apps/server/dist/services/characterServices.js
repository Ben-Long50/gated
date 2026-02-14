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
import { includeCharacterCart, unequipLinked, } from '../utils/linkQueryStructures.js';
import itemServices from './itemServices.js';
import { getIO } from '../sockets/socket.js';
import subtractAttributeTrees from '../utils/subtractAttributeTrees.js';
import validateLevelUpBonus from '../utils/validateLevelUpBonus.js';
const characterServices = {
    getCharacters: async (userId) => {
        try {
            const characters = await prisma.character.findMany({
                where: {
                    userId,
                },
                select: { id: true },
            });
            if (characters.length === 0) {
                throw new Error('You have not created any characters');
            }
            return characters;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch characters');
        }
    },
    getBatchCharacters: async (characterIds) => {
        try {
            const characters = await prisma.character.findMany({
                where: {
                    id: { in: characterIds },
                },
                include: {
                    campaign: {
                        select: {
                            name: true,
                            ownerId: true,
                        },
                    },
                    conditions: {
                        include: { condition: true },
                        orderBy: { condition: { name: 'asc' } },
                    },
                    affiliations: { select: { id: true } },
                    perks: true,
                    characterInventory: {
                        include: { items: { select: { id: true } } },
                    },
                    characterCart: {
                        include: includeCharacterCart,
                    },
                    location: { include: { map: { select: { name: true } } } },
                    characterLevelBonuses: { include: { perks: true } },
                },
            });
            if (characters.length === 0) {
                throw new Error('You have not created any characters');
            }
            return characters;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch characters');
        }
    },
    getCharacterById: async (characterId) => {
        try {
            const character = await prisma.character.findUnique({
                where: {
                    id: characterId,
                },
                include: {
                    campaign: {
                        select: {
                            name: true,
                            ownerId: true,
                        },
                    },
                    conditions: {
                        include: { condition: true },
                        orderBy: { condition: { name: 'asc' } },
                    },
                    affiliations: { select: { id: true } },
                    perks: true,
                    characterInventory: {
                        include: { items: { select: { id: true } } },
                    },
                    characterCart: {
                        include: includeCharacterCart,
                    },
                    location: { include: { map: { select: { name: true } } } },
                    characterLevelBonuses: { include: { perks: true } },
                },
            });
            return character;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch character');
        }
    },
    setActiveCharacter: async (userId, characterId) => {
        try {
            await prisma.character.updateMany({
                where: { id: { not: Number(characterId) }, userId },
                data: { active: false },
            });
            const activeCharacter = await prisma.character.update({
                where: { id: Number(characterId), userId },
                data: { active: true },
            });
            return activeCharacter;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to switch active character');
        }
    },
    toggleEquipment: async (inventoryId, itemId, category) => {
        try {
            const item = await prisma.item.findUnique({
                where: {
                    id: Number(itemId),
                    itemTypes: { hasSome: category },
                    characterInventoryId: Number(inventoryId),
                },
                select: { id: true, equipped: true },
            });
            if (!item) {
                throw new Error('Item not found');
            }
            await prisma.item.update({
                where: { id: item.id },
                data: { equipped: item.equipped ? false : true },
            });
            await prisma.$transaction([
                prisma.itemLinkReference.update({
                    where: { itemId: item.id },
                    data: item.equipped
                        ? unequipLinked
                        : {
                            items: {
                                updateMany: {
                                    where: {},
                                    data: {
                                        equipped: true,
                                    },
                                },
                            },
                            actions: {
                                updateMany: {
                                    where: { actionType: 'passive' },
                                    data: {
                                        active: true,
                                        equipped: true,
                                    },
                                },
                            },
                        },
                }),
                prisma.itemLinkReference.update({
                    where: { itemId: item.id },
                    data: item.equipped
                        ? unequipLinked
                        : {
                            actions: {
                                updateMany: {
                                    where: { actionType: { not: 'passive' } },
                                    data: {
                                        equipped: true,
                                    },
                                },
                            },
                        },
                }),
            ]);
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to toggle equipment');
        }
    },
    createCharacter: async (formData, userId, template) => {
        var _a, _b, _c;
        try {
            const startingStats = {
                currentHealth: (_a = formData.stats) === null || _a === void 0 ? void 0 : _a.currentHealth,
                currentSanity: (_b = formData.stats) === null || _b === void 0 ? void 0 : _b.currentSanity,
                currentActions: 3,
                currentReactions: 1,
                currentHands: 2,
                injuries: 0,
                insanities: 0,
            };
            const perks = ((_c = formData.perks) === null || _c === void 0 ? void 0 : _c.map((id) => ({ id }))) || [];
            const data = Object.assign(Object.assign({}, formData), { userId, stats: Object.assign(Object.assign({}, formData.stats), startingStats), perks: {
                    connect: perks,
                } });
            const newCharacter = await prisma.character.create({
                data: Object.assign(Object.assign({}, data), { characterLevelBonuses: {
                        create: {
                            level: 1,
                            attributes: data.attributes,
                            perks: { connect: perks },
                        },
                    } }),
            });
            await characterServices.createCharacterCart(newCharacter.id);
            const characterInventory = await characterServices.createCharacterInventory(newCharacter.id);
            if (!template) {
                const unarmed = await prisma.item.findFirst({
                    where: { name: 'Unarmed', baseItemId: null },
                });
                if (!unarmed) {
                    throw new Error('Failed to find base Unarmed item');
                }
                await itemServices.createCharacterItemCopy(userId, characterInventory.id, [{ itemId: unarmed.id, price: null, quantity: 2 }]);
            }
            return newCharacter;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create character');
        }
    },
    createTemplateCharacter: async (characterId, userId) => {
        var _a;
        try {
            const templateCharacter = await characterServices.getCharacterById(characterId);
            if (!templateCharacter) {
                throw new Error('Failed to find template character');
            }
            if (templateCharacter.userId !== userId) {
                throw new Error("Only the template character's owner may make copies of it");
            }
            const { id, createdAt, user, userId: prevUserId, profits, location, locationId, active, sessions, conditions, characterCart, characterInventory, Note, affiliations, activeHistory, targetHistory, encounters, campaign, npcTypes, perks } = templateCharacter, data = __rest(templateCharacter, ["id", "createdAt", "user", "userId", "profits", "location", "locationId", "active", "sessions", "conditions", "characterCart", "characterInventory", "Note", "affiliations", "activeHistory", "targetHistory", "encounters", "campaign", "npcTypes", "perks"]);
            const newCharacter = await characterServices.createCharacter(Object.assign(Object.assign({}, data), { perks: perks.map((perk) => perk.id) }), userId, true);
            const createdCharacter = await characterServices.getCharacterById(newCharacter.id);
            if (characterInventory && (createdCharacter === null || createdCharacter === void 0 ? void 0 : createdCharacter.characterInventory)) {
                const itemList = characterInventory.items.map((item) => ({
                    itemId: item.id,
                    price: null,
                    quantity: 1,
                }));
                await itemServices.createCharacterItemCopy(userId, (_a = createdCharacter.characterInventory) === null || _a === void 0 ? void 0 : _a.id, itemList);
            }
            return newCharacter;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create character');
        }
    },
    createCharacterCart: async (characterId) => {
        try {
            await prisma.characterCart.create({
                data: {
                    character: { connect: { id: characterId } },
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create character cart');
        }
    },
    createCharacterInventory: async (characterId) => {
        try {
            const characterInventory = await prisma.characterInventory.create({
                data: {
                    character: { connect: { id: characterId } },
                },
            });
            return characterInventory;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create character inventory');
        }
    },
    addToInventory: async (userId, characterId, inventoryId) => {
        var _a;
        try {
            const profits = ((_a = (await prisma.character.findUnique({
                where: { id: characterId },
                select: { profits: true },
            }))) === null || _a === void 0 ? void 0 : _a.profits) || 0;
            const cart = await prisma.characterCart.findUnique({
                where: { characterId },
                select: {
                    items: {
                        include: {
                            item: { select: { id: true, price: true, itemTypes: true } },
                        },
                    },
                },
            });
            const items = (cart === null || cart === void 0 ? void 0 : cart.items.map((item) => ({
                itemId: item.item.id,
                quantity: item.quantity,
                price: item.item.price,
            }))) || [];
            const totalPrice = cart === null || cart === void 0 ? void 0 : cart.items.flat().map((reference) => {
                const targetObject = Object.values(reference).find((item) => typeof item === 'object');
                return (targetObject === null || targetObject === void 0 ? void 0 : targetObject.price)
                    ? reference.quantity * targetObject.price
                    : 0;
            }).reduce((sum, item) => sum + item, 0);
            if (typeof totalPrice !== 'number') {
                throw new Error('Failed to calculate total cart price');
            }
            if (totalPrice > profits) {
                throw new Error('You do not have enough profits to complete this purchase');
            }
            if (items.length > 0) {
                itemServices.createCharacterItemCopy(userId, inventoryId, items);
            }
            await prisma.character.update({
                where: { id: Number(characterId) },
                data: { profits: profits - totalPrice },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to add items to inventory');
        }
    },
    clearCart: async (characterId) => {
        try {
            await prisma.characterCart.update({
                where: { characterId: Number(characterId) },
                data: {
                    items: {
                        deleteMany: {},
                    },
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to clear cart');
        }
    },
    updateCharacter: async (formData, userId, characterId) => {
        try {
            const data = Object.assign({}, formData);
            const updatedCharacter = await prisma.character.update({
                where: {
                    userId,
                    id: Number(characterId),
                },
                data,
            });
            return updatedCharacter.campaignId;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to update character');
        }
    },
    updateCharacterLevel: async (characterId, levelChange) => {
        try {
            const character = await prisma.character.findUnique({
                where: { id: characterId },
            });
            await prisma.character.update({
                where: {
                    id: characterId,
                },
                data: {
                    level: (character === null || character === void 0 ? void 0 : character.level) + levelChange,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to change character level');
        }
    },
    selectLevelUpBonus: async (characterId, bonus) => {
        try {
            const character = await characterServices.getCharacterById(characterId);
            const validated = validateLevelUpBonus({
                level: bonus.level,
                attributes: bonus.attributes || (character === null || character === void 0 ? void 0 : character.attributes),
                perks: bonus.perks || character.perks,
            });
            if (!validated) {
                throw new Error('The incorrect amount of level up bonus points have been distributed');
            }
            const levelUpBonusTree = bonus.attributes
                ? subtractAttributeTrees(bonus.attributes, character === null || character === void 0 ? void 0 : character.attributes)
                : null;
            const data = {};
            const bonusData = { level: bonus.level };
            if (bonus.attributes) {
                data.attributes = bonus.attributes;
                bonusData.attributes = levelUpBonusTree;
            }
            if (bonus.perks) {
                data.perks = { connect: bonus.perks.map((perk) => ({ id: perk.id })) };
                bonusData.perks = {
                    connect: bonus.perks
                        .filter((perk) => !character.perks.some((p) => perk.id === p.id))
                        .map((perk) => ({ id: perk.id })),
                };
            }
            await prisma.character.update({
                where: {
                    id: characterId,
                },
                data: Object.assign(Object.assign({}, data), { characterLevelBonuses: {
                        create: bonusData,
                    } }),
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to select level up bonus');
        }
    },
    createCharacterConditions: async (characterId, formData) => {
        try {
            const character = await prisma.character.findUnique({
                where: { id: characterId },
                include: {
                    conditions: { select: { id: true } },
                },
            });
            if (!character) {
                throw new Error('Failed to find character');
            }
            if (character && character.conditions) {
                await prisma.characterConditionReference.deleteMany({
                    where: {
                        id: { in: character.conditions.map((condition) => condition.id) },
                    },
                });
            }
            const conditionData = (formData === null || formData === void 0 ? void 0 : formData.map((condition) => ({
                conditionId: condition.conditionId,
                stacks: condition.stacks ? condition.stacks : null,
            }))) || [];
            await prisma.character.update({
                where: {
                    id: characterId,
                },
                data: {
                    conditions: { createMany: { data: conditionData } },
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create character conditions');
        }
    },
    createOrUpdateLocation: async (characterId, formData) => {
        try {
            const io = getIO();
            const location = await prisma.location.upsert({
                where: {
                    characterId: characterId || 0,
                },
                update: {
                    map: { connect: { id: formData.mapId } },
                    row: formData.row,
                    col: formData.col,
                },
                create: {
                    character: { connect: { id: characterId } },
                    map: { connect: { id: formData.mapId } },
                    row: formData.row,
                    col: formData.col,
                },
                include: { character: { select: { campaignId: true } } },
            });
            io.to(`campaign ${location.character.campaignId}`).emit('location', {
                characterId,
                locationId: location.id,
                mapId: location.mapId,
                row: location.row,
                col: location.col,
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to update character location');
        }
    },
    deleteLocation: async (characterId) => {
        try {
            await prisma.location.delete({
                where: {
                    characterId,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to delete character location');
        }
    },
    deleteCharacter: async (userId, characterId) => {
        try {
            await prisma.character.delete({
                where: {
                    userId: userId,
                    id: Number(characterId),
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to delete character');
        }
    },
};
export default characterServices;
