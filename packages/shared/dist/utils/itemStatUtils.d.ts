import { Item } from '../types/item.js';
import { Keyword } from '../types/keyword.js';
export declare const calculateItemStats: (item: Item) => {
    stats: Record<string, number>;
    keywords: {
        keyword: Keyword;
        value: number | null;
    }[];
    id: number;
    userId: number;
    updatedAt: Date;
    name: string;
    itemTypes: import("../types/item.js").ItemType[];
    itemSubtypes?: string[];
    rarity: string;
    grade: number;
    picture: import("../index.js").Picture;
    price: number | null;
    equipped: boolean;
    available: boolean;
    description: string;
    modifiedStats?: import("../types/item.js").Stats;
    modifiedKeywords: import("../types/keyword.js").KeywordReference[];
    conditions: import("../index.js").ConditionReference[];
    linkedItems: Item[];
    linkedActions: import("../index.js").Action[];
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
