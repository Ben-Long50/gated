import { Action } from '../types/action.js';
import { AttributeTree } from '../types/attributeTree.js';
export declare const calculateDiceCount: (attributes: AttributeTree, action: Partial<Action>, modifiers: string[], extraDice?: number) => {
    diceCount: number;
    roll: import("../types/action.js").ActionRoll;
} | {
    diceCount: string;
};
