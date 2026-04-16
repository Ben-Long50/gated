import z from 'zod';
export const Attribute = z.enum([
    'cybernetica',
    'esoterica',
    'peace',
    'violence',
]);
export const Skill = z.enum([
    'chromebits',
    'hardwired',
    'motorized',
    'networked',
    'gestalt',
    'godhead',
    'mysticism',
    'outerworld',
    'barter',
    'erudition',
    'rhetoric',
    'treatment',
    'assault',
    'shooting',
    'subterfuge',
    'threshold',
]);
export const ActionType = z.enum([
    'action',
    'extendedAction',
    'reaction',
    'passive',
]);
export const ActionSubtype = z.enum(['movement', 'attack', 'upkeep', 'unique']);
export const FactionType = z.enum([
    'churchOfElShaddai',
    'corporateHoldouts',
    'federalReservists',
    'noblebloods',
]);
export const NpcType = z.enum(['shop', 'goon', 'template']);
export const Sex = z.enum(['male', 'female']);
export const ConditionType = z.enum(['character', 'item']);
export const Month = z.enum([
    'arctus',
    'pluvia',
    'kavir',
    'husk',
    'nagai',
    'zenzi',
    'haqMilah',
    'termina',
]);
export const ItemType = z.enum([
    'weapon',
    'armor',
    'cybernetic',
    'mutation',
    'vehicle',
    'drone',
    'modification',
    'reusable',
    'consumable',
]);
export const Rarity = z.enum([
    'common',
    'uncommon',
    'rare',
    'blackMarket',
    'artifact',
]);
export const PropertyType = z.enum(['property', 'districtUpgrade']);
export const KeywordType = z.enum([
    'weapon',
    'armor',
    'vehicle',
    'chromebits',
    'hardwired',
    'networked',
]);
