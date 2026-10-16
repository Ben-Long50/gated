import {
  calculateTotalLevelBonus,
  calculateUsedPoints,
  Equipment,
} from '@gated/shared';
import { Character, CharacterStats } from '@gated/shared';
import { Action } from '@gated/shared';
import { AttributeTree } from '@gated/shared';
import { Perk } from '@gated/shared';

const calculateCharacterStats = (
  character: Character,
  attributes: AttributeTree,
  perks: Perk[],
  equipment: Equipment,
  actions: Action[],
) => {
  const stats = character.stats;

  const armors = equipment.filter((item) => item.itemTypes.includes('armor'));

  const nonArmors = equipment.filter(
    (item) => !item.itemTypes.includes('armor'),
  );

  const augmentations = equipment.filter(
    (item) =>
      item.itemTypes.includes('cybernetic') ||
      item.itemTypes.includes('mutation'),
  );

  const armorWeight =
    armors.reduce((sum: number, armor) => {
      if (armor.stats && armor.stats.weight && !armor.stats.currentPower) {
        return sum + armor.stats.weight;
      }
      return sum;
    }, 0) || 0;

  const nonArmorWeight =
    nonArmors.reduce((sum: number, item) => {
      if (item.stats && item.stats.weight) {
        return sum + item.stats.weight;
      }
      return sum;
    }, 0) || 0;

  const armorValue =
    armors.reduce((sum: number, armor) => {
      if (armor.stats && armor.stats.armor && armor.stats.currentBlock) {
        return sum + armor.stats.armor;
      }
      return sum;
    }, 0) || 0;

  const equippedArmor =
    armors.reduce((sum: number, armor) => {
      if (armor.stats && armor.stats.armor) {
        return sum + armor.stats.armor;
      }
      return sum;
    }, 0) || 0;

  const blockPoints =
    armors.reduce((sum: number, armor) => {
      if (armor.stats && armor.stats.block) {
        return sum + armor.stats.block;
      }
      return sum;
    }, 0) || 0;

  const currentBlockPoints =
    armors.reduce((sum: number, armor) => {
      if (armor.stats && armor.stats.block) {
        return sum + armor.stats.currentBlock;
      }
      return sum;
    }, 0) || 0;

  const wardValue =
    armors.reduce((sum: number, armor) => {
      if (armor.stats && armor.stats.ward && armor.stats.currentBlock) {
        return sum + armor.stats.ward;
      }
      return sum;
    }, 0) || 0;

  const equippedWard =
    armors.reduce((sum: number, armor) => {
      if (armor.stats && armor.stats.ward) {
        return sum + armor.stats.ward;
      }
      return sum;
    }, 0) || 0;

  const equippedCyber =
    augmentations.reduce((sum: number, cybernetic) => {
      if (cybernetic.stats && cybernetic.stats.cyber) {
        return sum + cybernetic.stats.cyber;
      }
      return sum;
    }, 0) || 0;

  const levelBonus = calculateTotalLevelBonus(character.level);

  const usedLevelBonus = calculateUsedPoints(attributes, perks);

  const baseStats: CharacterStats = {
    maxHealth: stats?.maxHealth
      ? stats.maxHealth + 10 + attributes?.violence.skills.threshold.points * 2
      : 10 + attributes?.violence.skills.threshold.points * 2,
    maxSanity: stats?.maxSanity
      ? stats.maxSanity + 5 + attributes?.esoterica.skills.mysticism.points * 2
      : 5 + attributes?.esoterica.skills.mysticism.points * 2,
    maxEquip: stats?.maxEquip
      ? stats.maxEquip + 10 + attributes?.violence.skills.threshold.points * 2
      : 10 + attributes?.violence.skills.threshold.points * 2,
    maxCyber: stats?.maxCyber
      ? stats?.maxCyber +
        5 +
        attributes?.cybernetica.skills.chromebits.points * 2
      : 5 + attributes?.cybernetica.skills.chromebits.points * 2,
    speed: stats?.speed
      ? stats?.speed + 4 + attributes?.violence.skills.assault.points * 1
      : 4 + attributes?.violence.skills.assault.points * 1,
    evasion: stats?.evasion ? stats?.evasion + 1 : 1,
    armor: armorValue,
    equippedArmor,
    blockPoints,
    currentBlockPoints,
    ward: wardValue,
    equippedWard,
    weight: 0 + nonArmorWeight + armorWeight,
    cyber: 0 + equippedCyber,
    permanentInjuries: stats?.permanentInjuries || 5,
    permanentInsanities: stats?.permanentInsanities || 5,
    actions: stats?.actions ? stats?.actions + 3 : 3,
    reactions: stats?.reactions ? stats?.reactions + 1 : 1,
    hands: stats?.hands ? stats?.hands + 2 : 2,
    feet: stats?.feet ? stats?.feet + 2 : 2,
    size: stats?.size ? stats?.size + 1 : 1,
    chomebitsTn: attributes?.cybernetica.skills.chromebits.points,
    hardwiredTn: attributes?.cybernetica.skills.hardwired.points,
    motorizedTn: attributes?.cybernetica.skills.motorized.points,
    networkedTn: attributes?.cybernetica.skills.networked.points,
    gestaltTn: attributes?.esoterica.skills.gestalt.points,
    godheadTn: attributes?.esoterica.skills.godhead.points,
    mysticismTn: attributes?.esoterica.skills.mysticism.points,
    outerworldTn: attributes?.esoterica.skills.outerworld.points,
    barterTn: attributes?.peace.skills.barter.points,
    rhetoricTn: attributes?.peace.skills.rhetoric.points,
    eruditionTn: attributes?.peace.skills.erudition.points,
    treatmentTn: attributes?.peace.skills.treatment.points,
    assaultTn: attributes?.violence.skills.assault.points,
    shootingTn: attributes?.violence.skills.shooting.points,
    subterfugeTn: attributes?.violence.skills.subterfuge.points,
    thresholdTn: attributes?.violence.skills.threshold.points,
    ...levelBonus,
    ...usedLevelBonus,
  };

  const calculateBonus = (
    base: CharacterStats,
    modifiers: CharacterStats,
  ): CharacterStats => {
    const updated = { ...base };

    Object.entries(modifiers).forEach(([stat, value]) => {
      const currentValue = updated[stat as keyof CharacterStats] || 0;

      if (typeof value === 'number') {
        updated[stat as keyof CharacterStats] = currentValue + value;
      } else if (
        ['chromebits', 'hardwired', 'motorized', 'networked'].includes(value)
      ) {
        updated[stat as keyof CharacterStats] =
          currentValue +
          attributes.cybernetica.skills[
            value as keyof typeof attributes.cybernetica.skills
          ].points;
      } else if (
        ['gestalt', 'godhead', 'mysticism', 'outerworld'].includes(value)
      ) {
        updated[stat as keyof CharacterStats] =
          currentValue +
          attributes.esoterica.skills[
            value as keyof typeof attributes.esoterica.skills
          ].points;
      } else if (
        ['barter', 'rhetoric', 'erudition', 'treatment'].includes(value)
      ) {
        updated[stat as keyof CharacterStats] =
          currentValue +
          attributes.peace.skills[value as keyof typeof attributes.peace.skills]
            .points;
      } else if (
        ['assault', 'shooting', 'subterfuge', 'threshold'].includes(value)
      ) {
        updated[stat as keyof CharacterStats] =
          currentValue +
          attributes.violence.skills[
            value as keyof typeof attributes.violence.skills
          ].points;
      }
    });

    return updated;
  };

  let finalStats = { ...baseStats };

  if (actions && actions.length > 0) {
    actions.forEach((action) => {
      if (action.active && action.modifiers) {
        finalStats = calculateBonus(finalStats, action.modifiers);
      }
    });
  }

  return finalStats;
};

export default calculateCharacterStats;
