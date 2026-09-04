import express from 'express';
import authentication from '../middleware/authentication.js';
import mapController from '../controllers/mapController.js';

const router = express.Router();

router.get(
  '/maps/batch',
  authentication.authenticate,
  mapController.getBatchMaps,
);

router.get(
  '/maps/:mapId',
  authentication.authenticate,
  mapController.getMapById,
);

router.post(
  '/maps',
  authentication.authenticate,
  mapController.createOrUpdateMap,
);

router.delete(
  '/maps/:mapId',
  authentication.authenticate,
  mapController.deleteMap,
);

export default router;
