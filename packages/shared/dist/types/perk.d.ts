import { Action } from './action.js';
import { AttributeTree } from './attributeTree.js';
import { Stats } from './item.js';
export type Perk = {
    id: number;
    name: string;
    description: string;
    type: 'character' | 'monster';
    modifiers: Stats;
    attributes: AttributeTree;
    actions: Action[];
};
export type PerkTree = {
    general: GeneralPerks;
    cybernetica: CyberneticaPerks;
    esoterica: EsotericaPerks;
    peace: PeacePerks;
    violence: ViolencePerks;
};
export type GeneralPerks = {
    general: Perk[];
};
export type CyberneticaPerks = {
    chromebits: Perk[];
    hardwired: Perk[];
    motorized: Perk[];
    networked: Perk[];
};
export type EsotericaPerks = {
    gestalt: Perk[];
    godhead: Perk[];
    mysticism: Perk[];
    outerworld: Perk[];
};
export type PeacePerks = {
    barter: Perk[];
    erudition: Perk[];
    rhetoric: Perk[];
    treatment: Perk[];
};
export type ViolencePerks = {
    assault: Perk[];
    shooting: Perk[];
    subterfuge: Perk[];
    threshold: Perk[];
};
