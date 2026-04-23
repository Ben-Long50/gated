import { Action } from './action';
import { AttributeTree } from './attributeTree';
import { Campaign } from './campaign';
import { Condition, ConditionReference } from './condition';
import { Affiliation } from './faction';
import { Gang } from './gang';
import { Item } from './item';
import { Location } from './map';
import { Perk } from './perk';
import { Picture } from './picture';

interface Character {
  id: number;
  userId: number;
  level: number;
  picture: Picture;
  profits: number;
  stats: Record<string, number>;
  height: number;
  weight: number;
  age: number;
  sex: string;
  gang?: Gang;
  gangId?: number;
  campaign?: Campaign;
  campaignId?: number;
  backstory: { html: string; nodes: object };
  firstTaste: { html: string; nodes: object };
  badMedicine: { html: string; nodes: object };
  attributes: AttributeTree;
  firstName: string;
  lastName: string;
  active: boolean;
  playerCharacter: boolean;
  pushCount: number;
  npcTypes?: string[];
  preferences: CharacterPreferences;
  perks: Perk[];
  conditions: ConditionReference[];
  characterCart: CharacterCart;
  characterInventory: CharacterInventory;
  affiliations: Affiliation[];
  location: Location;
}

interface CharacterStats {
  maxHealth: number;
  maxSanity: number;
  currentHealth: number;
  currentSanity: number;
  speed: number;
  actions: number;
  reactions: number;
  currentActions: number;
  currentReactions: number;
  hands: number;
  currentFeet: number;
  feet: number;
  currentHands: number;
  maxCyber?: number;
  cyber?: number;
  maxEquip?: number;
  weight?: number;
  injuries: number;
  insanities: number;
}

interface CharacterPreferences {
  firstName: boolean;
  lastName: boolean;
  age: boolean;
  height: boolean;
  weight: boolean;
  sex: boolean;
  picture: boolean;
  backstory: boolean;
  level: boolean;
  profits: boolean;
  stats: boolean;
  attributes: boolean;
  perks: boolean;
  equipment: boolean;
}

interface CharacterCart {
  id: number;
  characterId: number;
  items: CartItemReference[];
}

interface CharacterInventory {
  id: number;
  characterId: number;
  items: Item[];
  actions: Action[];
}

interface SortedInventory {
  weapons: Item[];
  armors: Item[];
  augmentations: Item[];
  vehicles: Item[];
  drones: Item[];
  reusables: Item[];
  consumables: Item[];
  actions: Action[];
}

interface CartItemReference {
  id: number;
  characterCartId: number;
  itemId: number;
  item: Item;
  quantity: number;
}

interface Resume {
  backstory: { html: string; nodes: object };
  firstTaste: { html: string; nodes: object };
  badMedicine: { html: string; nodes: object };
}
