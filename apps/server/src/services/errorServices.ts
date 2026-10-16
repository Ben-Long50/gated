import { ErrorReportInput } from '@gated/shared/validation';
import prisma from '../config/database.js';

const errorServices = {
  getErrorReports: async () => {
    const errorReports = await prisma.error.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    return errorReports;
  },

  createErrorReport: async (formData: ErrorReportInput, userId: number) => {
    const { id, ...data } = formData;

    const errorReport = await prisma.error.create({
      data: { ...data, userId },
    });

    return errorReport;
  },

  deleteErrorReport: async (errorId: number) => {
    await prisma.error.delete({
      where: {
        id: errorId,
      },
    });
  },
};

export default errorServices;
