import { Action, Character } from '@prisma/client';
import prisma from '../config/database.js';
import { getIO } from '../sockets/socket.js';
import { calculateRoll } from '../utils/rollUtilities.js';
import constructCalendar from '../utils/constructCalendar.js';
import { CampaignInput } from '../validation/campaignSchema.js';
import { EventInput } from '../validation/eventSchema.js';
import { Attributes, Date, Time } from '../validation/fieldSchemas.js';
import { characterInclude } from './characterServices.js';
import { combineAttributeTrees } from '../utils/combineAttributeTrees.js';

const campaignInclude = {
  sessions: { orderBy: { sessionNumber: 'desc' as const } },
  players: { orderBy: { username: 'asc' as const } },
  pendingPlayers: { orderBy: { username: 'asc' as const } },
  factions: {
    select: {
      id: true,
      name: true,
      factionType: true,
      generatedPicture: { select: { publicId: true } },
    },
  },
  gangs: {
    select: {
      id: true,
      name: true,
      generatedPicture: { select: { publicId: true } },
    },
  },
  characters: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      generatedPicture: { select: { publicId: true } },
      userId: true,
      playerCharacter: true,
    },
    orderBy: { firstName: 'asc' as const },
  },
  events: {
    include: {
      character: {
        select: {
          firstName: true,
          generatedPicture: { select: { publicId: true } },
        },
      },
    },
  },
  affiliations: { select: { id: true } },
  owner: true,
  encounters: {
    select: {
      id: true,
      map: {
        select: {
          name: true,
          generatedPicture: { select: { publicId: true } },
        },
      },
      mapId: true,
      combatPhase: true,
    },
  },
  generatedPicture: { select: { publicId: true } },
};

const campaignServices = {
  getCampaigns: async (userId: number) => {
    try {
      const campaigns = await prisma.campaign.findMany({
        where: {
          OR: [
            { ownerId: userId },
            { players: { some: { id: userId } } },
            { pendingPlayers: { some: { id: userId } } },
          ],
        },
        include: {
          players: { orderBy: { firstName: 'desc' } },
          pendingPlayers: { orderBy: { firstName: 'desc' } },
          owner: true,
        },
        orderBy: { name: 'asc' },
      });

      return campaigns;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch owner campaigns');
    }
  },

  getBatchCampaigns: async (campaignIds: number[]) => {
    try {
      const campaigns = await prisma.campaign.findMany({
        where: { id: { in: campaignIds } },
        include: campaignInclude,
      });

      if (campaigns.length === 0) {
        throw new Error('You are not a part of any campaigns');
      }

      const modifiedCampaigns = campaigns.map((campaign) => {
        const calendar = constructCalendar(campaign);

        return {
          ...campaign,
          calendar,
        };
      });

      return modifiedCampaigns;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch characters');
    }
  },

  getCampaignById: async (campaignId: number) => {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: campaignInclude,
      });

      if (!campaign) {
        throw new Error('Failed to find campaign');
      }

      const calendar = constructCalendar(campaign);

      const modifiedCampaign = { ...campaign, calendar };

      return modifiedCampaign;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch campaign');
    }
  },

  toggleCampaign: async (campaignId: number) => {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: Number(campaignId) },
        select: {
          id: true,
          active: true,
          ownerId: true,
          players: { select: { id: true } },
        },
      });

      if (!campaign) {
        throw new Error('Failed to find campaign');
      }

      const updatedCampaign = await prisma.campaign.update({
        where: { id: campaignId },
        data: { active: !campaign.active },
        include: campaignInclude,
      });

      const calendar = constructCalendar(updatedCampaign);

      const modifiedCampaign = { ...campaign, calendar };

      return modifiedCampaign;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to toggle campaign active');
    }
  },

  createOrUpdateCampaign: async (formData: CampaignInput, ownerId: number) => {
    const {
      id,
      playerIds,
      pendingPlayerIds,
      factions,
      briefing,
      affiliation,
      ...data
    } = formData;

    try {
      const campaign = await prisma.$transaction(async (tx) => {
        const campaign = await tx.campaign.upsert({
          where: { id: id || 0 },
          update: {
            ...data,
            ownerId,
            players: {
              set: playerIds.map((id) => ({ id })),
            },
            pendingPlayers: {
              set: pendingPlayerIds.map((id) => ({ id })),
            },
          },
          create: {
            ...data,
            ownerId,
            sessions: {
              create: {
                name: 'Introduction',
                sessionNumber: 0,
                briefing,
                picture: {
                  imageUrl: '',
                  publicId: '',
                  position: { x: 50, y: 50 },
                },
              },
            },
            date: { month: 'arctus', day: 1 },
            time: { hour: 0, minute: 0, second: 0 },
            factions: { createMany: { data: factions } },
            pendingPlayers: {
              connect: pendingPlayerIds.map((id) => ({ id })),
            },
          },
          include: campaignInclude,
        });

        await tx.affiliation.create({
          data: {
            campaignId: campaign.id,
            factions: {
              connect: campaign.factions.map((faction) => ({ id: faction.id })),
            },
            value: affiliation,
          },
        });

        return campaign;
      });

      return campaign;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create or update campaign');
    }
  },

  getCampaignMaps: async (campaignId: number) => {
    try {
      const maps = await prisma.map.findMany({
        where: { campaignId },
        include: {
          user: {
            select: {
              username: true,
            },
          },
          locations: {
            select: {
              id: true,
            },
            orderBy: { character: { firstName: 'asc' } },
          },
          encounters: true,
        },
        orderBy: { name: 'asc' },
      });

      return maps;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch campaign maps');
    }
  },

  getCampaignMap: async (mapId: number) => {
    try {
      const map = await prisma.map.findUnique({
        where: { id: mapId },
        include: {
          user: {
            select: {
              username: true,
            },
          },
          locations: {
            select: {
              id: true,
            },
            orderBy: { character: { firstName: 'asc' } },
          },
          encounters: { select: { active: true } },
        },
      });

      return map;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch map');
    }
  },

  getBatchLocations: async (locationIds: number[]) => {
    try {
      const location = await prisma.location.findMany({
        where: { id: { in: locationIds } },
        include: {
          character: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
              userId: true,
              campaignId: true,
              generatedPicture: { select: { publicId: true } },
            },
          },
        },
      });

      return location;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch locations');
    }
  },

  createOrUpdateEvent: async (campaignId: number, formData: EventInput) => {
    const { id, characterId, ...data } = formData;

    try {
      const event = await prisma.event.upsert({
        where: { id: id || 0 },
        update: data,
        create: {
          ...data,
          campaignId,
          characterId,
        },
      });

      return event;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create or update event');
    }
  },

  setCampaignDate: async (campaignId: number, formData: Date) => {
    try {
      const campaign = await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          date: formData,
        },
        include: campaignInclude,
      });

      return campaign;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch notes');
    }
  },

  setCampaignTime: async (campaignId: number, formData: Time) => {
    try {
      const campaign = await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          time: formData,
        },
        include: campaignInclude,
      });

      return campaign;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to set campaign time');
    }
  },

  campaignRoll: async (
    userId: number,
    campaignId: number,
    rollData: {
      characterId: number;
      actionId: number;
      modifiers: string[];
      extraDice: number;
    },
  ) => {
    try {
      const io = getIO();

      const [character, action] = await prisma.$transaction([
        prisma.character.findUnique({
          where: { id: rollData.characterId },
          include: characterInclude,
        }),

        prisma.action.findUnique({
          where: { id: rollData.actionId },
        }),
      ]);

      if (!character || !action) {
        throw new Error(
          'Failed to find character or action associated with this roll',
        );
      }

      const levelAttributes = character.characterLevelBonuses
        .filter((bonus) => Boolean(bonus.attributes))
        .map((bonus) => Attributes.parse(bonus.attributes));

      const attributes = combineAttributeTrees(levelAttributes);

      const rollResults = calculateRoll(
        attributes,
        { name: action.name, roll: action.roll },
        rollData.modifiers,
        rollData.extraDice,
      ) || { result: [], successes: 0, roll: null };

      const rolls = new Map();

      if (rollResults) {
        rolls.set(userId, {
          character,
          action,
          roll: rollResults.roll,
          diceArray: rollResults.result,
          successes: rollResults.successes,
          modifiers: rollData.modifiers,
        });
      }

      const rollsArray = rollResults ? Array.from(rolls.entries()) : null;

      const historyData = {
        character,
        action,
      } as {
        character: any;
        action: Action;
        rollResult: {
          result: number[];
          successes: number;
          modifiers: string[];
        };
      };

      io.to(`campaign ${campaignId}`).emit('campaignRoll', {
        rollsArray,
        character,
        action,
      });

      await campaignServices.createCampaignHistory(campaignId, historyData);
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to roll action');
    }
  },

  createCampaignHistory: async (
    campaignId: number,
    formData: {
      character: Character;
      action: Action;
      rollResult: {
        result: number[];
        successes: number;
        modifiers: string[];
      };
    },
  ) => {
    try {
      const data = {
        campaignId,
        characterSnapshot: formData.character,
        characterId: formData.character.id,
        actionSnapshot: formData.action,
        actionId: formData.action.id,
        rollResult: formData.rollResult,
      };

      const history = await prisma.history.create({
        data,
      });

      return history;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create encounter history entry');
    }
  },

  joinCampaign: async (campaignId: number, userId: number) => {
    try {
      const campaign = await prisma.campaign.update({
        where: {
          id: campaignId,
        },
        data: {
          pendingPlayers: { disconnect: { id: userId } },
          players: { connect: { id: userId } },
        },
        include: campaignInclude,
      });

      return campaign;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to join campaign');
    }
  },

  rejectCampaign: async (campaignId: number, userId: number) => {
    try {
      const campaign = await prisma.campaign.update({
        where: {
          id: campaignId,
        },
        data: {
          pendingPlayers: { disconnect: { id: userId } },
        },
        include: campaignInclude,
      });

      return campaign;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to join campaign');
    }
  },

  deleteCampaign: async (campaignId: number, userId: number) => {
    try {
      await prisma.campaign.delete({
        where: {
          id: campaignId,
          ownerId: userId,
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to delete campaign');
    }
  },
};

export default campaignServices;
