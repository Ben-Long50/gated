import prisma from '../config/database.js';
const notificationServices = {
    getNotifications: async (userId) => {
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
    },
    createCampaignNotification: async (type, recipients, sender, campaignId) => {
        await prisma.notification.createMany({
            data: recipients.map((recipient) => ({
                type,
                recipientId: recipient,
                senderId: sender,
                campaignId,
            })),
        });
    },
    markNotificationsRead: async (userId) => {
        await prisma.notification.updateMany({
            where: { recipientId: userId },
            data: { read: true },
        });
    },
    deleteNotification: async (notificationId) => {
        await prisma.notification.delete({
            where: {
                id: notificationId,
            },
        });
    },
    deleteNotifications: async (userId) => {
        await prisma.notification.deleteMany({
            where: {
                recipientId: userId,
            },
        });
    },
};
export default notificationServices;
