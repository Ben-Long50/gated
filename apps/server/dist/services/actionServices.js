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
    keywordModifiers: { select: { id: true } },
    itemLink: { select: { item: { select: { name: true } } } },
};
const actionServices = {
    getActions: async () => {
        try {
            const actions = await prisma.action.findMany({
                where: { characterInventory: null, baseActionId: null },
                include: actionInclude,
                orderBy: { name: 'asc' },
            });
            return actions;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch actions');
        }
    },
    getActionById: async (actionId) => {
        try {
            const action = await prisma.action.findUnique({
                where: { id: actionId },
                include: actionInclude,
            });
            return action;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch action');
        }
    },
    getBatchActions: async (actionIds) => {
        try {
            const actions = await prisma.action.findMany({
                where: {
                    id: { in: actionIds },
                },
                include: actionInclude,
            });
            return actions;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch actions');
        }
    },
    createOrUpdateAction: async (formData) => {
        try {
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
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create or update action');
        }
    },
    createActionCopy: async (actionId) => {
        try {
            const actionInfo = await prisma.action.findUnique({
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
            const action = await prisma.action.create({
                data: Object.assign(Object.assign({}, data), { keywordModifiers: {
                        createMany: { data: actionInfo.keywordModifiers || [] },
                    }, baseActionId: actionInfo.baseActionId || id }),
                include: actionInclude,
            });
            return action;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create action copy');
        }
    },
    createCharacterActionCopy: async (actionList, characterInventoryId, tx) => {
        const client = tx || prisma;
        const actionIds = actionList === null || actionList === void 0 ? void 0 : actionList.map((action) => action.actionId);
        const actions = await prisma.action.findMany({
            where: { id: { in: actionIds } },
            include: {
                keywordModifiers: { select: { keywordId: true, value: true } },
            },
        });
        const newActions = await Promise.all(actionList.flatMap(({ actionId, quantity }) => {
            const actionDetails = actions.find((action) => action.id === actionId);
            const validatedAction = ActionInput.parse(actionDetails);
            const { id } = validatedAction, data = __rest(validatedAction, ["id"]);
            if (actionDetails) {
                return Array.from({ length: quantity }).map(() => client.action.create({
                    data: Object.assign(Object.assign({}, data), { keywordModifiers: {
                            createMany: { data: actionDetails.keywordModifiers || [] },
                        }, baseActionId: actionDetails.baseActionId || actionDetails.id, characterInventoryId }),
                    include: actionInclude,
                }));
            }
            return;
        }));
        return newActions;
    },
    activateAction: async (actionId, value) => {
        try {
            const action = await prisma.action.update({
                where: { id: actionId },
                data: { active: !value },
                include: actionInclude,
            });
            return action;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to toggle action');
        }
    },
    deleteAction: async (actionId) => {
        try {
            await prisma.action.delete({
                where: {
                    id: actionId,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to delete action');
        }
    },
    deleteActions: async (actionIds) => {
        try {
            await prisma.action.deleteMany({
                where: {
                    id: { in: actionIds },
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to delete actions');
        }
    },
};
export default actionServices;
