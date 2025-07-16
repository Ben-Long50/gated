export interface User {
  id: number | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  profilePicture?: string | null;
  role: string | null;
  _count: {
    receivedNotifications: number;
  };
  ownerCampaigns: { id: number }[] | null;
  pendingCampaigns: { id: number }[] | null;
  playerCampaigns: { id: number }[] | null;
}
