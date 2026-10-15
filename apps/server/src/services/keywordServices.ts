import prisma from '../config/database.js';
import { KeywordInput } from '../validation/keywordSchema.js';

export const keywordSelectForCopy = { value: true, keywordId: true };

const keywordServices = {
  getKeywords: async () => {
    const keywords = await prisma.keyword.findMany({
      orderBy: { name: 'asc' },
    });
    return keywords;
  },

  getKeywordById: async (keywordId: number) => {
    const keyword = await prisma.keyword.findUnique({
      where: { id: keywordId },
    });
    return keyword;
  },

  createKeyword: async (formData: KeywordInput) => {
    const { id, ...data } = formData;

    const keyword = await prisma.keyword.upsert({
      where: { id: id || 0 },
      update: data,
      create: data,
    });

    return keyword;
  },

  deleteKeyword: async (keywordId: number) => {
    await prisma.keyword.delete({
      where: {
        id: keywordId,
      },
    });
  },
};

export default keywordServices;
