export const userLimits = {
    USER: {
        roleName: 'Free User',
        playerCharacters: 1,
        nonPlayerCharacters: 10,
        playerCharacterInventorySize: 20,
        nonPlayerCharacterInventorySize: 10,
        get playerCharacterTotalItems() {
            return this.playerCharacters * this.playerCharacterInventorySize;
        },
        get nonPlayerCharacterTotalItems() {
            return this.nonPlayerCharacters * this.nonPlayerCharacterInventorySize;
        },
        ownerCampaigns: 1,
        campaignPlayers: 3,
        playerCampaigns: 1,
        monthlyPictureGenerations: 0,
        pictures: 0,
    },
    PROUSER: {
        roleName: 'Pro User',
        playerCharacters: 10,
        nonPlayerCharacters: 100,
        playerCharacterInventorySize: 50,
        nonPlayerCharacterInventorySize: 25,
        get playerCharacterTotalItems() {
            return this.playerCharacters * this.playerCharacterInventorySize;
        },
        get nonPlayerCharacterTotalItems() {
            return this.nonPlayerCharacters * this.nonPlayerCharacterInventorySize;
        },
        ownerCampaigns: 5,
        campaignPlayers: 10,
        playerCampaigns: 10,
        monthlyPictureGenerations: 50,
        pictures: 100,
    },
    SUPERUSER: {
        roleName: 'Super User',
        playerCharacters: 10,
        nonPlayerCharacters: 100,
        playerCharacterInventorySize: 50,
        nonPlayerCharacterInventorySize: 25,
        get playerCharacterTotalItems() {
            return this.playerCharacters * this.playerCharacterInventorySize;
        },
        get nonPlayerCharacterTotalItems() {
            return this.nonPlayerCharacters * this.nonPlayerCharacterInventorySize;
        },
        ownerCampaigns: 5,
        campaignPlayers: 10,
        playerCampaigns: 10,
        monthlyPictureGenerations: 100,
        pictures: 200,
    },
    ADMIN: {
        roleName: 'Administrator',
        playerCharacters: Infinity,
        nonPlayerCharacters: Infinity,
        playerCharacterInventorySize: 50,
        nonPlayerCharacterInventorySize: 25,
        get playerCharacterTotalItems() {
            return this.playerCharacters * this.playerCharacterInventorySize;
        },
        get nonPlayerCharacterTotalItems() {
            return this.nonPlayerCharacters * this.nonPlayerCharacterInventorySize;
        },
        ownerCampaigns: Infinity,
        campaignPlayers: 10,
        playerCampaigns: Infinity,
        monthlyPictureGenerations: Infinity,
        pictures: 1000,
    },
    SUPERADMIN: {
        roleName: 'Super Administrator',
        playerCharacters: Infinity,
        nonPlayerCharacters: Infinity,
        playerCharacterInventorySize: 50,
        nonPlayerCharacterInventorySize: 25,
        get playerCharacterTotalItems() {
            return this.playerCharacters * this.playerCharacterInventorySize;
        },
        get nonPlayerCharacterTotalItems() {
            return this.nonPlayerCharacters * this.nonPlayerCharacterInventorySize;
        },
        ownerCampaigns: Infinity,
        campaignPlayers: 10,
        playerCampaigns: Infinity,
        monthlyPictureGenerations: Infinity,
        pictures: 1000,
    },
};
