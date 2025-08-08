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
const updateActionStats = async () => {
    const characters = await prisma.character.findMany({});
    for (let character of characters) {
        const stats = Object.assign(Object.assign({}, character.stats), { currentActions: 3, currentReactions: 1 });
        console.log(character.stats);
        await prisma.character.update({
            where: { id: character.id },
            data: { stats },
        });
        console.log(`Updated ${character.firstName}`);
    }
};
// updateActionStats();
const updateHandsStats = async () => {
    const characters = await prisma.character.findMany({});
    for (let character of characters) {
        const stats = Object.assign(Object.assign({}, character.stats), { currentHands: 2 });
        await prisma.character.update({
            where: { id: character.id },
            data: { stats },
        });
        console.log(`Updated ${character.firstName}`);
    }
};
// updateHandsStats();
const updateActionCosts = async () => {
    const actions = await prisma.action.findMany({});
    for (let action of actions) {
        const _a = action.costs, { actionPoints, reactionPoints, health, sanity, power } = _a, rest = __rest(_a, ["actionPoints", "reactionPoints", "health", "sanity", "power"]);
        const newCosts = Object.fromEntries(Object.entries(Object.assign(Object.assign({}, rest), { currentActions: actionPoints, currentReactions: reactionPoints, currentHealth: health, currentSanity: sanity, currentPower: power }))
            .filter(([key, value]) => !!value)
            .map(([key, value]) => [key, value]));
        await prisma.action.update({
            where: { id: action.id },
            data: { costs: newCosts },
        });
        console.log(`Updated ${action.name}`);
    }
};
// updateActionCosts();
