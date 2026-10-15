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
        const { id } = formData, data = __rest(formData, ["id"]);
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
