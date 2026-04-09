import express from 'express';
import authentication from '../middleware/authentication.js';
import propertyController from '../controllers/propertyController.js';

const router = express.Router();

router.get(
  '/properties/:',
  authentication.authenticate,
  propertyController.getBatchProperties,
);

router.get(
  '/properties/base',
  authentication.authenticate,
  propertyController.getBaseProperties,
);

router.post(
  '/properties/create',
  authentication.authenticate,
  authentication.authenticateAdmin,
  propertyController.createOrUpdateBaseProperty,
);

router.delete(
  '/properties/:propertyId',
  authentication.authenticate,
  authentication.authenticateAdmin,
  propertyController.deleteProperty,
);

export default router;
