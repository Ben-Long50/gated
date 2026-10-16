import { Action } from './action.js';
import { Campaign } from './campaign.js';
import { Character } from './character.js';
import { Item } from './item.js';
import { Map } from './map.js';

export type Encounter = {
  id: number;
  createdAt: Date;
  name: string;
  active: boolean;
  campaign: Campaign;
  campaignId: number;
  map: Map;
  mapId: number;
  turn: number;
  round: number;
  turnOrder: number[];
  turnPosition: number;
  reactions: number[];
  passes: number[];
  combatPhase: CombatPhase;
  characters: Character[];
  phaseHistory: PhaseHistory[];
  history: History[];
};

export enum CombatPhase {
  pending = 'pending',
  initiative = 'initiative',
  action = 'action',
  reaction = 'reaction',
  completed = 'completed',
}

export type PhaseHistory = {
  id: number;
  createdAt: Date;
  turn: number;
  round: number;
  encounter: Encounter;
  encounterId: number;
  action: History;
  reactions: History[];
};

export type History = {
  id: number;
  createdAt: Date;
  campaign: Campaign;
  campaignId: number;
  encounter: Encounter;
  encounterId: number;
  phaseHistoryAction: PhaseHistory;
  phaseHistoryActionId: number;
  phaseHistoryReaction: PhaseHistory;
  phaseHistoryReactionId: number;
  characterSnapshot: Character;
  characterId: number;
  targetSnapshot?: Character;
  targetId?: number;
  actionSnapshot: Action;
  actionId: number;
  itemSnapshot?: Item;
  itemId?: number;
  tile?: {
    start: { row: number; col: number };
    end: { row: number; col: number };
  };
  armorSnapshots?: Item[];
  armorIds?: number[];
  rollResult: RollResult;
  blockData?: {
    blockedDamage: number;
    blockedSanityDamage: number;
    armorIds: number[];
  }[];
};

export type RollResult = {
  diceArray: number[];
  successes: number;
};
