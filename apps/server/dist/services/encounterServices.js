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
                },
            });
            return encounters;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch encounters');
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
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to advance turn');
        }
    },
    createOrUpdateEncounter: async (campaignId, mapId, formData) => {
        console.log(formData);
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
        try {
            const encounter = await prisma.encounter.upsert({
                where: { id: (formData === null || formData === void 0 ? void 0 : formData.id) || 0 },
                update: {
                    campaign: { connect: { id: campaignId } },
                    map: { connect: { id: mapId } },
                    characters: {
                        set: formData.turnOrder.map((id) => ({ id })),
                    },
                    turnOrder: formData.turnOrder,
                    turnPosition: formData.turnPosition,
                },
                create: {
                    campaign: { connect: { id: campaignId } },
                    map: { connect: { id: mapId } },
                    characters: {
                        connect: formData.turnOrder.map((id) => ({ id })),
                    },
                    event: {
                        create: Object.assign({ campaign: { connect: { id: campaignId } } }, eventData),
                    },
                    turnOrder: formData.turnOrder,
                    turnPosition: formData.turnPosition,
                },
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
