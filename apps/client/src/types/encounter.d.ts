import { Action } from './action';
import { Campaign } from './campaign';
import { Character } from './character';
import { Item } from './item';
import { Map } from './map';

export interface Encounter {
  id: number;
  createdAt: Date;
  name: string;
  active: boolean;
  campaign: Campaign;
  campaignId: number;
  map: Map;
  mapId: number;
  //   event
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
}

enum CombatPhase {
  pending = 'pending',
  initiative = 'initiative',
  action = 'action',
  reaction = 'reaction',
  completed = 'completed',
}

export interface PhaseHistory {
  id: number;
  createdAt: Date;
  turn: number;
  round: number;
  encounter: Encounter;
  encounterId: number;
  action: History;
  reactions: History[];
}

export interface History {
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
  armorSnapshots?: Item[];
  armorIds?: number[];
  rollResult: RollResult;
  blockData?: {
    blockedDamage: number;
    blockedSanityDamage: number;
    armorIds: number[];
  }[];
}

type RollResult = {
  diceArray: number[];
  successes: number;
};
