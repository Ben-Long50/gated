import { Campaign } from './campaign.js';
import { User } from './user.js';
export type Notification = {
    id: number;
    createdAt: Date;
    type: NotificationType;
    recipientId: number;
    sender: User;
    senderId: number;
    read: boolean;
    readAt: Date;
    campaign: Partial<Campaign> | null;
};
export declare enum NotificationType {
    campaignInvite = "campaignInvite",
    sessionInvite = "sessionInvite"
}
