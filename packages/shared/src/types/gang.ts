import { Session } from './campaign.js';
import { Campaign } from './campaign.js';
import { Character } from './character.js';
import { Affiliation } from './faction.js';
import { Faction } from './faction.js';
import { Map } from './map.js';
import { Picture } from './picture.js';

export type Gang = {
  id: number;
  name: string;
  level: number;
  picture: Picture;
  profits: number;
  leaders: Character[];
  characters: Character[];
  campaign: Campaign;
  campaignId: number;
  faction: Faction;
  factionId: number;
  turf: Map[];
  affiliations: Affiliation[];
  gangSessionBonuses: GangSessionBonus[];
};

export type GangSessionBonus = {
  id: number;
  gang: Gang;
  gangId: number;
  session: Session;
  sessionId: number;
  reputationBonus: { value: number; description: string }[];
  levelNodeBonus: { value: number; description: string }[];
};
