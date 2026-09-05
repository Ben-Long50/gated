import { Request, Response } from 'express';
import campaignServices from '../services/campaignServices.js';
import { CampaignInput } from '../validation/campaignSchema.js';
import { EventInput } from '../validation/eventSchema.js';
import { Date, Time } from '../validation/fieldSchemas.js';
import { RollInput } from '../validation/rollSchema.js';
import { getIO } from '../sockets/socket.js';
import handleControllerError from './handleControllerError.js';

const campaignController = {
  getCampaigns: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ error: 'You must be signed in to use this function' });
        return;
      }

      const campaigns = await campaignServices.getCampaigns(req.user.id);

      res.status(200).json(campaigns);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getBatchCampaigns: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      const campaignIds = (req.query.ids as string).split(',').map(Number);

      const campaigns = await campaignServices.getBatchCampaigns(campaignIds);

      res.status(200).json(campaigns);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getCampaignById: async (req: Request, res: Response) => {
    try {
      const campaign = await campaignServices.getCampaignById(
        Number(req.params.campaignId),
      );

      res.status(200).json(campaign);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  toggleCampaign: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ error: 'You must be signed in to use this function' });
        return;
      }

      const campaign = await campaignServices.toggleCampaign(
        Number(req.params.campaignId),
      );

      res.status(200).json({
        campaign,
        message: `Campaign status set to ${campaign.active ? 'active' : 'inactive'}`,
      });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  createOrUpdateCampaign: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({
          error:
            'You do not have the required permissions to create a campaign',
        });
        return;
      }

      const validatedCampaign = CampaignInput.parse(req.body);

      const campaign = await campaignServices.createOrUpdateCampaign(
        validatedCampaign,
        req.user.id,
      );

      const io = getIO();

      const players = campaign?.players.map((player) => player.id) || [];

      const pendingPlayers =
        campaign?.pendingPlayers.map((player) => player.id) || [];

      const playerIds = [campaign?.ownerId, ...players, ...pendingPlayers];

      io.emit('globalCampaign', { campaignId: campaign.id, playerIds });

      res.status(200).json({
        campaign,
        message: `Successfully created ${campaign.name}`,
      });
    } catch (error: any) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  },

  getCampaignMaps: async (req: Request, res: Response) => {
    try {
      const maps = await campaignServices.getCampaignMaps(
        Number(req.params.campaignId),
      );
      res.status(200).json(maps);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getBatchLocations: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }
      const locationIds = (req.query.ids as string).split(',').map(Number);

      const locations = await campaignServices.getBatchLocations(locationIds);

      res.status(200).json(locations);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  createOrUpdateEvent: async (req: Request, res: Response) => {
    try {
      const validatedEvent = EventInput.parse(req.body);

      const event = await campaignServices.createOrUpdateEvent(
        Number(req.params.campaignId),
        validatedEvent,
      );

      res
        .status(200)
        .json({ event, message: `Successfully created ${event.name}` });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  setCampaignDate: async (req: Request, res: Response) => {
    try {
      const validatedDate = Date.parse(req.body);

      const campaign = await campaignServices.setCampaignDate(
        Number(req.params.campaignId),
        validatedDate,
      );

      res.status(200).json(campaign);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  setCampaignTime: async (req: Request, res: Response) => {
    try {
      const validatedTime = Time.parse(req.body);

      const campaign = await campaignServices.setCampaignTime(
        Number(req.params.campaignId),
        validatedTime,
      );
      res.status(200).json(campaign);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  campaignRoll: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ error: 'You must be signed in to use this function' });
        return;
      }

      const validatedRoll = RollInput.parse(req.body);

      await campaignServices.campaignRoll(
        req.user.id,
        Number(req.params.campaignId),
        validatedRoll,
      );
      res.status(200).json({ message: 'Successfully rolled' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  joinCampaign: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ error: 'You must be signed in to use this function' });
        return;
      }

      const campaign = await campaignServices.joinCampaign(
        Number(req.params.campaignId),
        req.user.id,
      );

      res
        .status(200)
        .json({ campaign, message: `Successfully joined ${campaign.name}` });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  rejectCampaign: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ error: 'You must be signed in to use this function' });
        return;
      }

      const campaign = await campaignServices.rejectCampaign(
        Number(req.params.campaignId),
        req.user.id,
      );

      res.status(200).json({
        campaign,
        message: `Successfully rejected the invite to ${campaign.name}`,
      });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  deleteCampaign: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ error: 'You must be signed in to use this function' });
        return;
      }

      await campaignServices.deleteCampaign(
        Number(req.params.campaignId),
        req.user.id,
      );
      res.status(200).json({ message: 'Successfully deleted campaign' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },
};

export default campaignController;
