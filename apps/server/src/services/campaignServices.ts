import { $Enums, User } from '@prisma/client';
import prisma from '../config/database.js';
import calendar from '../utils/calendar.js';
import { JsonObject } from '@prisma/client/runtime/library.js';

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
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch owner campaigns');
    }
  },

  getBatchCampaigns: async (campaignIds: number[]) => {
    try {
      const campaigns = await prisma.campaign.findMany({
        where: { id: { in: campaignIds } },
        include: {
          sessions: true,
          players: { orderBy: { firstName: 'desc' } },
          pendingPlayers: { orderBy: { firstName: 'desc' } },
          factions: { select: { id: true, name: true, factionType: true } },
          characters: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              picture: true,
            },
            orderBy: { firstName: 'asc' },
          },
          events: {
            include: {
              character: { select: { firstName: true, picture: true } },
            },
          },
          affiliations: { select: { id: true } },
          owner: true,
          encounters: {
            select: {
              id: true,
              map: { select: { name: true, picture: true } },
              mapId: true,
              combatPhase: true,
            },
          },
        },
      });

      if (campaigns.length === 0) {
        throw new Error('You are not a part of any campaigns');
      }

      const eventCalendar = structuredClone(calendar);

      campaigns.forEach((campaign) => {
        if (eventCalendar && campaign?.events.length > 0) {
          campaign.events.forEach((event) => {
            const monthEntry = eventCalendar[event.month];

            if (!monthEntry) return;

            const dayIndex = event.day - 1;

            if (Array.isArray(monthEntry.schedule[dayIndex])) {
              monthEntry.schedule[dayIndex].push(event);
            } else {
              monthEntry.schedule[dayIndex] = [event];
            }
          });
        }
      });

      const modifiedCampaigns = campaigns.map((campaign) => ({
        ...campaign,
        calendar: eventCalendar,
      }));

      return modifiedCampaigns;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch characters');
    }
  },

  getCampaignById: async (campaignId: number) => {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: {
          sessions: true,
          players: { orderBy: { firstName: 'desc' } },
          pendingPlayers: { orderBy: { firstName: 'desc' } },
          factions: { select: { id: true, name: true, factionType: true } },
          characters: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              picture: true,
            },
          },
          events: {
            include: {
              character: { select: { firstName: true, picture: true } },
            },
          },
          affiliations: { select: { id: true } },
          owner: true,
        },
      });

      if (!campaign) {
        throw new Error('Failed to find campaign');
      }

      const eventCalendar = structuredClone(calendar);

      if (eventCalendar && campaign?.events.length > 0) {
        campaign.events.forEach((event) => {
          const monthEntry = eventCalendar[event.month];

          if (!monthEntry) return;

          const dayIndex = event.day - 1;

          if (Array.isArray(monthEntry.schedule[dayIndex])) {
            monthEntry.schedule[dayIndex].push(event);
          } else {
            monthEntry.schedule[dayIndex] = [event];
          }
        });
      }

      const modifiedCampaign = { ...campaign, calendar: eventCalendar };

      return modifiedCampaign;
    } catch (error) {
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
      });

      return {
        id: campaign.id,
        active: updatedCampaign.active,
        players: campaign.players,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to toggle campaign active');
    }
  },

  createOrUpdateCampaign: async (
    formData: {
      id?: number;
      name: string;
      location: string;
      picture: { imageUrl: string; publicId: string };
      ownerId: number;
      affiliation: number;
      factions: { factionType: $Enums.FactionType; name: string }[];
      players: User[];
      pendingPlayers: User[];
    },
    ownerId: number,
  ) => {
    let currentPending = [] as User[];

    if (formData.id) {
      const campaign = await prisma.campaign.findUnique({
        where: { id: formData.id },
        select: { ownerId: true, players: true, pendingPlayers: true },
      });

      if (campaign?.ownerId !== ownerId) {
        throw new Error('Only the owner of the campaign can update it');
      }

      currentPending = campaign.pendingPlayers || [];
    }

    const newPending = formData.pendingPlayers.filter(
      (player) => !currentPending.some((user) => user.id === player.id),
    );

    try {
      const campaign = await prisma.campaign.upsert({
        where: { id: formData?.id || 0 },
        update: {
          name: formData.name,
          location: formData.location,
          picture: formData.picture,
          ownerId,
          players: {
            set: formData.players.map((user) => ({ id: user.id })),
          },
          pendingPlayers: {
            set: formData.pendingPlayers.map((user) => ({ id: user.id })),
          },
        },
        create: {
          name: formData.name,
          date: { month: 'arctus', day: 1 },
          time: { hour: 0, minute: 0, second: 0 },
          location: formData.location,
          picture: formData.picture,
          ownerId,
          pendingPlayers: {
            connect: formData.pendingPlayers.map((user) => ({ id: user.id })),
          },
        },
      });

      if (!formData.id) {
        const createdFactions = await Promise.all(
          formData.factions.map((faction) =>
            prisma.faction.create({
              data: {
                ...faction,
                campaignId: campaign.id,
              },
            }),
          ),
        );

        if (createdFactions.length >= 2) {
          const [faction1, faction2] = createdFactions;

          await prisma.affiliation.create({
            data: {
              campaignId: campaign.id,
              factions: { connect: [{ id: faction1.id }, { id: faction2.id }] },
              value: formData.affiliation,
            },
          });
        }
      }

      return { campaign, newPending };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create or update campaign');
    }
  },

  getCharacterNotes: async (characterId: number) => {
    try {
      const notes = await prisma.note.findMany({
        where: { characterId },
        include: {
          character: {
            select: {
              userId: true,
              firstName: true,
              lastName: true,
              picture: true,
            },
          },
          session: {
            select: { sessionNumber: true, createdAt: true, name: true },
          },
        },
        orderBy: { session: { sessionNumber: 'asc' } },
      });

      return notes;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch notes');
    }
  },

  getCampaignMaps: async (campaignId: number) => {
    try {
      const notes = await prisma.map.findMany({
        where: { campaignId },
        include: {
          user: {
            select: {
              username: true,
            },
          },
          encounters: true,
        },
        orderBy: { name: 'asc' },
      });

      return notes;
    } catch (error) {
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
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch map');
    }
  },

  getLocationById: async (locationId: number) => {
    try {
      const location = await prisma.location.findUnique({
        where: { id: locationId },
        include: {
          character: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
              userId: true,
              campaignId: true,
              picture: true,
            },
          },
        },
      });

      return location;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch locations');
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
              picture: true,
            },
          },
        },
      });

      return location;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch locations');
    }
  },

  createOrUpdateEvent: async (
    campaignId: number,
    formData: {
      id: number;
      name: string;
      characterId: number;
      month: $Enums.Month;
      day: number;
      description: string;
    },
  ) => {
    const { id, characterId, ...data } = formData;

    try {
      const event = await prisma.event.upsert({
        where: { id: id || 0, characterId },
        update: { ...data },
        create: {
          ...data,
          campaign: { connect: { id: campaignId } },
          character: { connect: { id: characterId } },
        },
      });

      return event;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create or update event');
    }
  },

  createOrUpdateCampaignMap: async (
    campaignId: number,
    userId: number,
    formData: {
      id?: number;
      type: $Enums.MapType;
      draft: boolean;
      name: string;
      description: string;
      width: number;
      height: number;
      baseColor: string;
      layerCount: number;
      layers: JsonObject;
    },
  ) => {
    const { id, ...data } = formData;

    try {
      const event = await prisma.map.upsert({
        where: { id: id || 0 },
        update: { ...data },
        create: {
          ...data,
          user: { connect: { id: userId } },
          campaign: { connect: { id: campaignId } },
        },
      });

      return event;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create or update map');
    }
  },

  setCampaignDate: async (
    campaignId: number,
    formData: {
      month: $Enums.Month;
      day: number;
    },
  ) => {
    try {
      const campaign = await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          date: formData,
        },
      });

      return campaign;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch notes');
    }
  },

  setCampaignTime: async (
    campaignId: number,
    formData: {
      hour: number;
      minute: number;
      second: number;
    },
  ) => {
    try {
      const campaign = await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          time: formData,
        },
      });

      return campaign;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to set campaign time');
    }
  },

  joinCampaign: async (campaignId: string, userId: number) => {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: Number(campaignId) },
        select: {
          pendingPlayers: { select: { id: true } },
        },
      });

      const inPending = campaign
        ? campaign.pendingPlayers.some(
            (player: { id: number }) => player.id === userId,
          )
        : [];

      if (!inPending) {
        throw new Error(
          'You cannot join a campaign if you are not a pending player',
        );
      }

      await prisma.campaign.update({
        where: {
          id: Number(campaignId),
        },
        data: {
          pendingPlayers: { disconnect: { id: userId } },
          players: { connect: { id: userId } },
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to join campaign');
    }
  },

  deleteCampaign: async (campaignId: number, userId: number) => {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        select: { ownerId: true },
      });

      if (!campaign) {
        throw new Error('Failed to find campaign');
      }

      if (campaign.ownerId !== userId) {
        throw new Error('Only the owner of the campaign can delete it');
      }

      await prisma.campaign.delete({
        where: {
          id: Number(campaignId),
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message || 'Failed to delete campaign');
    }
  },

  deleteCampaignMap: async (
    campaignId: number,
    mapId: number,
    userId: number,
  ) => {
    try {
      const map = await prisma.map.findUnique({
        where: { id: mapId, campaignId },
        select: { userId: true, campaign: { select: { ownerId: true } } },
      });

      if (!map) {
        throw new Error('Failed to find map');
      }

      if (map.userId !== userId && map.campaign.ownerId !== userId) {
        throw new Error(
          'Only the owner of the map or campaign GM can delete it',
        );
      }

      await prisma.map.delete({
        where: {
          id: mapId,
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message || 'Failed to delete campaign');
    }
  },
};

export default campaignServices;
