import { NextFunction, Request, Response } from 'express';
import prisma from '../config/database.js';

const campaignAuthentication = {
  //Only allows access to the campaign data if the user is a part of the campaign in any way

  filterCampaigns: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'No user found' });
      return;
    }

    const campaignIds = (req.query.ids as string).split(',').map(Number);
    const campaigns = await prisma.campaign.findMany({
      where: { id: { in: campaignIds } },
      include: {
        players: { select: { id: true } },
        pendingPlayers: { select: { id: true } },
      },
    });

    const participatingCampaigns = [] as number[];

    for (const campaign of campaigns) {
      const participantIds = [
        campaign.ownerId,
        ...campaign.players.map((player) => player.id),
        ...campaign.pendingPlayers.map((player) => player.id),
      ];

      if (participantIds.some((id) => id === req.user?.id)) {
        participatingCampaigns.push(campaign.id);
      }
    }

    req.body.campaignIds = participatingCampaigns;

    if (req.body.campaignIds.length === 0) {
      res.status(403).json({
        error:
          'Either you do not belong to the campaign/campaigns you are trying to access or they do not exist',
      });
      return;
    }

    next();
  },
};

export default campaignAuthentication;
