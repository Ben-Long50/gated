import { Request, Response } from 'express';
import affiliationServices from '../services/affiliationServices.js';
import { AffiliationInput } from '../validation/affiliationSchema.js';
import handleControllerError from './handleControllerError.js';

const affiliationController = {
  getAffiliationById: async (req: Request, res: Response) => {
    try {
      const affiliation = await affiliationServices.getAffiliationById(
        Number(req.params.affiliationId),
      );

      res.status(200).json(affiliation);
    } catch (error: any) {
      console.error(error.message);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  },

  getBatchAffiliations: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }
      const affiliationIds = (req.query.ids as string).split(',').map(Number);

      const affiliations =
        await affiliationServices.getBatchAffiliations(affiliationIds);

      res.status(200).json(affiliations);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  createAffiliation: async (req: Request, res: Response) => {
    try {
      const validatedAffiliation = AffiliationInput.parse(req.body);

      const affiliation =
        await affiliationServices.createAffiliation(validatedAffiliation);

      res.status(200).json({
        affiliation,
        message: 'Successfully created affiliation',
      });
    } catch (error: any) {
      console.error(error.message);

      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
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
      console.error(error.message);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  },

  deleteAffiliation: async (req: Request, res: Response) => {
    try {
      await affiliationServices.deleteAffiliation(
        Number(req.params.affiliationId),
      );

      res.status(200).json({ message: 'Successfully deleted affiliation' });
    } catch (error: any) {
      console.error(error.message);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  },
};

export default affiliationController;
