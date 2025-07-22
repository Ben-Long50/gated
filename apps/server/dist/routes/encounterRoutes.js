import express from 'express';
import authentication from '../middleware/authentication.js';
import encounterController from '../controllers/encounterController.js';
const router = express.Router();
router.get('/encounters/batch', authentication.authenticate, encounterController.getBatchEncounters);
router.get('/encounters/:encounterId', authentication.authenticate, encounterController.getEncounterById);
router.post('/campaigns/:campaignId/maps/:mapId/encounters/create', authentication.authenticate, encounterController.createOrUpdateEncounter);
router.patch('/encounters/:encounterId/advanceTurn', authentication.authenticate, encounterController.advanceTurn);
export default router;
