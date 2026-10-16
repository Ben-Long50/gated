import { Request, Response } from 'express';
import gangServices from '../services/gangServices.js';
import { validation } from '@gated/shared';
import z from 'zod';
import handleControllerError from './handleControllerError.js';
import { getIO } from '../sockets/socket.js';

const gangController = {
  getBatchGangs: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }
      const gangIds = (req.query.ids as string).split(',').map(Number);

      const gangs = await gangServices.getBatchGangs(gangIds);

      res.status(200).json(gangs);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getGangById: async (req: Request, res: Response) => {
    try {
      const gang = await gangServices.getGangById(Number(req.params.gangId));
      res.status(200).json(gang);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  createGang: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'You do not have the required permissions to create a gang',
        });
        return;
      }

      const validatedGang = validation.GangInput.parse(req.body);

      const gang = await gangServices.createOrUpdateGang(validatedGang);

      res
        .status(200)
        .json({ gang, message: `Successfully created ${gang.name}` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  updateGangCharacters: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({
          error:
            'You do not have the required permissions to update gang characters',
        });
        return;
      }

      const validatedCharacters = z
        .object({
          characterIds: z.array(z.number().int().nonnegative()),
          leaderIds: z.array(z.number().int().nonnegative()),
        })
        .parse(req.body);

      const gang = await gangServices.updateGangCharacters(
        Number(req.params.gangId),
        validatedCharacters,
      );

      const io = getIO();

      io.to(`campaign ${gang.campaignId}`).emit('updateGang', { gang });

      res.status(200).json({
        gang,
        message: `Successfully updated ${gang.name} characters`,
      });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  allocateReputation: async (req: Request, res: Response) => {
    try {
      const validatedGangSessionBonus = validation.GangSessionBonusInput.parse(
        req.body.bonus,
      );

      const gang = await gangServices.allocateReputation(
        Number(req.params.gangId),
        req.body.sessionId,
        validatedGangSessionBonus,
      );

      const io = getIO();

      io.to(`campaign ${gang.campaignId}`).emit('updateGang', { gang });

      res
        .status(200)
        .json({ gang, messagee: 'Successfully updated gang reputation' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  allocateLevelNodes: async (req: Request, res: Response) => {
    try {
      const validatedLevelNodeBonus = validation.GangSessionBonusInput.parse(
        req.body.bonus,
      );

      const gang = await gangServices.allocateLevelNodes(
        Number(req.params.gangId),
        req.body.sessionId,
        validatedLevelNodeBonus,
      );

      const io = getIO();

      io.to(`campaign ${gang.campaignId}`).emit('updateGang', { gang });

      res
        .status(200)
        .json({ gang, messagee: 'Successfully updated gang reputation' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  editGangProfits: async (req: Request, res: Response) => {
    try {
      const gang = await gangServices.editGangProfits(
        Number(req.params.gangId),
        Number(req.body.value),
      );

      const io = getIO();

      io.to(`campaign ${gang.campaignId}`).emit('updateGang', { gang });

      res.status(200).json({
        gang,
        message: `Changed current gang profits by ${req.body.value}`,
      });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  distributeProfits: async (req: Request, res: Response) => {
    try {
      const { gang, characters } = await gangServices.distributeProfits(
        Number(req.params.gangId),
        req.body,
      );

      const io = getIO();

      io.to(`campaign ${gang.campaignId}`).emit('updateGang', { gang });

      for (const character of characters) {
        io.to(`campaign ${character.campaignId}`).emit('updateCharacter', {
          character,
        });
      }

      res.status(200).json({
        gang,
        characters,
        message: `Successfully distributed profits`,
      });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  deleteGang: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ error: 'You must be signed in to use this function' });
        return;
      }

      await gangServices.deleteGang(Number(req.params.gangId));
      res.status(200).json({ message: 'Successfully deleted gang' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },
};

export default gangController;
