import { AttributeName, SkillName } from './attributeTree';
import { Stats } from './item';

interface Action {
  id: number;
  name: string;
  description: string;
  costs: ActionCosts;
  roll: ActionRoll[];
  equipped: boolean;
  active: boolean;
  available: boolean;
  actionType: ActionType;
  actionSubtypes: string[];
  duration: { unit: string; value: number | null };
  cooldown: { unit: string; value: number | null };
  modifiers: Stats;
  keywordModifiers: { keyword: Keyword; value: number | null }[];
}

interface ActionCosts {
  currentActions?: number | null;
  currentReactions?: number | null;
  currentPower?: number | null;
  currentHealth?: number | null;
  currentSanity?: number | null;
  wyrmShells?: number | null;
  currentAmmoCount?: number | null;
}

interface ActionRoll {
  attribute: AttributeName;
  skill: SkillName;
}

enum ActionType {
  action = 'action',
  extendedAction = 'extendedAction',
  reaction = 'reaction',
  passive = 'passive',
}

enum ActionCostStat {
  currentActions = 'currentActions',
  currentReactions = 'currentReactions',
  health = 'health',
  sanity = 'sanity',
  power = 'power',
  wyrmShells = 'wyrmShells',
}
