import { Action } from './action';
import { ConditionReference } from './condition';
import { Keyword, KeywordReference } from './keyword';
import { Picture } from './picture';

interface Item {
  id: number;
  userId: number;
  updatedAt: Date;
  name: string;
  itemTypes: ItemType[];
  itemSubtypes?: string[];
  rarity: string;
  grade: number;
  picture: Picture;
  price: number | null;
  equipped: boolean;
  available: boolean;
  description: string;
  stats: Record<string, number>;
  modifiedStats?: Stats;
  keywords: KeywordReference[];
  modifiedKeywords: KeywordReference[];
  conditions: ConditionReference[];
  linkedItems: Item[];
  linkedActions: Action[];
  parentItemId: number | null;
  parentItem: Item | null;
  baseItemId: number | null;
  baseItem: Item | null;
  characterInventory?: {
    character: { campaignId: number };
    characterId: number;
  };
}

interface Stats {
  damage?: number;
  sanityDamage?: number;
  salvo?: number;
  flurry?: number;
  range?: number;
  currentAmmoCount?: number;
  magCapacity?: number;
  currentMagCount?: number;
  magCount?: number;
  armor?: number;
  ward?: number;
  currentBlock?: number;
  block?: number;
  cyber?: number;
  maxCyber?: number;
  currentPower?: number;
  power?: number;
  weight?: number;
  size?: number;
  speed?: number;
  agility?: number;
  hull?: number;
  currentHull?: number;
  cargo?: number;
  currentCargo?: number;
  hangar?: number;
  currentHangar?: number;
  pass?: number;
  currentPass?: number;
  turret?: number;
  currentTurret?: number;
  weapon?: number;
  currentWeapon?: number;
  wyrmMoldSlots?: number;
  currentWyrmMoldSlots?: number;
  wyrmMoldPoints?: number;
  esotericCharges?: number;
  currentEsotericCharges?: number;
}

export type ItemType =
  | 'weapon'
  | 'armor'
  | 'cybernetic'
  | 'mutation'
  | 'vehicle'
  | 'drone'
  | 'modification'
  | 'reusable'
  | 'consumable';

export interface Equipment {
  weapons: Item[];
  armors: Item[];
  augmentations: Item[];
  vehicles: Item[];
  drones: Item[];
  modifications: Item[];
  reusables: Item[];
  consumables: Item[];
}
