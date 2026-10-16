import { AttributeName, AttributeTree, SkillName } from '../types/attributeTree.js';
export declare const getAttributePoints: (tree: AttributeTree, attributeName: AttributeName) => number;
export declare const getSkillPoints: (tree: AttributeTree, skillName: string) => number | undefined;
export declare const getUsedPoints: (tree: AttributeTree) => {
    usedAttributePoints: number;
    usedSkillPoints: number;
};
export declare const getAttributeValue: (tree: AttributeTree, attribute: AttributeName) => number;
export declare const getSkillValue: (tree: AttributeTree, attribute: AttributeName, skill: SkillName) => number;
