import prisma from '../config/database.js';
const characterStatServices = {
    editCharacterStat: async (characterId, adjustments) => {
        try {
            const character = await prisma.character.findUnique({
                where: {
                    id: characterId,
                },
                select: { stats: true },
            });
            if (!character) {
                throw new Error('Character not found');
            }
            const statsObject = character.stats;
            let adjustedValues = Object.fromEntries(Object.entries(statsObject).map(([stat, value]) => {
                if (adjustments[stat]) {
                    return [stat, value + adjustments[stat]];
                }
                else {
                    return [stat, value];
                }
            }));
            const newStats = Object.assign(Object.assign({}, statsObject), adjustedValues);
            await prisma.character.update({
                where: {
                    id: Number(characterId),
                },
                data: {
                    stats: newStats,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error(`Failed to update character stats`);
        }
    },
    resetCharacterStat: async (characterId, value) => {
        try {
            const character = await prisma.character.findUnique({
                where: {
                    id: Number(characterId),
                },
                select: { stats: true },
            });
            if (!character) {
                throw new Error('Character not found');
            }
            const statsObject = character.stats;
            const newStats = Object.assign(Object.assign({}, statsObject), value);
            await prisma.character.update({
                where: {
                    id: Number(characterId),
                },
                data: {
                    stats: newStats,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error(`Failed to update character stats ${value.toString()}`);
        }
    },
    editProfits: async (characterId, value) => {
        try {
            const character = await prisma.character.findUnique({
                where: {
                    id: characterId,
                },
                select: { profits: true },
            });
            if (!character) {
                throw new Error('Character not found');
            }
            await prisma.character.update({
                where: {
                    id: characterId,
                },
                data: {
                    profits: character.profits + value,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to update current profits');
        }
    },
};
export default characterStatServices;
