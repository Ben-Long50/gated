import { Request, Response } from 'express';
import sessionServices from '../services/sessionServices.js';
import { validation } from '@gated/shared';
import handleControllerError from './handleControllerError.js';

const sessionController = {
  getCampaignSessions: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ error: 'You must be signed in to use this function' });
        return;
      }

      const sessions = await sessionServices.getCampaignSessions(
        Number(req.params.campaignId),
      );

      res.status(200).json(sessions);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getSessionById: async (req: Request, res: Response) => {
    try {
      const session = await sessionServices.getSessionById(
        Number(req.params.campaignId),
        Number(req.params.sessionId),
      );

      res.status(200).json(session);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  createOrUpdateSessionNotes: async (req: Request, res: Response) => {
    try {
      const validatedNotes = validation.NotesInput.parse(req.body);

      const notes =
        await sessionServices.createOrUpdateSessionNotes(validatedNotes);

      res.status(200).json({
        notes,
        message: validatedNotes.id
          ? 'Successfully updated session notes'
          : 'Successfully created session notes',
      });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  createOrUpdateSession: async (req: Request, res: Response) => {
    try {
      const validatedSession = validation.SessionInput.parse(req.body);

      const session =
        await sessionServices.createOrUpdateSession(validatedSession);

      res.status(200).json({
        session,
        message: validatedSession.id
          ? `Successfully updated session: ${session.name}`
          : `Successfully created session: ${session.name}`,
      });
    } catch (error: any) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  },

  deleteSession: async (req: Request, res: Response) => {
    try {
      await sessionServices.deleteSession(Number(req.params.campaignId));
      res.status(200).json({ message: 'Successfully deleted session' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },
};

export default sessionController;
