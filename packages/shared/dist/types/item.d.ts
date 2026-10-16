import { Action } from './action.js';
import { ConditionReference } from './condition.js';
import { KeywordReference } from './keyword.js';
import { Picture } from './picture.js';
export type Item = {
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
    stats: Stats;
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
        character: {
            campaignId: number;
        };
        characterId: number;
    };
};
export type Stats = Record<string, number>;
export type ItemType = 'weapon' | 'armor' | 'cybernetic' | 'mutation' | 'vehicle' | 'drone' | 'modification' | 'reusable' | 'consumable';
export type Equipment = Item[];
