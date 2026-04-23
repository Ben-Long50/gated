import express from 'express';
import authentication from '../middleware/authentication.js';
import factionController from '../controllers/factionController.js';
import campaignAuthentication from '../middleware/campaignAuthentication.js';

const router = express.Router();

router.get(
  '/factions/batch',
  authentication.authenticate,
  factionController.getBatchFactions,
);

router.get(
  '/factions/:factionId',
  authentication.authenticate,
  factionController.getFactionById,
);

router.put(
  '/factions/:factionId/update',
  authentication.authenticate,
  campaignAuthentication.validateGameMaster,
  factionController.updateFaction,
);

router.delete(
  '/factions/:factionId',
  authentication.authenticate,
  campaignAuthentication.validateGameMaster,
  factionController.deleteFaction,
);

export default router;
