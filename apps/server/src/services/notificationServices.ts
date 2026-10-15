import { $Enums } from '@prisma/client';
import prisma from '../config/database.js';

const notificationServices = {
  getNotifications: async (userId: number) => {
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

  createCampaignNotification: async (
    type: $Enums.NotificationType,
    recipients: number[],
    sender: number,
    campaignId: number,
  ) => {
    await prisma.notification.createMany({
      data: recipients.map((recipient) => ({
        type,
        recipientId: recipient,
        senderId: sender,
        campaignId,
      })),
    });
  },

  markNotificationsRead: async (userId: number) => {
    await prisma.notification.updateMany({
      where: { recipientId: userId },
      data: { read: true },
    });
  },

  deleteNotification: async (notificationId: number) => {
    await prisma.notification.delete({
      where: {
        id: notificationId,
      },
    });
  },

  deleteNotifications: async (userId: number) => {
    await prisma.notification.deleteMany({
      where: {
        recipientId: userId,
      },
    });
  },
};

export default notificationServices;
