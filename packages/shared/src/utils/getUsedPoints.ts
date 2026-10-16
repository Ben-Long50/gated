import {
  AttributeName,
  AttributeTree,
  SkillName,
} from '../types/attributeTree.js';

export const getAttributePoints = (
  tree: AttributeTree,
  attributeName: AttributeName,
) => {
  return tree[attributeName]?.points ?? 0;
};

export const getSkillPoints = (tree: AttributeTree, skillName: string) => {
  for (const attribute of Object.values(tree)) {
    if (skillName in attribute.skills) {
      return (
        attribute.skills[skillName as keyof typeof attribute.skills].points ?? 0
      );
    }
  }
};

export const getUsedPoints = (tree: AttributeTree) => {
  let usedAttributePoints = 0;
  let usedSkillPoints = 0;

  Object.entries(tree).forEach(([_, details]) => {
    usedAttributePoints += details.points;
    Object.entries(details.skills).forEach(([_, details]) => {
      usedSkillPoints += details.points;
    });
  });

  return { usedAttributePoints, usedSkillPoints };
};

export const getAttributeValue = (
  tree: AttributeTree,
  attribute: AttributeName,
) => {
  return tree[attribute].points;
};

export const getSkillValue = (
  tree: AttributeTree,
  attribute: AttributeName,
  skill: SkillName,
) => {
  return tree[attribute].skills[skill].points;
};
