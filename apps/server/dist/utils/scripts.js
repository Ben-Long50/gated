// @ts-nocheck
import prisma from '../config/database';
import characterServices from '../services/characterServices';
const updateCharacterStats = async () => {
    const characters = await prisma.character.findMany({});
    for (let character of characters) {
        const stats = {
            ...character.stats,
            currentActions: 3,
            currentReactions: 1,
            currentHands: 2,
        };
        await prisma.character.update({
            where: { id: character.id },
            data: { stats },
        });
        console.log(`Updated ${character.firstName}`);
    }
};
// updateCharacterStats();
const updateActionCosts = async () => {
    const actions = await prisma.action.findMany({});
    for (let action of actions) {
        //@ts-ignore
        const { actionPoints, reactionPoints, health, sanity, power, ...rest } = action.costs;
        const newCosts = Object.fromEntries(Object.entries({
            ...rest,
            currentActions: actionPoints,
            currentReactions: reactionPoints,
            currentHealth: health,
            currentSanity: sanity,
            currentPower: power,
        })
            .filter(([_, value]) => !!value)
            .map(([key, value]) => [key, value]));
        await prisma.action.update({
            where: { id: action.id },
            data: { costs: newCosts },
        });
        console.log(`Updated ${action.name}`);
    }
};
// updateActionCosts();
const updateCampaignDates = async () => {
    const campaigns = await prisma.campaign.findMany({});
    for (let campaign of campaigns) {
        await prisma.campaign.update({
            where: { id: campaign.id },
            data: {
                date: { month: 'arctus', day: 1 },
                time: { hour: 1, minute: 1, second: 1 },
            },
        });
        console.log(`Updated ${campaign.name}`);
    }
};
// updateCampaignDates();
const resetCharacterHealthAndSanity = async () => {
    const characterIds = await prisma.character.findMany({
        select: { id: true },
    });
    for (let id of characterIds) {
        const character = await characterServices.getCharacterById(id.id);
        const characterStats = character?.stats;
        const stats = {
            injuries: characterStats.injuries || 0,
            insanities: characterStats.insanities || 0,
            permanentInjuries: characterStats.permanentInjuries,
            permanentInsanities: characterStats.permanentInsanities,
            currentActions: 3,
            currentReactions: 1,
            currentHands: 2,
            currentFeet: 2,
            currentHealth: characterStats.maxHealth,
            currentSanity: characterStats.maxSanity,
        };
        await prisma.character.update({
            where: { id: id.id },
            data: { stats },
        });
        console.log(`Updated ${character.firstName}`, stats);
    }
};
resetCharacterHealthAndSanity();
