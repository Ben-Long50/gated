import { Request, Response } from 'express';
import conditionServices from '../services/conditionServices.js';
import { validation } from '@gated/shared';
import handleControllerError from './handleControllerError.js';

const conditionController = {
  getConditions: async (_req: Request, res: Response) => {
    try {
      const conditions = await conditionServices.getConditions();
      res.status(200).json(conditions);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getConditionById: async (req: Request, res: Response) => {
    try {
      const condition = await conditionServices.getConditionById(
        Number(req.params.conditionId),
      );
      res.status(200).json(condition);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  createCondition: async (req: Request, res: Response) => {
    try {
      const validatedCondition = validation.ConditionInput.parse(req.body);

      const condition =
        await conditionServices.createCondition(validatedCondition);

      res
        .status(200)
        .json({ condition, message: `Successfully created ${condition.name}` });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  updateConditionStacks: async (req: Request, res: Response) => {
    try {
      let condition = '';

      if (req.params.characterId) {
        condition = await conditionServices.updateCharacterConditionStacks(
          Number(req.params.conditionId),
          req.body.value,
        );
      }

      if (req.params.itemId) {
        condition = await conditionServices.updateItemConditionStacks(
          Number(req.params.conditionId),
          req.body.value,
        );
      }

      res
        .status(200)
        .json({ message: `Successfully updated ${condition} stacks` });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  deleteCondition: async (req: Request, res: Response) => {
    try {
      await conditionServices.deleteCondition(Number(req.params.conditionId));
      res.status(200).json({ message: 'Successfully deleted condition' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  deleteCharacterCondition: async (req: Request, res: Response) => {
    try {
      await conditionServices.deleteCharacterCondition(
        Number(req.params.conditionId),
      );
      res
        .status(200)
        .json({ message: 'Successfully deleted character condition' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  deleteItemCondition: async (req: Request, res: Response) => {
    try {
      await conditionServices.deleteItemCondition(
        Number(req.params.conditionId),
      );
      res.status(200).json({ message: 'Successfully deleted item condition' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },
};

export default conditionController;
