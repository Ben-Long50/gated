import { Character } from '../types/character.js';
import { Item } from '../types/item.js';
export declare const calculateCosts: (costs: Record<string, number>, character: Character, item?: Item) => {
    characterCosts: Record<string, number>;
    itemCosts: Record<string, number>;
    errors: string[];
};
