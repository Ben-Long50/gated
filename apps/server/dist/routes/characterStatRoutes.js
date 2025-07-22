import express from 'express';
import authentication from '../middleware/authentication.js';
import characterStatController from '../controllers/characterStatController.js';
const router = express.Router();
router.patch('/characters/:characterId/stats', authentication.authenticate, characterStatController.editCharacterStat);
router.patch('/characters/:characterId/stats/reset', authentication.authenticate, characterStatController.resetCharacterStat);
router.patch('/characters/:characterId/profits', authentication.authenticate, characterStatController.editProfits);
export default router;
