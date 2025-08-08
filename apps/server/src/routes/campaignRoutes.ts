import express from 'express';
import authentication from '../middleware/authentication.js';
import campaignController from '../controllers/campaignController.js';
import factionController from '../controllers/factionController.js';
import affiliationController from '../controllers/affiliationController.js';
import campaignAuthentication from '../middleware/campaignAuthentication.js';

const router = express.Router();

router.patch(
  '/campaigns/:campaignId/players',
  authentication.authenticate,
  campaignController.joinCampaign,
);

router.get(
  '/campaigns',
  authentication.authenticate,
  campaignController.getCampaigns,
);

router.get(
  '/campaigns/batch',
  authentication.authenticate,
  campaignAuthentication.filterCampaigns,
  campaignController.getBatchCampaigns,
);

router.get(
  '/campaigns/:campaignId',
  authentication.authenticate,
  campaignAuthentication.filterCampaigns,
  campaignController.getCampaignById,
);

router.get(
  '/campaigns/:campaignId/maps',
  authentication.authenticate,
  campaignController.getCampaignMaps,
);

router.get(
  '/locations/:locationId',
  authentication.authenticate,
  campaignController.getBatchLocations,
);

router.get(
  '/maps/:mapId',
  authentication.authenticate,
  campaignController.getCampaignMap,
);

router.get(
  '/campaigns/:campaignId/characters/:characterId/notes',
  authentication.authenticate,
  campaignController.getCharacterNotes,
);

router.get(
  '/factions/:factionId',
  authentication.authenticate,
  factionController.getFactionById,
);

router.post(
  '/factions/:factionId/affiliations/create',
  authentication.authenticate,
  affiliationController.createFactionAffiliation,
);

router.post(
  '/campaigns',
  authentication.authenticate,
  campaignController.createCampaign,
);

router.post(
  '/campaigns/:campaignId/events',
  authentication.authenticate,
  campaignController.createOrUpdateEvent,
);

router.post(
  '/campaigns/:campaignId/maps',
  authentication.authenticate,
  campaignController.createOrUpdateCampaignMap,
);

router.patch(
  '/campaigns/:campaignId/active',
  authentication.authenticate,
  campaignController.toggleCampaign,
);

router.patch(
  '/campaigns/:campaignId/date',
  authentication.authenticate,
  campaignController.setCampaignDate,
);

router.patch(
  '/campaigns/:campaignId/time',
  authentication.authenticate,
  campaignController.setCampaignTime,
);

router.put(
  '/campaigns/:campaignId/factions/:factionId',
  authentication.authenticate,
  factionController.updateFaction,
);

router.delete(
  '/campaigns/:campaignId',
  authentication.authenticate,
  campaignController.deleteCampaign,
);

router.delete(
  '/campaigns/:campaignId/maps/:mapId',
  authentication.authenticate,
  campaignController.deleteCampaignMap,
);

export default router;
