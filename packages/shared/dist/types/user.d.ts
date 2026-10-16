export type User = {
    id: number | null;
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    role: 'GUEST' | 'USER' | 'PROUSER' | 'ADMIN' | 'SUPERADMIN';
    characters: {
        id: number;
        playerCharacter: boolean;
    }[];
    ownerCampaigns: {
        id: number;
    }[];
    pendingCampaigns: {
        id: number;
    }[];
    playerCampaigns: {
        id: number;
    }[];
    maps: {
        id: number;
    }[];
    generatedPictures: {
        id: number;
        publicId: string;
    }[];
};
