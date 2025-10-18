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
                    phaseActionHistory: true,
                    phaseReactionHistories: true,
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
                    phaseActionHistory: {
                        include: {
                            character: true,
                            target: true,
                            action: true,
                            item: true,
                        },
                    },
                    phaseReactionHistories: {
                        include: {
                            character: true,
                            target: true,
                            action: true,
                            item: true,
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
            console.log(encounter === null || encounter === void 0 ? void 0 : encounter.active);
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
    advanceTurn: async (encounterId, turn) => {
        try {
            await prisma.encounter.update({
                where: {
                    id: encounterId,
                },
                data: {
                    turnPosition: turn,
                    combatPhase: 'action',
                    reactions: [],
                    passes: [],
                },
            });
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
            await prisma.encounter.update({
                where: {
                    id: encounterId,
                },
                data: {
                    reactions: [],
                    passes: [],
                    combatPhase: 'action',
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to advance turn');
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
            await prisma.encounter.update({
                where: { id: encounterId },
                data: {
                    phaseActionHistory: { connect: { id: phaseAction.id } },
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
            await prisma.encounter.update({
                where: { id: encounterId },
                data: {
                    phaseReactionHistories: { connect: { id: phaseReaction.id } },
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to connect phase reaction');
        }
    },
    clearPhaseActions: async (encounterId) => {
        try {
            await prisma.encounter.update({
                where: { id: encounterId },
                data: {
                    phaseActionHistory: { disconnect: true },
                    phaseReactionHistories: { set: [] },
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to clear phase actions');
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
