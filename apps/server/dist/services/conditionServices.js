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
const conditionServices = {
    getConditions: async () => {
        try {
            const conditions = await prisma.condition.findMany({
                orderBy: { name: 'asc' },
            });
            return conditions;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch conditions');
        }
    },
    getConditionById: async (conditionId) => {
        try {
            const condition = await prisma.condition.findUnique({
                where: { id: conditionId },
            });
            return condition;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch condition');
        }
    },
    getConditionByName: async (conditionName) => {
        try {
            const condition = await prisma.condition.findUnique({
                where: { name: conditionName },
            });
            return condition;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch condition');
        }
    },
    createCondition: async (formData) => {
        try {
            const { id } = formData, data = __rest(formData, ["id"]);
            const condition = await prisma.condition.upsert({
                where: { id: formData.id || 0 },
                update: data,
                create: data,
            });
            return condition;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create or update condition');
        }
    },
    updateCharacterConditionStacks: async (conditionId, value) => {
        try {
            const conditionReference = await prisma.characterConditionReference.findUnique({
                where: { id: conditionId },
                select: { stacks: true },
            });
            if (!conditionReference) {
                throw new Error('Failed to find condition reference');
            }
            const condition = await prisma.characterConditionReference.update({
                where: { id: conditionId },
                data: {
                    stacks: conditionReference.stacks ? { increment: value } : value,
                },
                include: { condition: { select: { name: true } } },
            });
            return condition.condition.name;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to udpate character condition stacks');
        }
    },
    updateItemConditionStacks: async (conditionId, value) => {
        try {
            const conditionReference = await prisma.itemConditionReference.findUnique({
                where: { id: conditionId },
                select: { stacks: true },
            });
            if (!conditionReference) {
                throw new Error('Failed to find condition reference');
            }
            const condition = await prisma.itemConditionReference.update({
                where: { id: conditionId },
                data: {
                    stacks: conditionReference.stacks ? { increment: value } : value,
                },
                include: { condition: { select: { name: true } } },
            });
            return condition.condition.name;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to udpate item condition stacks');
        }
    },
    deleteCondition: async (conditionId) => {
        try {
            await prisma.condition.delete({
                where: {
                    id: conditionId,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to delete condition');
        }
    },
    deleteCharacterCondition: async (conditionId) => {
        try {
            await prisma.characterConditionReference.delete({
                where: {
                    id: conditionId,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to delete character condition');
        }
    },
    deleteItemCondition: async (conditionId) => {
        try {
            await prisma.itemConditionReference.delete({
                where: {
                    id: conditionId,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to delete item condition');
        }
    },
};
export default conditionServices;
