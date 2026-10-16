import { Request, Response } from 'express';
import characterStatServices from '../services/characterStatServices.js';
import { validation } from '@gated/shared';
import { capitalCase } from 'change-case';
import handleControllerError from './handleControllerError.js';

const characterStatController = {
  editCharacterStat: async (req: Request, res: Response) => {
    try {
      const validatedStats = validation.CharacterStats.parse(req.body);

      const character = await characterStatServices.editCharacterStat(
        Number(req.params.characterId),
        validatedStats,
      );

      const statMessages = Object.entries(validatedStats).map(
        ([stat, value]) => `${capitalCase(stat)} by ${value}`,
      );

      const statsMessage = statMessages.join(', ');

      res.status(200).json({
        character,
        message: `Successfully updated the following stats on ${character.name}: ${statsMessage}`,
      });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  resetCharacterStat: async (req: Request, res: Response) => {
    try {
      const validatedStats = validation.CharacterStats.parse(req.body);

      const character = await characterStatServices.resetCharacterStat(
        Number(req.params.characterId),
        validatedStats,
      );

      const statMessages = Object.entries(validatedStats).map(
        ([stat, _]) => `${capitalCase(stat)}`,
      );

      const statsMessage = statMessages.join(', ');

      res
        .status(200)
        .json({ character, message: `Reset stats: ${statsMessage}` });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  editProfits: async (req: Request, res: Response) => {
    try {
      const character = await characterStatServices.editProfits(
        Number(req.params.characterId),
        Number(req.body.value),
      );

      res.status(200).json({
        character,
        message: `Successfully adjusted the profits of ${character.name} by ${req.body.value}`,
      });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },
};

export default characterStatController;
