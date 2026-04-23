import express from 'express';
import authentication from '../middleware/authentication';
import affiliationController from '../controllers/affiliationController';
const router = express.Router();
router.get('/affiliations/batch', authentication.authenticate, affiliationController.getBatchAffiliations);
router.get('/affiliations/:affiliationId', authentication.authenticate, affiliationController.getAffiliationById);
router.post('/affiliations', authentication.authenticate, affiliationController.createAffiliation);
router.patch('/affiliations/:affiliationId/value', authentication.authenticate, affiliationController.updateAffiliationValue);
router.delete('/affiliations/:affiliationId', authentication.authenticate, affiliationController.deleteAffiliation);
