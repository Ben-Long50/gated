import prisma from '../config/database.js';
const combatServices = {
    getCombats: async (campaignId) => {
        try {
            const combats = await prisma.combat.findMany({
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
            return combats;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch owner combats');
        }
    },
    getCombatById: async (combatId) => {
        try {
            const combat = await prisma.combat.findUnique({
                where: { id: Number(combatId) },
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
            });
            if (!combat) {
                throw new Error('Failed to find combat');
            }
            return combat;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch combat');
        }
    },
    createOrUpdateCombat: async (campaignId, mapId, formData) => {
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
        const eventData = { name: `Combat at ${map.name}` };
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
        try {
            const combat = await prisma.combat.upsert({
                where: { id: (formData === null || formData === void 0 ? void 0 : formData.id) || 0 },
                update: {
                    campaign: { connect: { id: campaignId } },
                    map: { connect: { id: mapId } },
                    characters: {
                        set: formData.characters,
                    },
                },
                create: {
                    campaign: { connect: { id: campaignId } },
                    map: { connect: { id: mapId } },
                    characters: {
                        connect: formData.characters,
                    },
                    event: {
                        create: Object.assign({ campaign: { connect: { id: campaignId } } }, eventData),
                    },
                },
            });
            return combat;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create or update combat');
        }
    },
    deleteCombat: async (combatId) => {
        try {
            const combat = await prisma.combat.findUnique({
                where: { id: combatId },
            });
            if (!combat) {
                throw new Error('Failed to find combat');
            }
            await prisma.combat.delete({
                where: {
                    id: Number(combatId),
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error(error.message || 'Failed to delete combat');
        }
    },
};
export default combatServices;
