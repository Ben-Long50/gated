import prisma from '../config/database.js';
const userServices = {
    getAuthenticatedUser: async (userId) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    profilePicture: true,
                    characters: { select: { id: true }, orderBy: { firstName: 'asc' } },
                    ownerCampaigns: { select: { id: true } },
                    playerCampaigns: { select: { id: true } },
                    pendingCampaigns: { select: { id: true } },
                },
            });
            return user;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch users');
        }
    },
    getAllUsers: async (query, userId) => {
        try {
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
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch users');
        }
    },
    getBatchUsers: async (userIds) => {
        try {
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
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch users');
        }
    },
    getUsersByUsernameQuery: async (query) => {
        try {
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
                },
                orderBy: { username: 'asc' },
                take: 20,
            });
            return users;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch users');
        }
    },
    getUserById: async (id) => {
        try {
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
                    characters: { select: { id: true }, orderBy: { firstName: 'asc' } },
                    ownerCampaigns: { select: { id: true } },
                    playerCampaigns: { select: { id: true } },
                    pendingCampaigns: { select: { id: true } },
                },
            });
            return user;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch user');
        }
    },
    getUserByEmail: async (email) => {
        try {
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
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch user');
        }
    },
    createUser: async (userData) => {
        try {
            await prisma.user.create({
                data: userData,
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create user');
        }
    },
    createFacebookUser: async (userData) => {
        try {
            await prisma.user.create({
                data: userData,
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create user with Facebook login');
        }
    },
    createGoogleUser: async (userData) => {
        try {
            await prisma.user.create({
                data: userData,
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create user with Google login');
        }
    },
    updateUser: async (userData, userId) => {
        try {
            await prisma.user.update({
                where: { id: userId },
                data: userData,
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to update account information');
        }
    },
    updateUserRole: async (role, userId) => {
        try {
            await prisma.user.update({
                where: { id: userId },
                data: { role },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to update account information');
        }
    },
};
export default userServices;
