import { Equipment } from 'src/types/item';
import { Character, CharacterStats } from '../types/character';
import calculateLevelBonus from './calculateLevelBonus';
import { Action } from 'src/types/action';

const calculateCharacterStats = (
  character: Character,
  equipment: Equipment,
  actions: Action[],
) => {
  const attributeTree = character.attributes;
  const perks = character.perks;
  const stats = character.stats;

  const armors = equipment.armors;

  const nonArmors = Object.entries(equipment)
    .filter(([type, _]) => type !== 'armors')
    .flatMap(([_, items]) => items);

  const augmentations = equipment.augmentations;

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

  const levelBonus = calculateLevelBonus(
    character.level,
    attributeTree,
    character.perks,
  );

  const baseStats: CharacterStats = {
    maxHealth: 10 + attributeTree?.violence.skills.threshold.points * 2,
    maxSanity: 5 + attributeTree?.esoterica.skills.mysticism.points * 2,
    maxEquip: 10 + attributeTree?.violence.skills.threshold.points * 2,
    maxCyber: 5 + attributeTree?.cybernetica.skills.chromebits.points * 2,
    speed: 4 + attributeTree?.violence.skills.assault.points * 1,
    armor: armorValue,
    equippedArmor,
    blockPoints,
    currentBlockPoints,
    ward: wardValue,
    equippedWard,
    evasion: 1,
    weight: 0 + nonArmorWeight + armorWeight,
    cyber: 0 + equippedCyber,
    permanentInjuries: stats?.permanentInjuries || 5,
    permanentInsanities: stats?.permanentInsanities || 5,
    actions: 3,
    reactions: 1,
    hands: 2,
    feet: 2,
    chomebitsTn: attributeTree?.cybernetica.skills.chromebits.points,
    hardwiredTn: attributeTree?.cybernetica.skills.hardwired.points,
    motorizedTn: attributeTree?.cybernetica.skills.motorized.points,
    networkedTn: attributeTree?.cybernetica.skills.networked.points,
    gestaltTn: attributeTree?.esoterica.skills.gestalt.points,
    godheadTn: attributeTree?.esoterica.skills.godhead.points,
    mysticismTn: attributeTree?.esoterica.skills.mysticism.points,
    outerworldTn: attributeTree?.esoterica.skills.outerworld.points,
    barterTn: attributeTree?.peace.skills.barter.points,
    rhetoricTn: attributeTree?.peace.skills.rhetoric.points,
    eruditionTn: attributeTree?.peace.skills.erudition.points,
    treatmentTn: attributeTree?.peace.skills.treatment.points,
    assaultTn: attributeTree?.violence.skills.assault.points,
    shootingTn: attributeTree?.violence.skills.shooting.points,
    subterfugeTn: attributeTree?.violence.skills.subterfuge.points,
    thresholdTn: attributeTree?.violence.skills.threshold.points,
    ...levelBonus,
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
          attributeTree.cybernetica.skills[
            value as keyof typeof attributeTree.cybernetica.skills
          ].points;
      } else if (
        ['gestalt', 'godhead', 'mysticism', 'outerworld'].includes(value)
      ) {
        updated[stat as keyof CharacterStats] =
          currentValue +
          attributeTree.esoterica.skills[
            value as keyof typeof attributeTree.esoterica.skills
          ].points;
      } else if (
        ['barter', 'rhetoric', 'erudition', 'treatment'].includes(value)
      ) {
        updated[stat as keyof CharacterStats] =
          currentValue +
          attributeTree.peace.skills[
            value as keyof typeof attributeTree.peace.skills
          ].points;
      } else if (
        ['assault', 'shooting', 'subterfuge', 'threshold'].includes(value)
      ) {
        updated[stat as keyof CharacterStats] =
          currentValue +
          attributeTree.violence.skills[
            value as keyof typeof attributeTree.violence.skills
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

  if (perks && perks.length > 0) {
    perks?.forEach((perk) => {
      if (perk.modifiers) {
        finalStats = calculateBonus(finalStats, perk.modifiers);
      }
    });
  }

  return { ...finalStats, ...stats };
};

export default calculateCharacterStats;
