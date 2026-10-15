import { NextFunction, Request, Response } from 'express';
import encounterServices from '../services/encounterServices.js';
import { Prisma } from '@prisma/client';

type EncounterWithCharacters = Prisma.EncounterGetPayload<{
  include: {
    campaign: { select: { ownerId: true } };
    characters: { select: { id: true; userId: true } };
  };
}>;

const encounterMiddleware = {
  getEncounter: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'No user found' });
      return;
    }

    const encounter = await encounterServices.getEncounterById(
      Number(req.params.encounterId),
    );

    req.encounter = encounter;

    next();
  },

  validateEncounterPermissions: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user || !req.encounter) {
      res.status(401).json({ error: 'No user found' });
      return;
    }

    const encounter = req.encounter as EncounterWithCharacters;

    const activeCharacterId = encounter.turnOrder[encounter.turnPosition];

    const activeCharacter = encounter.characters.find(
      (character) => character.id === activeCharacterId,
    );

    if (!activeCharacter) {
      res.status(500).json({ error: 'Failed to find active character' });
      return;
    }

    if (
      req.user.id !== activeCharacter.userId &&
      req.user.id !== encounter.campaign.ownerId
    ) {
      res.status(403).json({
        error:
          'Only the Game Master or active player may perform this function',
      });
    }

    return next();
  },

  validateReactionPermissions: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      res.status(401).json({ error: 'No user found' });
      return;
    }

    const encounter = req.encounter as EncounterWithCharacters;

    const reactiveCharacters = encounter.characters.filter((character) =>
      encounter.reactions.includes(character.id),
    );

    const permissions = reactiveCharacters.some(
      (character) => req.user && req.user.id === character?.userId,
    );

    if (req.user.id !== encounter.campaign.ownerId && !permissions) {
      res.status(500).json({
        error:
          'Only the Game Master or users with characters in a reaction state may roll a reaction',
      });
      return;
    }

    return next();
  },
};

export default encounterMiddleware;
