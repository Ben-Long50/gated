import { Action } from './action.js';
import { AttributeTree } from './attributeTree.js';
import { Campaign } from './campaign.js';
import { ConditionReference } from './condition.js';
import { Affiliation } from './faction.js';
import { Gang } from './gang.js';
import { Item } from './item.js';
import { Perk } from './perk.js';
import { Picture } from './picture.js';
export type Character = {
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
    backstory?: {
        html: string;
        nodes: object;
    };
    firstTaste?: {
        html: string;
        nodes: object;
    };
    badMedicine?: {
        html: string;
        nodes: object;
    };
    description?: string;
    attributes: AttributeTree;
    name: string;
    title?: string;
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
    characterLevelBonuses: CharacterLevelBonus[];
    location: Location;
    equipment: {
        armors: Item[];
    };
};
export type CharacterLevelBonus = {
    id: number;
    characterId: number;
    level: number;
    perk?: Perk;
    attributes: AttributeTree;
};
export type CharacterStats = {
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
    permanentInjuries: number;
    permanentInsanities: number;
};
export type CharacterPreferences = {
    name: boolean;
    title: boolean;
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
};
export type CharacterCart = {
    id: number;
    characterId: number;
    items: CartItemReference[];
};
export type CharacterInventory = {
    id: number;
    characterId: number;
    items: Item[];
    actions: Action[];
};
export type SortedInventory = {
    weapons: Item[];
    armors: Item[];
    augmentations: Item[];
    vehicles: Item[];
    drones: Item[];
    reusables: Item[];
    consumables: Item[];
    actions: Action[];
};
export type CartItemReference = {
    id: number;
    characterCartId: number;
    itemId: number;
    item: Item;
    quantity: number;
};
export type Resume = {
    backstory: {
        html: string;
        nodes: object;
    };
    firstTaste: {
        html: string;
        nodes: object;
    };
    badMedicine: {
        html: string;
        nodes: object;
    };
};
