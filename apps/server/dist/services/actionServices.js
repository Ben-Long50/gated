import prisma from '../config/database.js';
import addVariableStats from '../utils/addVariableStats.js';
import { keywordSelectForCopy } from './keywordServices.js';
import { ActionInput } from '@gated/shared/validation';
export const actionSelectForCopy = {
    id: true,
    name: true,
    description: true,
    costs: true,
    roll: true,
    actionType: true,
    actionSubtypes: true,
    duration: true,
    cooldown: true,
    modifiers: true,
    keywordModifiers: { select: keywordSelectForCopy },
    baseActionId: true,
};
export const actionInclude = {
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
        const { id, modifiers, keywords, ...data } = formData;
        const modifierStats = modifiers ? addVariableStats(modifiers) : undefined;
        const newAction = await prisma.action.upsert({
            where: { id: formData.id || 0 },
            update: {
                ...data,
                modifiers: modifierStats,
                keywordModifiers: {
                    deleteMany: {},
                    createMany: { data: keywords || [] },
                },
            },
            create: {
                ...data,
                modifiers: modifierStats,
                keywordModifiers: { createMany: { data: keywords || [] } },
            },
            include: actionInclude,
        });
        return newAction;
    },
    createActionCopy: async (actionId, tx) => {
        const client = tx ?? prisma;
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
        const { id, ...data } = validatedAction;
        const action = await client.action.create({
            data: {
                ...data,
                keywordModifiers: {
                    createMany: { data: actionInfo.keywordModifiers || [] },
                },
                baseActionId: validatedAction.baseActionId ?? id,
            },
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
