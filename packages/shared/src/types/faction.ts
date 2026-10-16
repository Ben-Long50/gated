import { Character } from './character.js';
import { Gang } from './gang.js';
import { Picture } from './picture.js';

export type Faction = {
  id: number;
  name: string;
  factionType: FactionType;
  picture: Picture;
  background: { html: string; nodes: string };
  affiliations: Affiliation[];
};

export enum FactionType {
  churchOfElShaddai = 'churchOfElShaddai',
  corporateHoldouts = 'corporateHoldouts',
  federalReservists = 'federalReservists',
  noblebloods = 'noblebloods',
}

export type Affiliation = {
  id: number;
  campaignId: number;
  value: number;
  factions: Faction[];
  gangs: Gang[];
  characters: Character[];
};
