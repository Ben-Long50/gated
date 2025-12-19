import express from 'express';
import authentication from '../middleware/authentication.js';
import encounterController from '../controllers/encounterController.js';
import campaignAuthentication from '../middleware/campaignAuthentication.js';
import encounterMiddleware from '../middleware/encounterMiddleware.js';

const router = express.Router();

router.get(
  '/encounters/batch',
  authentication.authenticate,
  encounterController.getBatchEncounters,
);

router.get(
  '/encounters/:encounterId',
  authentication.authenticate,
  encounterController.getEncounterById,
);

router.get(
  '/encounters/:encounterId/history',
  authentication.authenticate,
  encounterController.getEncounterHistory,
);

router.post(
  '/campaigns/:campaignId/maps/:mapId/encounters/create',
  authentication.authenticate,
  encounterController.createOrUpdateEncounter,
);

router.patch(
  '/campaigns/:campaignId/encounters/:encounterId/activate',
  authentication.authenticate,
  campaignAuthentication.validateGameMaster,
  encounterController.activateEncounter,
);

router.patch(
  '/campaigns/:campaignId/encounters/:encounterId/advancePhase',
  authentication.authenticate,
  encounterMiddleware.getEncounter,
  encounterMiddleware.validateEncounterPermissions,
  encounterController.advancePhase,
);

router.patch(
  '/campaigns/:campaignId/encounters/:encounterId/advanceTurn',
  authentication.authenticate,
  encounterMiddleware.getEncounter,
  encounterMiddleware.validateEncounterPermissions,
  encounterController.advanceTurn,
);

router.patch(
  '/campaigns/:campaignId/encounters/:encounterId/rollInitiative',
  authentication.authenticate,
  campaignAuthentication.validateGameMaster,
  encounterController.rollInitiative,
);

router.patch(
  '/campaigns/:campaignId/encounters/:encounterId/rollAction',
  authentication.authenticate,
  encounterMiddleware.getEncounter,
  encounterMiddleware.validateEncounterPermissions,
  encounterController.rollAction,
);

router.patch(
  '/campaigns/:campaignId/encounters/:encounterId/rollReaction',
  authentication.authenticate,
  encounterMiddleware.getEncounter,
  encounterMiddleware.validateReactionPermissions,
  encounterController.rollReaction,
);

router.patch(
  '/campaigns/:campaignId/encounters/:encounterId/scheduleReaction',
  authentication.authenticate,
  encounterController.scheduleReaction,
);

router.patch(
  '/campaigns/:campaignId/encounters/:encounterId/passReaction',
  authentication.authenticate,
  encounterController.passReaction,
);

router.patch(
  '/campaigns/:campaignId/encounters/:encounterId/finishReaction',
  authentication.authenticate,
  encounterController.finishReaction,
);

router.patch(
  '/campaigns/:campaignId/encounters/:encounterId/passAllReactions',
  authentication.authenticate,
  campaignAuthentication.validateGameMaster,
  encounterController.passAllReactions,
);

router.patch(
  '/campaigns/:campaignId/encounters/:encounterId/confirmActionQueue',
  authentication.authenticate,
  encounterMiddleware.getEncounter,
  encounterMiddleware.validateEncounterPermissions,
  encounterController.confirmActionQueueResults,
);

export default router;
