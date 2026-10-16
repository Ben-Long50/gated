import { Action } from '../types/action.js';
import { Item } from '../types/item.js';
export declare const calculateDamage: (item: Item, action: Action, successes: number) => {
    damage: number;
    instances: number;
};
