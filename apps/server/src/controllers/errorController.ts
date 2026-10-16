import { Request, Response } from 'express';
import errorServices from '../services/errorServices.js';
import { validation } from '@gated/shared';
import handleControllerError from './handleControllerError.js';

const errorController = {
  getErrorReports: async (_req: Request, res: Response) => {
    try {
      const errorReports = await errorServices.getErrorReports();

      res.status(200).json(errorReports);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  createErrorReport: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      const validatedErrorReport = validation.ErrorReportInput.parse(req.body);

      const errorReport = await errorServices.createErrorReport(
        validatedErrorReport,
        req.user.id,
      );

      res
        .status(200)
        .json({ errorReport, message: 'Successfully created error report' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  deleteErrorReport: async (req: Request, res: Response) => {
    try {
      await errorServices.deleteErrorReport(Number(req.params.errorId));

      res.status(200).json({ message: 'Successfully deleted error report' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },
};

export default errorController;
