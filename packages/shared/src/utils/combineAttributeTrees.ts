import { emptyAttributeTree } from '../constants/emptyAttributeTree.js';
import { AttributeTree } from '../types/attributeTree.js';

export const combineAttributeTrees = (trees: AttributeTree[]) => {
  if (trees.length === 0) {
    return emptyAttributeTree;
  }

  const result = structuredClone(trees[0]) as AttributeTree;
  for (const attrKey of Object.keys(result) as (keyof AttributeTree)[]) {
    result[attrKey].points = 0;
    for (const skillKey of Object.keys(result[attrKey].skills)) {
      result[attrKey].skills[skillKey].points = 0;
    }
  }

  for (const tree of trees) {
    for (const attrKey of Object.keys(tree) as (keyof AttributeTree)[]) {
      const attr = tree[attrKey];
      result[attrKey].points += attr.points;

      for (const skillKey of Object.keys(attr.skills)) {
        result[attrKey].skills[skillKey].points += attr.skills[skillKey].points;
      }
    }
  }

  return result;
};
