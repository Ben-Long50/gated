import prisma from '../config/database.js';
import { deleteManyFromCloudinary } from '../utils/cloudinary.js';
export const userInclude = {
    generatedPictures: {
        select: { id: true, publicId: true, type: true },
        orderBy: { createdAt: 'desc' },
    },
    characters: {
        select: {
            id: true,
            playerCharacter: true,
            campaignId: true,
            characterInventory: {
                include: {
                    _count: {
                        select: {
                            items: true,
                        },
                    },
                },
            },
        },
        orderBy: { name: 'asc' },
    },
    maps: {
        select: {
            id: true,
        },
        orderBy: { createdAt: 'desc' },
    },
    ownerCampaigns: { select: { id: true } },
    playerCampaigns: { select: { id: true } },
    pendingCampaigns: { select: { id: true } },
};
const userServices = {
    getAuthenticatedUser: async (userId) => {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: userInclude,
        });
        return user;
    },
    getAllUsers: async (query, userId) => {
        if (!query)
            return [];
        const users = await prisma.user.findMany({
            where: {
                id: { not: userId },
                username: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            select: { id: true, username: true, profilePicture: true, role: true },
            take: 10,
        });
        return users;
    },
    getBatchUsers: async (userIds) => {
        const users = await prisma.user.findMany({
            where: {
                id: { in: userIds },
            },
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                profilePicture: true,
            },
        });
        return users;
    },
    getUsersByUsernameQuery: async (query) => {
        const users = await prisma.user.findMany({
            where: query
                ? {
                    username: {
                        contains: query,
                        mode: 'insensitive',
                    },
                }
                : undefined,
            select: {
                id: true,
                username: true,
                profilePicture: true,
                role: true,
            },
            orderBy: { username: 'asc' },
            take: 20,
        });
        return users;
    },
    getUserById: async (id) => {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                profilePicture: true,
                characters: { select: { id: true }, orderBy: { name: 'asc' } },
                ownerCampaigns: { select: { id: true } },
                playerCampaigns: { select: { id: true } },
                pendingCampaigns: { select: { id: true } },
            },
        });
        return user;
    },
    getUserByEmail: async (email) => {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                username: true,
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                profilePicture: true,
            },
        });
        return user;
    },
    createUser: async (userData) => {
        await prisma.user.create({
            data: userData,
        });
    },
    createFacebookUser: async (userData) => {
        await prisma.user.create({
            data: userData,
        });
    },
    createGoogleUser: async (userData) => {
        await prisma.user.create({
            data: userData,
        });
    },
    updateUser: async (userData, userId) => {
        await prisma.user.update({
            where: { id: userId },
            data: userData,
        });
    },
    addUserGeneratedPicture: async (pictures, prompt, type, userId) => {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                generatedPictures: {
                    createMany: {
                        data: pictures.map((picture) => ({
                            imageUrl: picture.imageUrl,
                            publicId: picture.publicId,
                            type,
                            prompt,
                        })),
                    },
                },
                generationCount: { increment: pictures.length },
            },
            include: userInclude,
        });
        const newPictures = user.generatedPictures.slice(0, pictures.length);
        return { user, newPictures };
    },
    deleteUnusedGeneratedPictures: async (userId, type, count) => {
        const publicIds = await prisma.$transaction(async (tx) => {
            const pictures = await tx.generatedPicture.findMany({
                where: {
                    userId,
                    type,
                    characters: { none: {} },
                    items: { none: {} },
                    properties: { none: {} },
                    gangs: { none: {} },
                    sessions: { none: {} },
                    factions: { none: {} },
                    maps: { none: {} },
                    campaigns: { none: {} },
                },
                orderBy: { createdAt: 'asc' },
                take: count,
                select: { id: true, publicId: true },
            });
            const publicIds = pictures.map((picture) => picture.publicId);
            await tx.generatedPicture.deleteMany({
                // where: { publicId: publicIds[0] },
                where: { publicId: { in: publicIds } },
            });
            return publicIds;
        });
        await deleteManyFromCloudinary(publicIds);
        return publicIds.length;
    },
    updateUserRoles: async (formData) => {
        const updatePromises = [];
        for (const user of formData) {
            updatePromises.push(prisma.user.update({
                where: { id: user.id },
                data: { role: user.role },
            }));
        }
        await Promise.all(updatePromises);
    },
};
export default userServices;
