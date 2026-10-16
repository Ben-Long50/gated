import { AttributeName, SkillName } from './attributeTree.js';
import { Stats } from './item.js';
import { Item } from './item.js';
import { Keyword } from './keyword.js';
import { Perk } from './perk.js';
export type Action = {
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
    duration: {
        unit: string;
        value: number | null;
    };
    cooldown: {
        unit: string;
        value: number | null;
    };
    modifiers: Stats;
    keywordModifiers: {
        keyword: Keyword;
        value: number | null;
    }[];
    parentItem?: Item | null;
    parentItemId?: number | null;
    perk?: Perk | null;
    perkId?: number | null;
};
export type ActionCosts = {
    currentActions?: number | null;
    currentReactions?: number | null;
    currentPower?: number | null;
    currentHealth?: number | null;
    currentSanity?: number | null;
    wyrmShells?: number | null;
    currentAmmoCount?: number | null;
};
export type ActionRoll = {
    attribute: AttributeName;
    skill: SkillName;
};
export declare enum ActionType {
    action = "action",
    extendedAction = "extendedAction",
    reaction = "reaction",
    passive = "passive"
}
export declare enum ActionCostStat {
    currentActions = "currentActions",
    currentReactions = "currentReactions",
    health = "health",
    sanity = "sanity",
    power = "power",
    wyrmShells = "wyrmShells"
}
export type ItemLinkReference = {
    id: number;
    item: Item;
    itemId: number;
    items: Item[];
    actions: Action[];
};
