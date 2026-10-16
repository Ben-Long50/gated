import { Campaign } from './campaign.js';
import { Character } from './character.js';
import { Encounter } from './encounter.js';
import { Item } from './item.js';
import { Picture } from './picture.js';
import { User } from './user.js';

export type MapInput = {
  id: number;
  campaignId: number;
  draft: boolean;
  name: string;
  description?: string;
  type: MapType;
  width: number;
  height: number;
  baseColor: string;
  layerCount: number;
  layers: Layer[];
  generatedPictureId: number | null;
};

export type Map = {
  id: number;
  user: User;
  userId: number;
  campaign: Campaign;
  campaignId: number;
  picture: Picture;
  draft: boolean;
  name: string;
  description?: string;
  type: MapType;
  width: number;
  height: number;
  baseColor: string;
  layerCount: number;
  layers: Layer[];
  publicId: string;
  locations: Location[];
  encounters: Encounter[];
};

export type Layer = {
  name: string;
  id: number;
  hidden: boolean;
  componentCount: number;
  components: Component[];
};

export type Component = {
  name: string;
  id: number;
  imageUrl?: string;
  width: number;
  height: number;
  imageColStart?: number;
  imageRowStart?: number;
  mapColStart: number;
  mapRowStart: number;
  subComponents: Component[];
};

export enum MapType {
  map = 'map',
  component = 'component',
}

export type Location = {
  id: number;
  row: number;
  col: number;
  map: Map;
  mapId: number;
  character?: Character;
  characterId?: number;
  item?: Item;
  itemId?: number;
};
