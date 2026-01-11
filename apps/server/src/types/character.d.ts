import { Picture } from './picture';

export interface Character {
  id: number;
  playerCharacter: boolean;
  campaignId: number | null;
  perks: number[];
  stats: CharacterStats;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  publicId?: string;
  height: number;
  weight: number;
  age: number;
  sex: 'male' | 'female';
  level: number;
  picture: { imageUrl: string; publicId: string };
  profits?: number;
  backstory: { html: string; nodes: object };
  firstTaste: { html: string; nodes: object };
  badMedicine: { html: string; nodes: object };
  attributes: string;
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
  currentHands: number;
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

export type CharacterWithTypedStats = Omit<Character, 'stats'> & {
  picture: Picture;
  stats: CharacterStats;
};
