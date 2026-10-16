import prisma from '../config/database.js';
import { characterInclude } from './characterServices.js';
import { combineObjects } from '@gated/shared';
const characterStatServices = {
    editCharacterStat: async (characterId, stats) => {
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
    },
    resetCharacterStat: async (characterId, stats) => {
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
                stats: { ...typedStats, stats },
            },
            include: characterInclude,
        });
        return updatedCharacter;
    },
    editProfits: async (characterId, value) => {
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
    },
};
export default characterStatServices;
