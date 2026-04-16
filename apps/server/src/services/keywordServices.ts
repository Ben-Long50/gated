import prisma from '../config/database.js';
import { KeywordInput } from '../validation/keywordSchema.js';

const keywordServices = {
  getKeywords: async () => {
    try {
      const keywords = await prisma.keyword.findMany({
        orderBy: { name: 'asc' },
      });
      return keywords;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch keywords');
    }
  },

  getKeywordById: async (keywordId: string) => {
    try {
      const keyword = await prisma.keyword.findUnique({
        where: { id: Number(keywordId) },
      });
      return keyword;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch keyword');
    }
  },

  createKeyword: async (formData: KeywordInput) => {
    try {
      const keyword = await prisma.keyword.upsert({
        where: { id: formData.id || 0 },
        update: formData,
        create: formData,
      });

      return keyword;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create or update keyword');
    }
  },

  deleteKeyword: async (keywordId: string) => {
    try {
      await prisma.keyword.delete({
        where: {
          id: Number(keywordId),
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to delete keyword');
    }
  },
};

export default keywordServices;
