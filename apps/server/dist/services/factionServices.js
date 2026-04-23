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
const factionInclude = {
    affiliations: { select: { id: true } },
    campaign: { select: { ownerId: true } },
};
const factionServices = {
    getBatchFactions: async (factionIds) => {
        try {
            const factions = await prisma.faction.findMany({
                where: { id: { in: factionIds } },
                include: factionInclude,
            });
            return factions;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch factions');
        }
    },
    getFactionById: async (factionId) => {
        try {
            const faction = await prisma.faction.findUnique({
                where: { id: factionId },
                include: factionInclude,
            });
            return faction;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch faction');
        }
    },
    updateFaction: async (formData) => {
        try {
            const { id } = formData, data = __rest(formData, ["id"]);
            const faction = await prisma.faction.update({
                where: { id },
                data,
                include: factionInclude,
            });
            return faction;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to update faction');
        }
    },
    deleteFaction: async (factionId) => {
        try {
            const faction = await prisma.faction.findUnique({
                where: {
                    id: factionId,
                },
                select: {
                    affiliations: { select: { id: true } },
                },
            });
            if (!faction) {
                throw new Error('Failed to find faction');
            }
            await prisma.$transaction(async (tx) => {
                await tx.affiliation.deleteMany({
                    where: {
                        id: {
                            in: faction.affiliations.map((affiliation) => affiliation.id),
                        },
                    },
                });
                await tx.faction.delete({
                    where: {
                        id: factionId,
                    },
                });
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to delete faction');
        }
    },
};
export default factionServices;
