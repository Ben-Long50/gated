export type ConditionReference = {
    id: number;
    condition: Condition;
    conditionId: number;
    itemId?: number;
    characterId?: number;
    stacks?: number;
};
export type Condition = {
    id: number;
    name: string;
    conditionType: ConditionType;
    description: string;
};
export declare enum ConditionType {
    character = "character",
    item = "item"
}
