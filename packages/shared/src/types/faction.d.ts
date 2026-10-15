import { Character } from './character';
import { Gang } from './gang';
import { Picture } from './picture';

interface Faction {
  id: number;
  name: string;
  factionType: FactionType;
  picture: Picture;
  background: { html: string; nodes: string };
  affiliations: Affiliation[];
}

enum FactionType {
  churchOfElShaddai = 'churchOfElShaddai',
  corporateHoldouts = 'corporateHoldouts',
  federalReservists = 'federalReservists',
  noblebloods = 'noblebloods',
}

interface Affiliation {
  id: number;
  campaignId: number;
  value: number;
  factions: Faction[];
  gangs: Gang[];
  characters: Character[];
}
