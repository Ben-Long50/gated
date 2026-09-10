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
import { includeCharacterCart } from '../utils/linkQueryStructures.js';
import itemServices, { itemInclude, itemSelectForCopy, } from './itemServices.js';
import { getIO } from '../sockets/socket.js';
import validateLevelUpBonus from '../utils/validateLevelUpBonus.js';
import { ConditionReferenceInput } from '../validation/conditionSchema.js';
import perkServices, { perkSelectForCopy } from './perkServices.js';
import { filterObject } from '../utils/filterObject.js';
export const characterSelectForCopy = {
    id: true,
    name: true,
    title: true,
    level: true,
    stats: true,
    profits: true,
    generatedPictureId: true,
    height: true,
    weight: true,
    age: true,
    sex: true,
    backstory: true,
    firstTaste: true,
    badMedicine: true,
    description: true,
    playerCharacter: true,
    npcTypes: true,
    preferences: true,
    baseCharacterId: true,
    characterInventory: {
        select: {
            items: {
                select: itemSelectForCopy,
            },
        },
    },
    characterLevelBonuses: {
        select: {
            level: true,
            attributes: true,
            perks: { select: perkSelectForCopy },
        },
    },
};
export const characterInclude = {
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
    gang: { select: { name: true } },
    controlledGang: { select: { name: true } },
    characterInventory: {
        include: {
            items: { select: { id: true } },
        },
    },
    characterCart: {
        include: includeCharacterCart,
    },
    location: { include: { map: { select: { name: true } } } },
    characterLevelBonuses: { include: { perks: { include: { actions: true } } } },
    generatedPicture: { select: { publicId: true } },
};
const characterServices = {
    getSocialCharacters: async () => {
        const characters = await prisma.character.findMany({
            orderBy: {
                name: 'asc',
            },
            include: {
                characterInventory: {
                    include: { items: { select: { id: true } } },
                },
                characterLevelBonuses: {
                    include: { perks: { include: { actions: true } } },
                },
            },
        });
        if (characters.length === 0) {
            throw new Error('No public characters exist');
        }
        return characters;
    },
    getCodexCharacters: async () => {
        const characters = await prisma.character.findMany({
            where: { userId: null },
            select: { id: true },
            orderBy: { name: 'asc' },
        });
        if (characters.length === 0) {
            throw new Error('No public characters exist');
        }
        return characters;
    },
    getBatchCharacters: async (characterIds) => {
        const characters = await prisma.character.findMany({
            where: {
                id: { in: characterIds },
            },
            include: characterInclude,
            orderBy: { name: 'asc' },
        });
        return characters;
    },
    getCharacterById: async (characterId) => {
        const character = await prisma.character.findUnique({
            where: {
                id: characterId,
            },
            include: characterInclude,
        });
        return character;
    },
    getCharacterNotes: async (characterId) => {
        const notes = await prisma.note.findMany({
            where: { characterId },
            include: {
                character: {
                    select: {
                        userId: true,
                        name: true,
                        title: true,
                        generatedPicture: { select: { publicId: true } },
                    },
                },
                session: {
                    select: { sessionNumber: true, createdAt: true, name: true },
                },
            },
            orderBy: { session: { sessionNumber: 'asc' } },
        });
        return notes;
    },
    toggleEquipment: async (inventoryId, itemId) => {
        const item = await prisma.item.findUnique({
            where: {
                id: Number(itemId),
                characterInventoryId: Number(inventoryId),
            },
            select: {
                id: true,
                equipped: true,
                linkedItems: { select: { id: true } },
            },
        });
        if (!item) {
            throw new Error('Item not found');
        }
        const itemIds = [...item === null || item === void 0 ? void 0 : item.linkedItems.map((item) => item.id), item.id];
        const equipped = item === null || item === void 0 ? void 0 : item.equipped;
        await prisma.item.updateMany({
            where: { id: { in: itemIds } },
            data: { equipped: !equipped },
        });
        const updatedItem = await prisma.item.findUnique({
            where: { id: item.id },
            include: itemInclude,
        });
        return updatedItem;
    },
    createCharacter: async (formData, userId, template) => {
        const stats = Object.assign(Object.assign({}, formData.stats), { currentHealth: formData.stats.maxHealth
                ? formData.stats.maxHealth +
                    10 +
                    formData.attributes.violence.skills.threshold.points * 2
                : 10 + formData.attributes.violence.skills.threshold.points * 2, currentSanity: formData.stats.maxSanity
                ? formData.stats.maxSanity +
                    5 +
                    formData.attributes.esoterica.skills.mysticism.points
                : 5 + formData.attributes.esoterica.skills.mysticism.points, currentActions: formData.stats.actions ? formData.stats.actions + 3 : 3, currentReactions: formData.stats.reactions
                ? formData.stats.reactions + 1
                : 1, currentHands: formData.stats.hands ? formData.stats.hands + 2 : 2, currentFeet: formData.stats.feet ? formData.stats.feet + 2 : 2, injuries: 0, insanities: 0 });
        const { perkIds, attributes } = formData, data = __rest(formData, ["perkIds", "attributes"]);
        await validateLevelUpBonus({ level: data.level, attributes, perkIds });
        const character = await prisma.$transaction(async (tx) => {
            var _a;
            let newPerkIds = [];
            if (perkIds) {
                for (const id of perkIds) {
                    const newPerk = await perkServices.createPerkCopy(id, tx);
                    newPerkIds.push(newPerk.id);
                }
            }
            const character = await tx.character.create({
                data: Object.assign(Object.assign({}, data), { level: data.playerCharacter ? data.level : undefined, stats,
                    userId, characterLevelBonuses: {
                        create: {
                            level: (_a = data.level) !== null && _a !== void 0 ? _a : 0,
                            attributes,
                            perks: {
                                connect: newPerkIds.map((perkId) => ({ id: perkId })),
                            },
                        },
                    }, characterCart: { create: {} }, characterInventory: { create: {} } }),
                include: { characterInventory: true },
            });
            if (!template && !character.npcTypes.includes('monster')) {
                const unarmed = await tx.item.findFirst({
                    where: { name: 'Unarmed', baseItemId: null },
                });
                if (!unarmed) {
                    throw new Error('Failed to find base Unarmed item');
                }
                if (!character.characterInventory) {
                    throw new Error('Failed to create character inventory');
                }
                await itemServices.createCharacterItemCopy(character.characterInventory.id, [{ itemId: unarmed.id, quantity: 1 }], tx);
            }
            return character;
        }, {
            timeout: 15000,
        });
        const newCharacter = await characterServices.getCharacterById(character.id);
        return newCharacter;
    },
    createTemplateCharacter: async (userId, characterId, campaignId, gangId) => {
        const character = await prisma.$transaction(async (tx) => {
            var _a, _b;
            const templateCharacter = await tx.character.findUnique({
                where: { id: characterId },
                select: characterSelectForCopy,
            });
            if (!templateCharacter) {
                throw new Error('Failed to find template character');
            }
            const _c = filterObject(templateCharacter), { id, characterLevelBonuses } = _c, filteredCharacter = __rest(_c, ["id", "characterLevelBonuses"]);
            const character = await tx.character.create({
                data: Object.assign(Object.assign({}, filteredCharacter), { npcTypes: (_a = filteredCharacter.npcTypes) === null || _a === void 0 ? void 0 : _a.filter((type) => type !== 'template'), baseCharacterId: id, characterInventory: {
                        create: {
                            items: {
                                create: (_b = templateCharacter.characterInventory) === null || _b === void 0 ? void 0 : _b.items.map((_a) => {
                                    var { id, baseItemId, keywords, modifiedKeywords, linkedItems, linkedActions } = _a, item = __rest(_a, ["id", "baseItemId", "keywords", "modifiedKeywords", "linkedItems", "linkedActions"]);
                                    return (Object.assign(Object.assign({}, item), { baseItemId: baseItemId !== null && baseItemId !== void 0 ? baseItemId : id, keywords: {
                                            create: keywords.map((keyword) => ({
                                                keywordId: keyword.keywordId,
                                                value: keyword.value,
                                            })),
                                        }, modifiedKeywords: {
                                            create: modifiedKeywords.map((keyword) => ({
                                                keywordId: keyword.keywordId,
                                                value: keyword.value,
                                            })),
                                        }, linkedItems: {
                                            create: linkedItems.map((_a) => {
                                                var { id, baseItemId, keywords, modifiedKeywords, linkedActions } = _a, item = __rest(_a, ["id", "baseItemId", "keywords", "modifiedKeywords", "linkedActions"]);
                                                return (Object.assign(Object.assign({}, item), { baseItemId: baseItemId !== null && baseItemId !== void 0 ? baseItemId : id, keywords: {
                                                        create: keywords.map((keyword) => ({
                                                            keywordId: keyword.keywordId,
                                                            value: keyword.value,
                                                        })),
                                                    }, modifiedKeywords: {
                                                        create: modifiedKeywords.map((keyword) => ({
                                                            keywordId: keyword.keywordId,
                                                            value: keyword.value,
                                                        })),
                                                    }, linkedActions: {
                                                        create: linkedActions.map((_a) => {
                                                            var { id, baseActionId, keywordModifiers } = _a, action = __rest(_a, ["id", "baseActionId", "keywordModifiers"]);
                                                            return (Object.assign(Object.assign({}, action), { baseActionId: baseActionId !== null && baseActionId !== void 0 ? baseActionId : id, keywordModifiers: {
                                                                    create: keywordModifiers.map((keyword) => ({
                                                                        keywordId: keyword.keywordId,
                                                                        value: keyword.value,
                                                                    })),
                                                                } }));
                                                        }),
                                                    } }));
                                            }),
                                        }, linkedActions: {
                                            create: linkedActions.map((_a) => {
                                                var { id, baseActionId, keywordModifiers } = _a, action = __rest(_a, ["id", "baseActionId", "keywordModifiers"]);
                                                return (Object.assign(Object.assign({}, action), { baseActionId: baseActionId !== null && baseActionId !== void 0 ? baseActionId : id, keywordModifiers: {
                                                        create: keywordModifiers.map((keyword) => ({
                                                            keywordId: keyword.keywordId,
                                                            value: keyword.value,
                                                        })),
                                                    } }));
                                            }),
                                        } }));
                                }),
                            },
                        },
                    }, characterLevelBonuses: {
                        create: templateCharacter.characterLevelBonuses.map((_a) => {
                            var { perks } = _a, bonus = __rest(_a, ["perks"]);
                            return (Object.assign(Object.assign({}, bonus), { perks: {
                                    create: perks.map((_a) => {
                                        var { id, basePerkId, actions } = _a, perk = __rest(_a, ["id", "basePerkId", "actions"]);
                                        return (Object.assign(Object.assign({}, perk), { basePerkId: basePerkId !== null && basePerkId !== void 0 ? basePerkId : id, actions: {
                                                create: actions.map((_a) => {
                                                    var { id, baseActionId, keywordModifiers } = _a, action = __rest(_a, ["id", "baseActionId", "keywordModifiers"]);
                                                    return (Object.assign(Object.assign({}, action), { baseActionId: baseActionId !== null && baseActionId !== void 0 ? baseActionId : id, keywordModifiers: {
                                                            create: keywordModifiers.map((keyword) => ({
                                                                keywordId: keyword.keywordId,
                                                                value: keyword.value,
                                                            })),
                                                        } }));
                                                }),
                                            } }));
                                    }),
                                } }));
                        }),
                    }, userId,
                    campaignId,
                    gangId }),
                select: {
                    name: true,
                    id: true,
                    userId: true,
                    campaignId: true,
                    gangId: true,
                },
            });
            return character;
        });
        return character;
    },
    addToInventory: async (characterId, inventoryId, tx) => {
        const client = tx !== null && tx !== void 0 ? tx : prisma;
        const character = await client.character.findUnique({
            where: { id: characterId },
            select: {
                profits: true,
                characterCart: {
                    select: {
                        items: {
                            include: {
                                item: { select: { id: true, price: true, itemTypes: true } },
                            },
                        },
                    },
                },
            },
        });
        const profits = (character === null || character === void 0 ? void 0 : character.profits) || 0;
        const cart = character === null || character === void 0 ? void 0 : character.characterCart;
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
            await itemServices.createCharacterItemCopy(inventoryId, items, client);
        }
        const updatedCharacter = await client.character.update({
            where: { id: characterId },
            data: { profits: { decrement: totalPrice } },
            include: characterInclude,
        });
        return updatedCharacter;
    },
    clearCart: async (characterId, tx) => {
        const client = tx !== null && tx !== void 0 ? tx : prisma;
        await client.characterCart.update({
            where: { characterId: Number(characterId) },
            data: {
                items: {
                    deleteMany: {},
                },
            },
        });
    },
    updateCharacter: async (formData) => {
        const { id, stats } = formData, data = __rest(formData, ["id", "stats"]);
        const oldCharacter = await prisma.character.findUnique({
            where: { id },
            select: {
                characterInventory: {
                    select: {
                        id: true,
                    },
                },
                stats: true,
            },
        });
        const newStats = Object.assign(Object.assign({}, oldCharacter === null || oldCharacter === void 0 ? void 0 : oldCharacter.stats), stats);
        const character = await prisma.$transaction(async (tx) => {
            const character = await tx.character.update({
                where: {
                    id,
                },
                data: Object.assign(Object.assign({}, data), { stats: newStats }),
                include: characterInclude,
            });
            return character;
        });
        return character;
    },
    updateCharacterLevel: async (characterId, levelChange) => {
        const character = await prisma.character.update({
            where: {
                id: characterId,
            },
            data: {
                level: { increment: levelChange },
            },
            include: characterInclude,
        });
        return character;
    },
    selectLevelUpBonus: async (bonus) => {
        const character = await characterServices.getCharacterById(bonus.characterId);
        if (!character) {
            throw new Error('Failed to find character');
        }
        const updatedCharacter = prisma.$transaction(async (tx) => {
            var _a, _b;
            let newPerkIds = [];
            if (bonus.perkIds) {
                for (const id of bonus.perkIds) {
                    const newPerk = await perkServices.createPerkCopy(id, tx);
                    newPerkIds.push(newPerk.id);
                }
            }
            const updatedCharacter = await tx.character.update({
                where: {
                    id: bonus.characterId,
                },
                data: {
                    characterLevelBonuses: {
                        upsert: {
                            where: {
                                characterId_level: {
                                    characterId: bonus.characterId,
                                    level: bonus.level,
                                },
                            },
                            update: {
                                attributes: (_a = bonus.attributes) !== null && _a !== void 0 ? _a : undefined,
                                perks: {
                                    deleteMany: {},
                                    connect: newPerkIds.map((newPerkId) => ({ id: newPerkId })),
                                },
                            },
                            create: {
                                level: bonus.level,
                                attributes: (_b = bonus.attributes) !== null && _b !== void 0 ? _b : undefined,
                                perks: {
                                    connect: newPerkIds.map((newPerkId) => ({ id: newPerkId })),
                                },
                            },
                        },
                    },
                },
                include: characterInclude,
            });
            return updatedCharacter;
        });
        return updatedCharacter;
    },
    createCharacterConditions: async (characterId, formData) => {
        const validatedConditionReference = ConditionReferenceInput.parse(formData);
        const character = await prisma.character.update({
            where: {
                id: characterId,
            },
            data: {
                conditions: {
                    deleteMany: {},
                    createMany: { data: validatedConditionReference },
                },
            },
            include: characterInclude,
        });
        return character;
    },
    createOrUpdateLocation: async (characterId, formData) => {
        var _a;
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
        io.to(`campaign ${(_a = location.character) === null || _a === void 0 ? void 0 : _a.campaignId}`).emit('location', {
            characterId,
            locationId: location.id,
            mapId: location.mapId,
            row: location.row,
            col: location.col,
        });
    },
    deleteLocation: async (characterId) => {
        await prisma.location.delete({
            where: {
                characterId,
            },
        });
    },
    deleteCharacter: async (userId, characterId) => {
        const character = await prisma.character.findUnique({
            where: {
                id: characterId,
            },
            select: {
                affiliations: { select: { id: true } },
            },
        });
        if (!character) {
            throw new Error('Failed to find character');
        }
        await prisma.$transaction(async (tx) => {
            await tx.affiliation.deleteMany({
                where: {
                    id: {
                        in: character.affiliations.map((affiliation) => affiliation.id),
                    },
                },
            });
            await tx.character.delete({
                where: {
                    id: characterId,
                    userId,
                },
            });
        });
    },
};
export default characterServices;
