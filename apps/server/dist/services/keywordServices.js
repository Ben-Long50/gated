import prisma from '../config/database.js';
export const keywordSelectForCopy = { value: true, keywordId: true };
const keywordServices = {
    getKeywords: async () => {
        const keywords = await prisma.keyword.findMany({
            orderBy: { name: 'asc' },
        });
        return keywords;
    },
    getKeywordById: async (keywordId) => {
        const keyword = await prisma.keyword.findUnique({
            where: { id: keywordId },
        });
        return keyword;
    },
    createKeyword: async (formData) => {
        const { id, ...data } = formData;
        const keyword = await prisma.keyword.upsert({
            where: { id: id || 0 },
            update: data,
            create: data,
        });
        return keyword;
    },
    deleteKeyword: async (keywordId) => {
        await prisma.keyword.delete({
            where: {
                id: keywordId,
            },
        });
    },
};
export default keywordServices;
