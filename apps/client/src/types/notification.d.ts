import { Campaign } from './campaign';
import { User } from './user';

interface Notification {
  id: number;
  createdAt: Date;
  type: NotificationType;
  recipientId: number;
  sender: User;
  senderId: number;
  read: boolean;
  readAt: Date;
  campaign: Partial<Campaign> | null;
}

enum NotificationType {
  campaignInvite = 'campaignInvite',
  sessionInvite = 'sessionInvite',
}
