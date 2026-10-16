import { AttributeTree } from '../types/attributeTree.js';
import type { Perk } from '../types/perk.js';
export declare const calculateLevelBonus: (level: number) => {
    attributePoints: number;
    skillPoints: number;
    perkPoints: number;
    masterPerkPoints: number;
};
export default calculateLevelBonus;
export declare const calculateTotalLevelBonus: (level: number) => {
    attributePoints: number;
    skillPoints: number;
    perkPoints: number;
    masterPerkPoints: number;
};
export declare const calculateUsedPoints: (attributes?: AttributeTree, perks?: Perk[]) => {
    usedAttributePoints: number;
    usedSkillPoints: number;
    usedPerkPoints: number;
    usedMasterPerkPoints: number;
};
