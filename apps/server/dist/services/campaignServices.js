var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import prisma from '../config/database.js';
import { getIO } from '../sockets/socket.js';
import { calculateRoll } from '../utils/rollUtilities.js';
import constructCalendar from '../utils/constructCalendar.js';
import { Attributes } from '../validation/fieldSchemas.js';
import { characterInclude } from './characterServices.js';
import { combineAttributeTrees } from '../utils/combineAttributeTrees.js';
const campaignInclude = {
    sessions: { orderBy: { sessionNumber: 'desc' } },
    players: { orderBy: { username: 'asc' } },
    pendingPlayers: { orderBy: { username: 'asc' } },
    factions: { select: { id: true, name: true, factionType: true } },
    gangs: { select: { id: true, name: true } },
    characters: {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            picture: true,
            userId: true,
            playerCharacter: true,
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
    generatedPicture: { select: { publicId: true } },
};
const campaignServices = {
    getCampaigns: async (userId) => {
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
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch owner campaigns');
        }
    },
    getBatchCampaigns: async (campaignIds) => {
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
                return Object.assign(Object.assign({}, campaign), { calendar });
            });
            return modifiedCampaigns;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch characters');
        }
    },
    getCampaignById: async (campaignId) => {
        try {
            const campaign = await prisma.campaign.findUnique({
                where: { id: campaignId },
                include: campaignInclude,
            });
            if (!campaign) {
                throw new Error('Failed to find campaign');
            }
            const calendar = constructCalendar(campaign);
            const modifiedCampaign = Object.assign(Object.assign({}, campaign), { calendar });
            return modifiedCampaign;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch campaign');
        }
    },
    toggleCampaign: async (campaignId) => {
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
            const modifiedCampaign = Object.assign(Object.assign({}, campaign), { calendar });
            return modifiedCampaign;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to toggle campaign active');
        }
    },
    createOrUpdateCampaign: async (formData, ownerId) => {
        const { id, playerIds, pendingPlayerIds, factions, briefing, affiliation } = formData, data = __rest(formData, ["id", "playerIds", "pendingPlayerIds", "factions", "briefing", "affiliation"]);
        try {
            const campaign = await prisma.$transaction(async (tx) => {
                const campaign = await tx.campaign.upsert({
                    where: { id: id || 0 },
                    update: Object.assign(Object.assign({}, data), { ownerId, players: {
                            set: playerIds.map((id) => ({ id })),
                        }, pendingPlayers: {
                            set: pendingPlayerIds.map((id) => ({ id })),
                        } }),
                    create: Object.assign(Object.assign({}, data), { ownerId, sessions: {
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
                        }, date: { month: 'arctus', day: 1 }, time: { hour: 0, minute: 0, second: 0 }, factions: { createMany: { data: factions } }, pendingPlayers: {
                            connect: pendingPlayerIds.map((id) => ({ id })),
                        } }),
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
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create or update campaign');
        }
    },
    getCampaignMaps: async (campaignId) => {
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
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch campaign maps');
        }
    },
    getCampaignMap: async (mapId) => {
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
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch map');
        }
    },
    getBatchLocations: async (locationIds) => {
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
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch locations');
        }
    },
    createOrUpdateEvent: async (campaignId, formData) => {
        const { id, characterId } = formData, data = __rest(formData, ["id", "characterId"]);
        try {
            const event = await prisma.event.upsert({
                where: { id: id || 0 },
                update: data,
                create: Object.assign(Object.assign({}, data), { campaignId,
                    characterId }),
            });
            return event;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create or update event');
        }
    },
    setCampaignDate: async (campaignId, formData) => {
        try {
            const campaign = await prisma.campaign.update({
                where: { id: campaignId },
                data: {
                    date: formData,
                },
                include: campaignInclude,
            });
            return campaign;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch notes');
        }
    },
    setCampaignTime: async (campaignId, formData) => {
        try {
            const campaign = await prisma.campaign.update({
                where: { id: campaignId },
                data: {
                    time: formData,
                },
                include: campaignInclude,
            });
            return campaign;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to set campaign time');
        }
    },
    campaignRoll: async (userId, campaignId, rollData) => {
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
                throw new Error('Failed to find character or action associated with this roll');
            }
            const levelAttributes = character.characterLevelBonuses
                .filter((bonus) => Boolean(bonus.attributes))
                .map((bonus) => Attributes.parse(bonus.attributes));
            const attributes = combineAttributeTrees(levelAttributes);
            const rollResults = calculateRoll(attributes, { name: action.name, roll: action.roll }, rollData.modifiers, rollData.extraDice) || { result: [], successes: 0, roll: null };
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
            };
            io.to(`campaign ${campaignId}`).emit('campaignRoll', {
                rollsArray,
                character,
                action,
            });
            await campaignServices.createCampaignHistory(campaignId, historyData);
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to roll action');
        }
    },
    createCampaignHistory: async (campaignId, formData) => {
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
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create encounter history entry');
        }
    },
    joinCampaign: async (campaignId, userId) => {
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
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to join campaign');
        }
    },
    rejectCampaign: async (campaignId, userId) => {
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
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to join campaign');
        }
    },
    deleteCampaign: async (campaignId, userId) => {
        try {
            await prisma.campaign.delete({
                where: {
                    id: campaignId,
                    ownerId: userId,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to delete campaign');
        }
    },
};
export default campaignServices;
