import { Request, Response } from 'express';
import actionServices from '../services/actionServices.js';
import { ActionInput } from '../validation/actionSchema.js';
import handleControllerError from './handleControllerError.js';

const actionController = {
  getActions: async (_req: Request, res: Response) => {
    try {
      const actions = await actionServices.getActions();
      res.status(200).json(actions);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getActionById: async (req: Request, res: Response) => {
    try {
      const action = await actionServices.getActionById(
        Number(req.params.actionId),
      );
      res.status(200).json(action);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getBatchActions: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }
      const actionIds = (req.query.ids as string).split(',').map(Number);

      const actions = await actionServices.getBatchActions(actionIds);

      res.status(200).json(actions);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  createOrUpdateAction: async (req: Request, res: Response) => {
    try {
      const data = ActionInput.parse(req.body);

      const action = await actionServices.createOrUpdateAction(data);

      res.status(200).json({ action, message: 'Successfully created action' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  activateAction: async (req: Request, res: Response) => {
    try {
      const action = await actionServices.activateAction(
        Number(req.params.actionId),
        req.body.value,
      );
      res.status(200).json({ action, message: 'Successfully toggled action' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  deleteAction: async (req: Request, res: Response) => {
    try {
      await actionServices.deleteAction(Number(req.params.actionId));
      res.status(200).json({ message: 'Successfully deleted action' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },
};

export default actionController;
