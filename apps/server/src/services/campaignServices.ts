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
      name: true,
      title: true,
      generatedPicture: { select: { publicId: true } },
      userId: true,
      playerCharacter: true,
    },
    orderBy: { name: 'asc' as const },
  },
  events: {
    include: {
      character: {
        select: {
          name: true,
          generatedPicture: { select: { publicId: true } },
        },
      },
    },
  },
  affiliations: { select: { id: true } },
  owner: true,
  maps: { select: { id: true } },
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
    const campaigns = await prisma.campaign.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { players: { some: { id: userId } } },
          { pendingPlayers: { some: { id: userId } } },
        ],
      },
      include: {
        players: { orderBy: { username: 'desc' } },
        pendingPlayers: { orderBy: { username: 'desc' } },
        owner: true,
      },
      orderBy: { name: 'asc' },
    });

    return campaigns;
  },

  getBatchCampaigns: async (campaignIds: number[]) => {
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
  },

  getCampaignById: async (campaignId: number) => {
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
  },

  toggleCampaign: async (campaignId: number) => {
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
  },

  createOrUpdateCampaign: async (formData: CampaignInput, ownerId: number) => {
    const {
      id,
      playerIds,
      pendingPlayerIds,
      generatedPictureId,
      factions,
      briefing,
      affiliation,
      ...data
    } = formData;

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
              generatedPictureId,
            },
          },
          date: { month: 'arctus', day: 1 },
          time: { hour: 0, minute: 0, second: 0 },
          factions: { createMany: { data: factions } },
          pendingPlayers: {
            connect: pendingPlayerIds.map((id) => ({ id })),
          },
          generatedPictureId,
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
  },

  getCampaignMaps: async (campaignId: number) => {
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
          orderBy: { character: { name: 'asc' } },
        },
        encounters: true,
      },
      orderBy: { name: 'asc' },
    });

    return maps;
  },

  getCampaignMap: async (mapId: number) => {
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
          orderBy: { character: { name: 'asc' } },
        },
        encounters: { select: { active: true } },
      },
    });

    return map;
  },

  getBatchLocations: async (locationIds: number[]) => {
    const location = await prisma.location.findMany({
      where: { id: { in: locationIds } },
      include: {
        character: {
          select: {
            name: true,
            title: true,
            id: true,
            userId: true,
            campaignId: true,
            generatedPicture: { select: { publicId: true } },
          },
        },
      },
    });

    return location;
  },

  createOrUpdateEvent: async (campaignId: number, formData: EventInput) => {
    const { id, characterId, ...data } = formData;

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
  },

  setCampaignDate: async (campaignId: number, formData: Date) => {
    const campaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        date: formData,
      },
      include: campaignInclude,
    });

    return campaign;
  },

  setCampaignTime: async (campaignId: number, formData: Time) => {
    const campaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        time: formData,
      },
      include: campaignInclude,
    });

    return campaign;
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
  },

  joinCampaign: async (campaignId: number, userId: number) => {
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
  },

  rejectCampaign: async (campaignId: number, userId: number) => {
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
  },

  deleteCampaign: async (campaignId: number, userId: number) => {
    await prisma.campaign.delete({
      where: {
        id: campaignId,
        ownerId: userId,
      },
    });
  },
};

export default campaignServices;
