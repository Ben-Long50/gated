import { AttributeTree } from '@gated/shared';
export declare const validateLevelUpBonus: ({
  level,
  attributes,
  perkIds,
}: {
  level: number | undefined;
  attributes?: AttributeTree;
  perkIds?: number[];
}) => Promise<void>;
