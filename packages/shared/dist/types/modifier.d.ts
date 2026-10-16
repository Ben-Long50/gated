import { Action } from './action.js';
export type Modifier = StatModifier | RollModifier;
export type StatModifier = {
    type: 'stat';
    stat: string;
    operator: ModifierOperator;
    valueType: ValueType;
    attribute?: string;
    skill?: string;
    value?: number;
    duration?: {
        unit: string;
        value: number;
    };
};
export type RollModifier = {
    type: 'roll';
    action: Action;
    operator: ModifierOperator;
    valueType: ValueType;
    attribute?: string;
    skill?: string;
    value?: number;
    duration?: {
        unit: string;
        value: number;
    };
};
export type ModifierType = 'stat' | 'roll';
export type ValueType = 'number' | 'attribute' | 'skill';
export type ModifierOperator = 'add' | 'subtract' | 'multiply' | 'divide';
