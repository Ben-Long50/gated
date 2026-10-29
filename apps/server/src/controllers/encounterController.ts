import { Request, Response } from 'express';
import encounterServices from '../services/encounterServices.js';
import { getIO } from '../sockets/socket.js';
import handleControllerError from './handleControllerError.js';
import { EncounterInput } from '@gated/shared/validation';

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
      handleControllerError(res, error);
    }
  },

  getEncounterById: async (req: Request, res: Response) => {
    try {
      const encounter = await encounterServices.getEncounterById(
        Number(req.params.encounterId),
      );
      res.status(200).json(encounter);
    } catch (error: any) {
      handleControllerError(res, error);
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
      handleControllerError(res, error);
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
      handleControllerError(res, error);
    }
  },

  activateEncounter: async (req: Request, res: Response) => {
    try {
      const io = getIO();

      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      const encounter = await encounterServices.activateEncounter(
        Number(req.params.encounterId),
      );

      io.to(`campaign ${encounter.campaignId}`).emit(
        'encounterUpdate',
        encounter,
      );

      res.status(200).json({ encounter, message: 'Activated encounter' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  advancePhase: async (req: Request, res: Response) => {
    try {
      const io = getIO();

      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      const { encounter, initiative } = await encounterServices.advancePhase(
        Number(req.params.encounterId),
      );

      io.to(`encounter ${req.params.encounterId}`).emit('updateEncounter', {
        encounter,
      });

      if (encounter.combatPhase === 'action') {
        io.to(`encounter ${req.params.encounterId}`).emit('resetBoard', {
          initiative,
        });
      }

      res
        .status(200)
        .json({ encounter, message: 'Successfully advanced encounter phase' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  advanceTurn: async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.encounter) {
        throw new Error('Could not find authenticated user');
      }

      const encounter = await encounterServices.advanceTurn(
        req.encounter,
        Number(req.params.encounterId),
      );

      res
        .status(200)
        .json({ encounter, message: 'Successfully advanced encounter turn' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  rollInitiative: async (req: Request, res: Response) => {
    try {
      const io = getIO();

      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      const { encounter, rollResultData } =
        await encounterServices.rollInitiative(
          Number(req.params.encounterId),
          req.body.rollData,
        );

      io.to(`encounter ${req.params.encounterId}`).emit('rollInitiative', {
        encounter,
        rollResultData,
      });

      res.status(200).json({
        encounter,
        rollResultData,
        message: 'Successfully rolled initiative',
      });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  rollAction: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      const encounterId = Number(req.params.encounterId);

      const action = await encounterServices.rollAction(
        Number(req.params.campaignId),
        encounterId,
        req.body,
      );

      await encounterServices.setPhaseAction(encounterId, action);
      await encounterServices.advancePhase(encounterId);

      res.status(200).json({ message: 'Successfully rolled action' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  rollReaction: async (req: Request, res: Response) => {
    try {
      const io = getIO();

      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      const encounterId = Number(req.params.encounterId);

      const reaction = await encounterServices.rollAction(
        Number(req.params.campaignId),
        encounterId,
        req.body,
      );

      await encounterServices.setPhaseReaction(encounterId, reaction);
      const updatedEncounter = encounterServices.getEncounterById(encounterId);

      io.to(`encounter ${encounterId}`).emit(
        'updateEncounter',
        updatedEncounter,
      );

      res.status(200).json({ message: 'Successfully rolled reaction' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  scheduleReaction: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      await encounterServices.scheduleReaction(
        Number(req.params.encounterId),
        req.body.characterId,
      );

      res.status(200).json({ message: 'Successfully scheduled reaction' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  passReaction: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      await encounterServices.passReaction(
        Number(req.params.encounterId),
        req.body.characterId,
      );

      res.status(200).json({ message: 'Successfully passed reaction' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  finishReaction: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      await encounterServices.finishReaction(
        Number(req.params.encounterId),
        req.body.characterId,
      );

      res.status(200).json({ message: 'Successfully finished reaction' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  passAllReactions: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      await encounterServices.passAllReactions(Number(req.params.encounterId));

      res.status(200).json({ message: 'Successfully passed all reactions' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  confirmActionQueueResults: async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.encounter) {
        throw new Error('Could not find authenticated user');
      }

      await encounterServices.confirmActionQueueResults(
        req.encounter,
        req.body,
      );

      await encounterServices.advancePhase(Number(req.params.encounterId));

      res
        .status(200)
        .json({ message: 'Successfully confirmed action queue results' });
    } catch (error: any) {
      handleControllerError(res, error);
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

      const validatedEncounter = EncounterInput.parse(req.body);

      const encounter = await encounterServices.createOrUpdateEncounter(
        Number(req.params.campaignId),
        Number(req.params.mapId),
        validatedEncounter,
      );

      res
        .status(200)
        .json({ encounter, message: 'Successfully created encounter' });
    } catch (error: any) {
      handleControllerError(res, error);
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
      handleControllerError(res, error);
    }
  },
};

export default encounterController;
