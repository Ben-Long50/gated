import prisma from '../config/database.js';
const notificationServices = {
    getNotifications: async (userId) => {
        try {
            const notifications = await prisma.notification.findMany({
                where: { recipientId: userId },
                include: {
                    sender: {
                        select: { profilePicture: true, username: true },
                    },
                    campaign: { select: { id: true, name: true } },
                },
                orderBy: { createdAt: 'desc' },
            });
            return notifications;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch notifications');
        }
    },
    createCampaignNotification: async (type, recipients, sender, campaignId) => {
        try {
            await prisma.notification.createMany({
                data: recipients.map((recipient) => ({
                    type,
                    recipientId: recipient,
                    senderId: sender,
                    campaignId,
                })),
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create or update notification');
        }
    },
    markNotificationsRead: async (userId) => {
        try {
            await prisma.notification.updateMany({
                where: { recipientId: userId },
                data: { read: true },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create or update notification');
        }
    },
    deleteNotification: async (notificationId) => {
        try {
            await prisma.notification.delete({
                where: {
                    id: notificationId,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to delete notification');
        }
    },
    deleteNotifications: async (userId) => {
        try {
            await prisma.notification.deleteMany({
                where: {
                    recipientId: userId,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to delete notifications');
        }
    },
};
export default notificationServices;
