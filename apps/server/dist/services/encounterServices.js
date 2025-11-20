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
import itemServices from './itemServices.js';
import { applyDamage, calculateActionQueueSuccesses, calculateCosts, calculateDamage, } from '../utils/rollUtilities.js';
1;
const encounterServices = {
    getEncounters: async (campaignId) => {
        try {
            const encounters = await prisma.encounter.findMany({
                where: {
                    campaignId,
                },
                include: {
                    characters: { select: { id: true } },
                    history: {
                        include: {
                            character: true,
                            target: true,
                            action: true,
                            item: true,
                        },
                    },
                    phaseHistory: {
                        include: {
                            action: {
                                include: {
                                    character: true,
                                    target: true,
                                    action: true,
                                    item: true,
                                },
                            },
                            reactions: {
                                include: {
                                    character: true,
                                    target: true,
                                    action: true,
                                    item: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { id: 'asc' },
            });
            return encounters;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch owner encounters');
        }
    },
    getEncounterById: async (encounterId) => {
        try {
            const encounter = await prisma.encounter.findUnique({
                where: { id: Number(encounterId) },
                include: {
                    characters: { select: { id: true } },
                    history: {
                        include: {
                            character: true,
                            target: true,
                            action: true,
                            item: true,
                        },
                    },
                    phaseHistory: {
                        take: 1,
                        orderBy: { createdAt: 'desc' },
                        include: {
                            action: {
                                include: {
                                    character: true,
                                    target: true,
                                    action: true,
                                    item: true,
                                },
                            },
                            reactions: {
                                include: {
                                    character: true,
                                    target: true,
                                    action: true,
                                    item: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!encounter) {
                throw new Error('Failed to find encounter');
            }
            return encounter;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch encounter');
        }
    },
    getBatchEncounters: async (encounterIds) => {
        try {
            const encounters = await prisma.encounter.findMany({
                where: {
                    id: { in: encounterIds },
                },
                include: {
                    characters: true,
                    map: { select: { picture: true, name: true } },
                    phaseHistory: {
                        take: 1,
                        orderBy: { createdAt: 'desc' },
                        include: {
                            action: {
                                include: {
                                    character: true,
                                    target: true,
                                    action: true,
                                    item: true,
                                },
                            },
                            reactions: {
                                include: {
                                    character: true,
                                    target: true,
                                    action: true,
                                    item: true,
                                },
                            },
                        },
                    },
                },
            });
            return encounters;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch encounters');
        }
    },
    getEncounterHistory: async (encounterId) => {
        try {
            const history = await prisma.history.findMany({
                where: {
                    encounterId,
                },
                include: {
                    character: true,
                    target: true,
                    action: true,
                    item: true,
                },
                orderBy: { createdAt: 'desc' },
            });
            return history;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch encounter history');
        }
    },
    activateEncounter: async (encounterId) => {
        try {
            const encounter = await prisma.encounter.findUnique({
                where: { id: encounterId },
            });
            await prisma.encounter.update({
                where: {
                    id: encounterId,
                },
                data: {
                    active: encounter ? !(encounter === null || encounter === void 0 ? void 0 : encounter.active) : true,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to activate encounter');
        }
    },
    advancePhase: async (encounterId) => {
        try {
            const encounter = await prisma.encounter.findUnique({
                where: { id: encounterId },
                select: { combatPhase: true, turn: true, round: true },
            });
            let nextPhase = null;
            switch (encounter === null || encounter === void 0 ? void 0 : encounter.combatPhase) {
                case 'pending':
                    nextPhase = 'initiative';
                    break;
                case 'initiative':
                    nextPhase = 'action';
                    break;
                case 'action':
                    nextPhase = 'reaction';
                    break;
                case 'reaction':
                    nextPhase = 'action';
                    break;
                default:
                    nextPhase = null;
                    break;
            }
            if (!nextPhase || !encounter) {
                return;
            }
            const phaseHistoryData = {
                turn: encounter.turn + 1,
                round: encounter.round,
            };
            await prisma.encounter.update({
                where: { id: encounterId },
                data: {
                    combatPhase: nextPhase,
                    reactions: [],
                    passes: [],
                    phaseHistory: { create: phaseHistoryData },
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to advance phase');
        }
    },
    advanceTurn: async (encounterId) => {
        try {
            const encounter = await encounterServices.getEncounterById(encounterId);
            const newRound = encounter.turnPosition + 1 >= encounter.turnOrder.length;
            const nextCharacterId = newRound
                ? encounter.turnOrder[0]
                : encounter.turnOrder[encounter.turnPosition + 1];
            const data = {
                turn: encounter.turn + 1,
                turnPosition: newRound ? 0 : encounter.turnPosition + 1,
                combatPhase: 'action',
                reactions: [],
                passes: [],
            };
            const phaseHistoryData = {
                turn: encounter.turn + 1,
                round: encounter.round,
            };
            if (newRound) {
                data.round = encounter.round + 1;
                phaseHistoryData.round = encounter.round + 1;
            }
            await prisma.encounter.update({
                where: {
                    id: encounterId,
                },
                data: Object.assign({ phaseHistory: { create: phaseHistoryData } }, data),
            });
            const itemIds = (await itemServices.setAllCharacterItemsAvailable(nextCharacterId)) ||
                [];
            return itemIds;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to advance turn');
        }
    },
    setCombatPhase: async (encounterId, phase) => {
        try {
            await prisma.encounter.update({
                where: {
                    id: encounterId,
                },
                data: {
                    combatPhase: phase,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to advance turn');
        }
    },
    scheduleReaction: async (encounterId, characterId) => {
        try {
            await prisma.encounter.update({
                where: {
                    id: encounterId,
                },
                data: {
                    reactions: { push: characterId },
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to advance turn');
        }
    },
    passReaction: async (encounterId, characterId) => {
        try {
            await prisma.encounter.update({
                where: {
                    id: encounterId,
                },
                data: {
                    passes: { push: characterId },
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to advance turn');
        }
    },
    finishReaction: async (encounterId, characterId) => {
        try {
            const encounter = await prisma.encounter.findUnique({
                where: { id: encounterId },
                select: { reactions: true, passes: true },
            });
            if (!encounter)
                throw new Error('Encounter not found');
            const updatedReactions = encounter.reactions.filter((id) => id !== characterId) || [];
            const updatedPasses = !encounter.passes.includes(characterId)
                ? [...encounter.passes, characterId]
                : encounter.passes;
            await prisma.encounter.update({
                where: {
                    id: encounterId,
                },
                data: {
                    reactions: updatedReactions,
                    passes: updatedPasses,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to advance turn');
        }
    },
    passAllReactions: async (encounterId) => {
        try {
            const encounter = await prisma.encounter.findUnique({
                where: { id: encounterId },
                select: { turnOrder: true, turnPosition: true },
            });
            const reactiveIds = encounter === null || encounter === void 0 ? void 0 : encounter.turnOrder.filter((_, index) => index !== encounter.turnPosition);
            await prisma.encounter.update({
                where: {
                    id: encounterId,
                },
                data: {
                    reactions: [],
                    passes: reactiveIds,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to advance turn');
        }
    },
    confirmActionQueueResults: async (encounterId, blockData) => {
        var _a;
        try {
            const encounter = await prisma.encounter.findUnique({
                where: { id: encounterId },
                select: {
                    phaseHistory: {
                        take: 1,
                        orderBy: { createdAt: 'desc' },
                        select: {
                            action: {
                                include: {
                                    item: true,
                                    character: { include: { conditions: true, perks: true } },
                                    action: true,
                                    target: {
                                        include: {
                                            conditions: { include: { condition: true } },
                                            perks: true,
                                            characterInventory: { include: { items: true } },
                                        },
                                    },
                                },
                            },
                            reactions: {
                                include: {
                                    item: true,
                                    character: { include: { conditions: true, perks: true } },
                                    action: true,
                                    target: { include: { conditions: true, perks: true } },
                                },
                            },
                        },
                    },
                },
            });
            const phaseHistory = encounter === null || encounter === void 0 ? void 0 : encounter.phaseHistory[0];
            if (!phaseHistory) {
                throw new Error('Failed to find phase history');
            }
            if (!encounter) {
                throw new Error('Failed to find encounter');
            }
            if ((_a = phaseHistory.action) === null || _a === void 0 ? void 0 : _a.rollResult) {
                const successes = calculateActionQueueSuccesses(encounter === null || encounter === void 0 ? void 0 : encounter.phaseHistory[0]);
                const { damage, instances } = calculateDamage(phaseHistory.action.item, phaseHistory.action.action, successes);
                let blockedDamage = blockData.reduce((sum, data) => sum + data.blockedDamage, 0);
                const armorCosts = new Map();
                if (blockData) {
                    for (const data of blockData) {
                        data.armorIds.forEach((id) => {
                            const currentValue = armorCosts.get(id);
                            if (currentValue) {
                                armorCosts.set(id, currentValue + 1);
                            }
                            else {
                                armorCosts.set(id, 1);
                            }
                        });
                    }
                    for (const id of armorCosts.keys()) {
                        const armor = await itemServices.getItemById(id);
                        await calculateCosts(undefined, armor, {
                            costs: {
                                currentBlock: armorCosts.get(id),
                            },
                        });
                    }
                }
                const finalDamage = damage - blockedDamage > 0 ? damage - blockedDamage : 0;
                if (phaseHistory.action.target) {
                    await applyDamage(phaseHistory.action.target, finalDamage);
                    return {
                        targetId: phaseHistory.action.target.id,
                        armorIds: Array.from(armorCosts.keys()) || [],
                    };
                }
            }
            return { targetId: null, armorIds: [] };
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to confirm action queue results');
        }
    },
    createEncounterHistory: async (campaignId, encounterId, formData) => {
        try {
            const history = await prisma.history.create({
                data: Object.assign({ campaignId,
                    encounterId }, formData),
            });
            return history;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create encounter history entry');
        }
    },
    setPhaseAction: async (encounterId, phaseAction) => {
        try {
            const phaseHistory = await prisma.phaseHistory.findFirst({
                where: { encounterId },
                orderBy: { createdAt: 'desc' },
            });
            if (!phaseHistory) {
                throw new Error(`Failed to find latest phase history entry for encounter ${encounterId}`);
            }
            await prisma.phaseHistory.update({
                where: { id: phaseHistory.id },
                data: {
                    action: { connect: { id: phaseAction.id } },
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to connect phase action');
        }
    },
    setPhaseReaction: async (encounterId, phaseReaction) => {
        try {
            const phaseHistory = await prisma.phaseHistory.findFirst({
                where: { encounterId },
                orderBy: { createdAt: 'desc' },
            });
            if (!phaseHistory) {
                throw new Error(`Failed to find latest phase history entry for encounter ${encounterId}`);
            }
            await prisma.phaseHistory.update({
                where: { id: phaseHistory.id },
                data: {
                    reactions: { connect: { id: phaseReaction.id } },
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to connect phase reaction');
        }
    },
    createOrUpdateEncounter: async (campaignId, mapId, formData) => {
        const existingEncounter = await prisma.encounter.findFirst({
            where: { mapId },
        });
        if (existingEncounter && formData.id !== existingEncounter.id) {
            throw new Error('You cannot create an encounter on a map which already belongs to another active or pending encounter');
        }
        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId },
            select: {
                date: true,
                time: true,
            },
        });
        const map = await prisma.map.findUnique({
            where: { id: mapId },
            select: { name: true },
        });
        if (!campaign || !map)
            throw new Error('No campaign or map found');
        const eventData = { name: `Encounter at ${map.name}` };
        //@ts-ignore
        if (campaign.date && 'month' in campaign.date) {
            //@ts-ignore
            eventData.month = campaign.date.month;
        }
        //@ts-ignore
        if (campaign.date && 'day' in campaign.date) {
            //@ts-ignore
            eventData.day = campaign.date.day;
        }
        //@ts-ignore
        if (campaign.time) {
            //@ts-ignore
            eventData.time = campaign.time;
        }
        const oldEncounter = (formData === null || formData === void 0 ? void 0 : formData.id)
            ? await prisma.encounter.findUnique({
                where: { id: formData === null || formData === void 0 ? void 0 : formData.id },
            })
            : {};
        const _a = Object.assign(Object.assign({}, oldEncounter), formData), { id, mapId: m, campaignId: c } = _a, data = __rest(_a, ["id", "mapId", "campaignId"]);
        try {
            const encounter = await prisma.encounter.upsert({
                where: { id: (formData === null || formData === void 0 ? void 0 : formData.id) || 0 },
                update: Object.assign(Object.assign({}, data), { campaign: { connect: { id: campaignId } }, map: { connect: { id: mapId } }, characters: {
                        set: formData.turnOrder.map((id) => ({ id })),
                    } }),
                create: Object.assign(Object.assign({}, data), { campaign: { connect: { id: campaignId } }, map: { connect: { id: mapId } }, characters: {
                        connect: formData.turnOrder.map((id) => ({ id })),
                    }, event: {
                        create: Object.assign({ campaign: { connect: { id: campaignId } } }, eventData),
                    } }),
            });
            return encounter;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create or update encounter');
        }
    },
    deleteEncounter: async (encounterId) => {
        try {
            const encounter = await prisma.encounter.findUnique({
                where: { id: encounterId },
            });
            if (!encounter) {
                throw new Error('Failed to find encounter');
            }
            await prisma.encounter.delete({
                where: {
                    id: Number(encounterId),
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error(error.message || 'Failed to delete encounter');
        }
    },
};
export default encounterServices;
