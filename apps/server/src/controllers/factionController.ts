import { Request, Response } from 'express';
import factionServices from '../services/factionServices.js';
import parseRequestBody from '../utils/parseRequestBody.js';
import { FactionInput } from '../validation/factionSchema.js';
import handleControllerError from './handleControllerError.js';

const factionController = {
  getBatchFactions: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }
      const factionIds = (req.query.ids as string).split(',').map(Number);

      const factions = await factionServices.getBatchFactions(factionIds);

      res.status(200).json(factions);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getFactionById: async (req: Request, res: Response) => {
    try {
      const faction = await factionServices.getFactionById(
        Number(req.params.factionId),
      );

      res.status(200).json(faction);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  updateFaction: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'You do not have the required permissions to update a faction',
        });
        return;
      }

      const parsedBody = parseRequestBody(req.body);

      const validatedFaction = FactionInput.parse(parsedBody);

      const faction = await factionServices.updateFaction(validatedFaction);

      res
        .status(200)
        .json({ faction, message: `Successfully updated ${faction.name}` });
    } catch (error: any) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  },

  deleteFaction: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'You do not have the required permissions to update a faction',
        });
        return;
      }

      await factionServices.deleteFaction(Number(req.params.factionId));
      res.status(200).json({ message: 'Successfully deleted faction' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },
};

export default factionController;
