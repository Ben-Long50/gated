import express from 'express';
import authentication from '../middleware/authentication.js';
import combatController from '../controllers/combatController.js';
const router = express.Router();
router.get('/combats/:combatId', authentication.authenticate, combatController.getCombatById);
router.post('/campaigns/:campaignId/maps/:mapId/combats', authentication.authenticate, combatController.createOrUpdateCombat);
export default router;
