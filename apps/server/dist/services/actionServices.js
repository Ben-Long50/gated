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
import addVariableStats from '../utils/addVariableStats.js';
import { ActionInput } from '../validation/actionSchema.js';
const actionInclude = {
    keywordModifiers: { select: { keyword: true, value: true } },
    perk: { select: { name: true, id: true } },
    parentItem: { select: { name: true, id: true, itemTypes: true } },
};
const actionServices = {
    getActions: async () => {
        const actions = await prisma.action.findMany({
            where: { baseActionId: null },
            include: actionInclude,
            orderBy: { name: 'asc' },
        });
        return actions;
    },
    getActionById: async (actionId) => {
        const action = await prisma.action.findUnique({
            where: { id: actionId },
            include: actionInclude,
        });
        return action;
    },
    getBatchActions: async (actionIds) => {
        const actions = await prisma.action.findMany({
            where: {
                id: { in: actionIds },
            },
            include: actionInclude,
        });
        return actions;
    },
    createOrUpdateAction: async (formData) => {
        const { id, modifiers, keywords } = formData, data = __rest(formData, ["id", "modifiers", "keywords"]);
        const modifierStats = modifiers ? addVariableStats(modifiers) : undefined;
        const newAction = await prisma.action.upsert({
            where: { id: formData.id || 0 },
            update: Object.assign(Object.assign({}, data), { modifiers: modifierStats, keywordModifiers: {
                    deleteMany: {},
                    createMany: { data: keywords || [] },
                } }),
            create: Object.assign(Object.assign({}, data), { modifiers: modifierStats, keywordModifiers: { createMany: { data: keywords || [] } } }),
            include: actionInclude,
        });
        return newAction;
    },
    createActionCopy: async (actionId, tx) => {
        var _a;
        const client = tx !== null && tx !== void 0 ? tx : prisma;
        const actionInfo = await client.action.findUnique({
            where: { id: actionId },
            include: {
                keywordModifiers: { select: { keywordId: true, value: true } },
            },
        });
        if (!actionInfo) {
            throw new Error('Failed to find action');
        }
        const validatedAction = ActionInput.parse(actionInfo);
        const { id } = validatedAction, data = __rest(validatedAction, ["id"]);
        const action = await client.action.create({
            data: Object.assign(Object.assign({}, data), { keywordModifiers: {
                    createMany: { data: actionInfo.keywordModifiers || [] },
                }, baseActionId: (_a = validatedAction.baseActionId) !== null && _a !== void 0 ? _a : id }),
            include: actionInclude,
        });
        return action;
    },
    activateAction: async (actionId, value) => {
        const action = await prisma.action.update({
            where: { id: actionId },
            data: { active: !value },
            include: actionInclude,
        });
        return action;
    },
    deleteAction: async (actionId) => {
        await prisma.action.delete({
            where: {
                id: actionId,
            },
        });
    },
    deleteActions: async (actionIds) => {
        await prisma.action.deleteMany({
            where: {
                id: { in: actionIds },
            },
        });
    },
};
export default actionServices;
