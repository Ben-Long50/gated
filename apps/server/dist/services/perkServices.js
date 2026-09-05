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
import prisma from '../config/database.js';
import actionServices from './actionServices.js';
const perkInclude = {
    actions: true,
};
const perkServices = {
    getPerks: async () => {
        const perks = await prisma.perk.findMany({
            where: { basePerkId: null },
            orderBy: { name: 'asc' },
            include: perkInclude,
        });
        return perks;
    },
    getBatchPerks: async (perkIds) => {
        const perks = await prisma.perk.findMany({
            where: {
                id: { in: perkIds },
            },
            include: perkInclude,
        });
        return perks;
    },
    getPerkById: async (perkId) => {
        const perk = await prisma.perk.findUnique({
            where: { id: perkId },
            include: perkInclude,
        });
        return perk;
    },
    createPerk: async (formData) => {
        const { id, actionIds } = formData, data = __rest(formData, ["id", "actionIds"]);
        const perk = await prisma.perk.upsert({
            where: { id: id || 0 },
            update: Object.assign(Object.assign({}, data), { actions: { set: actionIds === null || actionIds === void 0 ? void 0 : actionIds.map((id) => ({ id })) } }),
            create: Object.assign(Object.assign({}, data), { actions: { connect: actionIds === null || actionIds === void 0 ? void 0 : actionIds.map((id) => ({ id })) } }),
            include: perkInclude,
        });
        return perk;
    },
    createPerkCopy: async (perkId, tx) => {
        var _a;
        const client = tx !== null && tx !== void 0 ? tx : prisma;
        const perk = await client.perk.findUnique({
            where: { id: perkId, basePerkId: null },
            select: {
                id: true,
                name: true,
                description: true,
                type: true,
                attributes: true,
                actions: { select: { id: true } },
            },
        });
        if (!perk) {
            throw new Error('Failed to find base perk');
        }
        const { id, actions } = perk, data = __rest(perk, ["id", "actions"]);
        const newActionIds = [];
        if (actions.length > 0) {
            for (const action of actions) {
                const newAction = await actionServices.createActionCopy(action.id, client);
                newActionIds.push(newAction.id);
            }
        }
        const newPerk = await client.perk.create({
            data: Object.assign(Object.assign({}, data), { attributes: (_a = data.attributes) !== null && _a !== void 0 ? _a : undefined, basePerkId: id, actions: {
                    connect: newActionIds.map((id) => ({ id })),
                } }),
            include: perkInclude,
        });
        return newPerk;
    },
    deletePerk: async (perkId) => {
        await prisma.perk.delete({
            where: {
                id: perkId,
            },
        });
    },
};
export default perkServices;
