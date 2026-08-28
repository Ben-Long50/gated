const userLimits = {
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
  },
};

export default userLimits;
