import { Request, Response } from 'express';
import encounterServices from '../services/encounterServices.js';

const encounterController = {
  getEncounters: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ error: 'You must be signed in to use this function' });
        return;
      }

      const encounters = await encounterServices.getEncounters(
        Number(req.params.campaignId),
      );

      res.status(200).json(encounters);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  getEncounterById: async (req: Request, res: Response) => {
    try {
      const encounter = await encounterServices.getEncounterById(
        Number(req.params.encounterId),
      );
      res.status(200).json(encounter);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  getBatchEncounters: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      const encounters = await encounterServices.getBatchEncounters(
        req.body.combatIds,
      );

      res.status(200).json(encounters);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  getEncounterHistory: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      const history = await encounterServices.getEncounterHistory(
        Number(req.params.encounterId),
      );

      res.status(200).json(history);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  advanceTurn: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      await encounterServices.advanceTurn(Number(req.params.encounterId));

      res.status(200).json({ message: 'Successfully advanced the turn' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  createOrUpdateEncounter: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({
          error:
            'You do not have the required permissions to create a encounter',
        });
        return;
      }

      console.log(req.body);

      await encounterServices.createOrUpdateEncounter(
        Number(req.params.campaignId),
        Number(req.params.mapId),
        req.body,
      );

      res.status(200).json({ message: 'Successfully created encounter' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  },

  deleteEncounter: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ error: 'You must be signed in to use this function' });
        return;
      }

      await encounterServices.deleteEncounter(Number(req.params.encounterId));
      res.status(200).json({ message: 'Successfully deleted encounter' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default encounterController;
