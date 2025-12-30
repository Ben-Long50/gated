import prisma from '../config/database.js';
import characterServices from './characterServices.js';
const characterStatServices = {
    editCharacterStat: async (characterId, adjustments) => {
        try {
            const prevCharacter = await characterServices.getCharacterById(characterId);
            const characterStats = prevCharacter === null || prevCharacter === void 0 ? void 0 : prevCharacter.stats;
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
                    if (value + adjustments[stat] < 0) {
                        return [stat, 0];
                    }
                    if (stat === 'currentHealth') {
                        if (value + adjustments[stat] > characterStats.maxHealth) {
                            return [stat, characterStats.maxHealth];
                        }
                    }
                    if (stat === 'currentSanity') {
                        if (value + adjustments[stat] > characterStats.maxSanity) {
                            return [stat, characterStats.maxSanity];
                        }
                    }
                    if (stat === 'injuries') {
                        if (value + adjustments[stat] >
                            characterStats.permanentInjuries) {
                            return [stat, characterStats.permanentInjuries];
                        }
                    }
                    if (stat === 'insanities') {
                        if (value + adjustments[stat] >
                            characterStats.permanentInsanities) {
                            return [stat, characterStats.permanentInsanities];
                        }
                    }
                    if (stat === 'currentHands') {
                        if (value + adjustments[stat] > characterStats.hands) {
                            return [stat, characterStats.hands];
                        }
                    }
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
