// @ts-nocheck
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
import prisma from '../config/database';
import characterServices from '../services/characterServices';
const updateCharacterStats = async () => {
    const characters = await prisma.character.findMany({});
    for (let character of characters) {
        const stats = Object.assign(Object.assign({}, character.stats), { currentActions: 3, currentReactions: 1, currentHands: 2 });
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
        const _a = action.costs, { actionPoints, reactionPoints, health, sanity, power } = _a, rest = __rest(_a, ["actionPoints", "reactionPoints", "health", "sanity", "power"]);
        const newCosts = Object.fromEntries(Object.entries(Object.assign(Object.assign({}, rest), { currentActions: actionPoints, currentReactions: reactionPoints, currentHealth: health, currentSanity: sanity, currentPower: power }))
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
        const characterStats = character === null || character === void 0 ? void 0 : character.stats;
        const stats = {
            injuries: characterStats.injuries || 0,
            insanities: characterStats.insanities || 0,
            permanentInjuries: characterStats.permanentInjuries,
            permanentInsanities: characterStats.permanentInsanities,
            currentActions: 3,
            currentReactions: 1,
            currentHands: 2,
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
