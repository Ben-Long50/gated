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
const gangInclude = {
    faction: { select: { id: true, name: true, factionType: true } },
    leaders: {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            generatedPicture: { select: { publicId: true } },
            userId: true,
        },
    },
    characters: {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            generatedPicture: { select: { publicId: true } },
            userId: true,
            playerCharacter: true,
            level: true,
        },
        orderBy: { firstName: 'asc' },
    },
    turf: true,
    properties: true,
    affiliations: { select: { id: true } },
    gangSessionBonuses: true,
    generatedPicture: { select: { publicId: true } },
};
const gangServices = {
    getGangs: async (gangId) => {
        try {
            const gangs = await prisma.gang.findMany({
                where: { id: gangId },
                include: gangInclude,
            });
            return gangs;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch owner gangs');
        }
    },
    getBatchGangs: async (gangIds) => {
        try {
            const gangs = await prisma.gang.findMany({
                where: { id: { in: gangIds } },
                include: gangInclude,
            });
            return gangs;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch gangs');
        }
    },
    getGangById: async (gangId) => {
        try {
            const gang = await prisma.gang.findUnique({
                where: { id: gangId },
                include: gangInclude,
            });
            return gang;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch gang');
        }
    },
    createOrUpdateGang: async (formData) => {
        const { leaderIds, characterIds } = formData, data = __rest(formData, ["leaderIds", "characterIds"]);
        try {
            const gang = await prisma.gang.upsert({
                where: { id: (formData === null || formData === void 0 ? void 0 : formData.id) || 0 },
                update: Object.assign(Object.assign({}, data), { leaders: {
                        set: formData.leaderIds.map((leaderId) => ({ id: leaderId })),
                    }, characters: {
                        set: formData.characterIds.map((characterId) => ({
                            id: characterId,
                        })),
                    } }),
                create: Object.assign(Object.assign({}, data), { leaders: {
                        connect: formData.leaderIds.map((leaderId) => ({ id: leaderId })),
                    }, characters: {
                        connect: formData.characterIds.map((characterId) => ({
                            id: characterId,
                        })),
                    } }),
                include: gangInclude,
            });
            return gang;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create or update gang');
        }
    },
    updateGangCharacters: async (gangId, value) => {
        try {
            const gang = await prisma.gang.update({
                where: { id: gangId },
                data: {
                    leaders: {
                        set: value.leaderIds.map((leaderId) => ({ id: leaderId })),
                    },
                    characters: {
                        set: value.characterIds.map((characterId) => ({
                            id: characterId,
                        })),
                    },
                },
            });
            return gang;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create or update gang');
        }
    },
    allocateReputation: async (gangId, sessionId, bonus) => {
        try {
            const gang = await prisma.gang.update({
                where: { id: gangId },
                data: {
                    gangSessionBonuses: {
                        upsert: {
                            where: {
                                gangId_sessionId: {
                                    gangId,
                                    sessionId,
                                },
                            },
                            update: {
                                reputationBonus: bonus,
                            },
                            create: {
                                sessionId,
                                reputationBonus: bonus,
                            },
                        },
                    },
                },
                include: gangInclude,
            });
            return gang;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to allocate reputation bonus');
        }
    },
    allocateLevelNodes: async (gangId, sessionId, bonus) => {
        try {
            const gang = await prisma.gang.update({
                where: { id: gangId },
                data: {
                    gangSessionBonuses: {
                        upsert: {
                            where: {
                                gangId_sessionId: {
                                    gangId,
                                    sessionId,
                                },
                            },
                            update: {
                                levelNodeBonus: bonus,
                            },
                            create: {
                                sessionId,
                                levelNodeBonus: bonus,
                            },
                        },
                    },
                },
                include: gangInclude,
            });
            return gang;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to allocate level node bonus');
        }
    },
    editGangProfits: async (gangId, value) => {
        try {
            const gang = await prisma.gang.update({
                where: {
                    id: gangId,
                },
                data: {
                    profits: { increment: value },
                },
                include: gangInclude,
            });
            return gang;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to update current gang profits');
        }
    },
    distributeProfits: async (gangId, characterId, value) => {
        try {
            const { gang, character } = await prisma.$transaction(async (tx) => {
                const gang = await tx.gang.update({
                    where: { id: gangId },
                    data: {
                        profits: { decrement: value },
                    },
                });
                const character = await tx.character.update({
                    where: { id: characterId },
                    data: {
                        profits: { increment: value },
                    },
                });
                return { gang, character };
            });
            return { gang, character };
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to update current profits');
        }
    },
    deleteGang: async (gangId) => {
        try {
            const gang = await prisma.gang.findUnique({
                where: {
                    id: gangId,
                },
                select: {
                    affiliations: { select: { id: true } },
                },
            });
            if (!gang) {
                throw new Error('Failed to find gang');
            }
            await prisma.$transaction(async (tx) => {
                await tx.affiliation.deleteMany({
                    where: {
                        id: {
                            in: gang.affiliations.map((affiliation) => affiliation.id),
                        },
                    },
                });
                await tx.gang.delete({
                    where: {
                        id: gangId,
                    },
                });
            });
        }
        catch (error) {
            console.error(error);
            throw new Error(error.message || 'Failed to delete gang');
        }
    },
};
export default gangServices;
