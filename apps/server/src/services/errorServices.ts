import prisma from '../config/database.js';
import { ErrorReportInput } from '../validation/errorReportSchema.js';

const errorServices = {
  getErrorReports: async () => {
    try {
      const errorReports = await prisma.error.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      });

      return errorReports;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch error reports');
    }
  },

  createErrorReport: async (formData: ErrorReportInput, userId: number) => {
    try {
      const { id, ...data } = formData;

      const errorReport = await prisma.error.create({
        data: { ...data, userId },
      });

      return errorReport;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create error report');
    }
  },

  deleteErrorReport: async (errorId: number) => {
    try {
      await prisma.error.delete({
        where: {
          id: errorId,
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to delete error report');
    }
  },
};

export default errorServices;
