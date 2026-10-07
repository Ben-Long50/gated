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
import characterServices, { characterInclude } from './characterServices.js';
import { combineAttributeTrees } from '../utils/combineAttributeTrees.js';
const campaignInclude = {
    sessions: { orderBy: { sessionNumber: 'desc' } },
    players: { orderBy: { username: 'asc' } },
    pendingPlayers: { orderBy: { username: 'asc' } },
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
        orderBy: { name: 'asc' },
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
    getCampaigns: async (userId) => {
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
    getBatchCampaigns: async (campaignIds) => {
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
    },
    getCampaignById: async (campaignId) => {
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
    },
    toggleCampaign: async (campaignId) => {
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
    },
    createOrUpdateCampaign: async (formData, ownerId) => {
        const { id, playerIds, pendingPlayerIds, generatedPictureId, factions, briefing, affiliation } = formData, data = __rest(formData, ["id", "playerIds", "pendingPlayerIds", "generatedPictureId", "factions", "briefing", "affiliation"]);
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
                            generatedPictureId,
                        },
                    }, date: { month: 'arctus', day: 1 }, time: { hour: 0, minute: 0, second: 0 }, factions: { createMany: { data: factions } }, pendingPlayers: {
                        connect: pendingPlayerIds.map((id) => ({ id })),
                    }, generatedPictureId }),
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
    getCampaignMaps: async (campaignId) => {
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
    getCampaignMap: async (mapId) => {
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
    getBatchLocations: async (locationIds) => {
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
    createOrUpdateEvent: async (campaignId, formData) => {
        const { id, characterId } = formData, data = __rest(formData, ["id", "characterId"]);
        const event = await prisma.event.upsert({
            where: { id: id || 0 },
            update: data,
            create: Object.assign(Object.assign({}, data), { campaignId,
                characterId }),
        });
        return event;
    },
    setCampaignDate: async (campaignId, formData) => {
        const campaign = await prisma.campaign.update({
            where: { id: campaignId },
            data: {
                date: formData,
            },
            include: campaignInclude,
        });
        return campaign;
    },
    setCampaignTime: async (campaignId, formData) => {
        const campaign = await prisma.campaign.update({
            where: { id: campaignId },
            data: {
                time: formData,
            },
            include: campaignInclude,
        });
        return campaign;
    },
    campaignRoll: async (userId, campaignId, rollData) => {
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
    },
    createCampaignHistory: async (campaignId, formData) => {
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
    joinCampaign: async (campaignId, userId, characterId) => {
        const data = prisma.$transaction(async (tx) => {
            const c = await tx.campaign.findUnique({
                where: { id: campaignId },
                select: {
                    characters: {
                        where: { playerCharacter: true },
                        select: { userId: true },
                    },
                },
            });
            if (c === null || c === void 0 ? void 0 : c.characters.some((character) => character.userId === userId)) {
                throw new Error('You already have a player character in this campaign');
            }
            const character = await tx.character.findUnique({
                where: { id: characterId },
                select: { userId: true, campaignId: true },
            });
            if (character === null || character === void 0 ? void 0 : character.campaignId) {
                throw new Error('This character already belongs to a campaign');
            }
            const newCharacter = (character === null || character === void 0 ? void 0 : character.userId) === null
                ? await characterServices.createTemplateCharacter(userId, characterId, campaignId, undefined, tx)
                : await tx.character.update({
                    where: { id: characterId },
                    data: { campaignId },
                    include: characterInclude,
                });
            const campaign = await tx.campaign.update({
                where: {
                    id: campaignId,
                },
                data: {
                    pendingPlayers: { disconnect: { id: userId } },
                    players: { connect: { id: userId } },
                },
                include: campaignInclude,
            });
            return { campaign, character: newCharacter };
        });
        return data;
    },
    rejectCampaign: async (campaignId, userId) => {
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
    deleteCampaign: async (campaignId, userId) => {
        await prisma.campaign.delete({
            where: {
                id: campaignId,
                ownerId: userId,
            },
        });
    },
};
export default campaignServices;
