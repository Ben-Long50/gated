import prisma from '../config/database.js';
const conditionServices = {
    getConditions: async () => {
        const conditions = await prisma.condition.findMany({
            orderBy: { name: 'asc' },
        });
        return conditions;
    },
    getConditionById: async (conditionId) => {
        const condition = await prisma.condition.findUnique({
            where: { id: conditionId },
        });
        return condition;
    },
    getConditionByName: async (conditionName) => {
        const condition = await prisma.condition.findUnique({
            where: { name: conditionName },
        });
        return condition;
    },
    createCondition: async (formData) => {
        const { id, ...data } = formData;
        const condition = await prisma.condition.upsert({
            where: { id: formData.id || 0 },
            update: data,
            create: data,
        });
        return condition;
    },
    updateCharacterConditionStacks: async (conditionId, value) => {
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
    },
    updateItemConditionStacks: async (conditionId, value) => {
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
    },
    deleteCondition: async (conditionId) => {
        await prisma.condition.delete({
            where: {
                id: conditionId,
            },
        });
    },
    deleteCharacterCondition: async (conditionId) => {
        await prisma.characterConditionReference.delete({
            where: {
                id: conditionId,
            },
        });
    },
    deleteItemCondition: async (conditionId) => {
        await prisma.itemConditionReference.delete({
            where: {
                id: conditionId,
            },
        });
    },
};
export default conditionServices;
