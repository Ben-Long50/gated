import prisma from '../config/database.js';
import combineObjects from '../utils/combineObjects.js';
import { characterInclude } from './characterServices.js';
const characterStatServices = {
    editCharacterStat: async (characterId, stats) => {
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
            const typedStats = character.stats;
            const updatedCharacter = await prisma.character.update({
                where: {
                    id: Number(characterId),
                },
                data: {
                    stats: combineObjects(typedStats, stats),
                },
                include: characterInclude,
            });
            return updatedCharacter;
        }
        catch (error) {
            console.error(error);
            throw new Error(`Failed to update character stats`);
        }
    },
    resetCharacterStat: async (characterId, stats) => {
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
            const typedStats = character.stats;
            const updatedCharacter = await prisma.character.update({
                where: {
                    id: characterId,
                },
                data: {
                    stats: Object.assign(Object.assign({}, typedStats), { stats }),
                },
                include: characterInclude,
            });
            return updatedCharacter;
        }
        catch (error) {
            console.error(error);
            throw new Error(`Failed to reset character stats}`);
        }
    },
    editProfits: async (characterId, value) => {
        try {
            const character = await prisma.character.update({
                where: {
                    id: characterId,
                },
                data: {
                    profits: { increment: value },
                },
                include: characterInclude,
            });
            return character;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to update current profits');
        }
    },
};
export default characterStatServices;
