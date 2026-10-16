import { Request, Response } from 'express';
import affiliationServices from '../services/affiliationServices.js';
import handleControllerError from './handleControllerError.js';
import { validation } from '@gated/shared';

const affiliationController = {
  getBatchAffiliations: async (req: Request, res: Response) => {
    try {
      const affiliationIds = (req.query.ids as string).split(',').map(Number);

      const affiliations =
        await affiliationServices.getBatchAffiliations(affiliationIds);

      res.status(200).json(affiliations);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getAffiliationById: async (req: Request, res: Response) => {
    try {
      const affiliation = await affiliationServices.getAffiliationById(
        Number(req.params.affiliationId),
      );

      res.status(200).json(affiliation);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  createAffiliation: async (req: Request, res: Response) => {
    try {
      const validatedAffiliation = validation.AffiliationInput.parse(req.body);

      const affiliation =
        await affiliationServices.createAffiliation(validatedAffiliation);

      res.status(200).json({
        affiliation,
        message: 'Successfully created affiliation',
      });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  updateAffiliationValue: async (req: Request, res: Response) => {
    try {
      const affiliation = await affiliationServices.updateAffiliationValue(
        Number(req.params.affiliationId),
        req.body.value,
      );

      res.status(200).json({
        affiliation,
        message: 'Successfully updated affiliation value',
      });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  deleteAffiliation: async (req: Request, res: Response) => {
    try {
      await affiliationServices.deleteAffiliation(
        Number(req.params.affiliationId),
      );

      res.status(200).json({ message: 'Successfully deleted affiliation' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },
};

export default affiliationController;
