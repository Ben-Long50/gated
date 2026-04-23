import prisma from '../config/database.js';
import { KeywordInput } from '../validation/keywordSchema.js';

const keywordServices = {
  getKeywords: async () => {
    try {
      const keywords = await prisma.keyword.findMany({
        orderBy: { name: 'asc' },
      });
      return keywords;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch keywords');
    }
  },

  getKeywordById: async (keywordId: number) => {
    try {
      const keyword = await prisma.keyword.findUnique({
        where: { id: keywordId },
      });
      return keyword;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch keyword');
    }
  },

  createKeyword: async (formData: KeywordInput) => {
    try {
      const { id, ...data } = formData;

      const keyword = await prisma.keyword.upsert({
        where: { id: id || 0 },
        update: data,
        create: data,
      });

      return keyword;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create or update keyword');
    }
  },

  deleteKeyword: async (keywordId: number) => {
    try {
      await prisma.keyword.delete({
        where: {
          id: keywordId,
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to delete keyword');
    }
  },
};

export default keywordServices;
