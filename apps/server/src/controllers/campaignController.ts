import { Request, Response } from 'express';
import campaignServices from '../services/campaignServices.js';
import sessionServices from '../services/sessionServices.js';
import { User } from '@prisma/client';
import upload from '../utils/multer.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import notificationServices from '../services/notificationServices.js';
import parseRequestBody from '../utils/parseRequestBody.js';

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
      res.status(500).json({ error: error.message });
    }
  },

  getCampaignById: async (req: Request, res: Response) => {
    try {
      const campaign = await campaignServices.getCampaignById(
        req.params.campaignId,
      );
      res.status(200).json(campaign);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  createCampaign: [
    upload.single('picture'),
    uploadToCloudinary,
    async (req: Request, res: Response) => {
      try {
        if (!req.user) {
          res.status(401).json({
            error:
              'You do not have the required permissions to create a campaign',
          });
          return;
        }

        const parsedBody = parseRequestBody(req.body);

        const campaignInfo = await campaignServices.createOrUpdateCampaign(
          parsedBody,
          req.user.id,
        );

        const sessionInfo = {
          name: 'Introduction',
          sessionNumber: 0,
          briefing: parsedBody.briefing,
        };

        if (!parsedBody.id) {
          await sessionServices.createOrUpdateSession(
            sessionInfo,
            campaignInfo.campaign.id,
          );
        }

        if (campaignInfo.newPending.length > 0) {
          await notificationServices.createNotification(
            'campaignInvite',
            campaignInfo.newPending.map((player: User) => player.id),
            req.user.id,
          );
        }

        res
          .status(200)
          .json({ message: 'Successfully created campaign and session 0' });
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        }
      }
    },
  ],

  getCharacterNotes: async (req: Request, res: Response) => {
    try {
      const notes = await campaignServices.getCharacterNotes(
        Number(req.params.characterId),
      );
      res.status(200).json(notes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  getCampaignMaps: async (req: Request, res: Response) => {
    try {
      const maps = await campaignServices.getCampaignMaps(
        Number(req.params.campaignId),
      );
      res.status(200).json(maps);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  getCampaignMap: async (req: Request, res: Response) => {
    try {
      const map = await campaignServices.getCampaignMap(
        Number(req.params.campaignId),
        Number(req.params.mapId),
      );
      res.status(200).json(map);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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
      res.status(500).json({ error: error.message });
    }
  },

  createOrUpdateEvent: async (req: Request, res: Response) => {
    try {
      const event = await campaignServices.createOrUpdateEvent(
        Number(req.params.campaignId),
        req.body,
      );
      res.status(200).json(event);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  setCampaignDate: async (req: Request, res: Response) => {
    try {
      const campaign = await campaignServices.setCampaignDate(
        Number(req.params.campaignId),
        req.body,
      );
      res.status(200).json(campaign);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  setCampaignTime: async (req: Request, res: Response) => {
    try {
      const campaign = await campaignServices.setCampaignTime(
        Number(req.params.campaignId),
        req.body,
      );
      res.status(200).json(campaign);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  createOrUpdateCampaignMap: [
    upload.single('picture'),
    uploadToCloudinary,
    async (req: Request, res: Response) => {
      try {
        if (!req.user) {
          throw new Error('You must be logged in to create or update a map');
        }

        const parsedBody = parseRequestBody(req.body);

        const map = await campaignServices.createOrUpdateCampaignMap(
          Number(req.params.campaignId),
          req.user?.id,
          parsedBody,
        );

        res.status(200).json(map);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    },
  ],

  joinCampaign: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ error: 'You must be signed in to use this function' });
        return;
      }

      await campaignServices.joinCampaign(req.params.campaignId, req.user.id);
      res.status(200).json({ message: 'Successfully joined the campaign' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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
      res.status(500).json({ error: error.message });
    }
  },

  deleteCampaignMap: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ error: 'You must be signed in to use this function' });
        return;
      }

      await campaignServices.deleteCampaignMap(
        Number(req.params.campaignId),
        Number(req.params.mapId),
        req.user.id,
      );
      res.status(200).json({ message: 'Successfully deleted map' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default campaignController;
