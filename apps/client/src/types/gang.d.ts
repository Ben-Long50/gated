import { Campaign } from './campaign';
import { Character } from './character';
import { Affiliation, Faction } from './faction';
import { Map } from './map';
import { Picture } from './picture';

interface Gang {
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
}

interface GangSessionBonus {
  id: number;
  gang: Gang;
  gangId: number;
  session: Session;
  sessionId: number;
  reputationBonus: { value: number; description: string }[];
  levelNodeBonus: { value: number; description: string }[];
}
