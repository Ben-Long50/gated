import { Request, Response } from 'express';
import perkServices from '../services/perkServices.js';
import { validation } from '@gated/shared';
import handleControllerError from './handleControllerError.js';

const perkController = {
  getPerks: async (_req: Request, res: Response) => {
    try {
      const perks = await perkServices.getPerks();

      res.status(200).json(perks);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getBatchPerks: async (req: Request, res: Response) => {
    try {
      const perkIds = (req.query.ids as string).split(',').map(Number);

      const perks = await perkServices.getBatchPerks(perkIds);

      res.status(200).json(perks);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getPerkById: async (req: Request, res: Response) => {
    try {
      const perk = await perkServices.getPerkById(Number(req.params.perkId));

      res.status(200).json(perk);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  createPerk: async (req: Request, res: Response) => {
    try {
      const validatedPerk = validation.PerkSchema.parse(req.body);

      const perk = await perkServices.createPerk(validatedPerk);

      res.status(200).json({ perk, message: 'Successfully created perk' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  deletePerk: async (req: Request, res: Response) => {
    try {
      await perkServices.deletePerk(Number(req.params.perkId));

      res.status(200).json({ message: 'Successfully deleted perk' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },
};

export default perkController;
