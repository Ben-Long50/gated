export interface User {
  id?: number;
  username: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  email?: string;
  characters: { id: number }[];
  ownerCampaigns: { id: number }[];
  pendingCampaigns: { id: number }[];
  playerCampaigns: { id: number }[];
}
