import { Attributes } from '../validation/fieldSchemas.js';
export declare const validateLevelUpBonus: ({ level, attributes, perkIds, }: {
    level: number | undefined;
    attributes?: Attributes;
    perkIds?: number[];
}) => Promise<void>;
