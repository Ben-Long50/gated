import prisma from '../config/database.js';
const factionInclude = {
    affiliations: { select: { id: true } },
    gangs: { select: { name: true } },
    campaign: { select: { ownerId: true } },
};
const factionServices = {
    getBatchFactions: async (factionIds) => {
        const factions = await prisma.faction.findMany({
            where: { id: { in: factionIds } },
            include: factionInclude,
        });
        return factions;
    },
    getFactionById: async (factionId) => {
        const faction = await prisma.faction.findUnique({
            where: { id: factionId },
            include: factionInclude,
        });
        return faction;
    },
    updateFaction: async (formData) => {
        const { id, ...data } = formData;
        const faction = await prisma.faction.update({
            where: { id },
            data,
            include: factionInclude,
        });
        return faction;
    },
    deleteFaction: async (factionId) => {
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
    },
};
export default factionServices;
