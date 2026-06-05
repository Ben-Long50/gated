import { AttributeTree } from 'src/types/attributeTree';
import { Perk } from 'src/types/perk';
import { CharacterStats, SortedInventory } from 'src/types/character';
import { Item } from 'src/types/item';
import { Action } from 'src/types/action';

const calculateStats = (
  equipment: SortedInventory | null,
  actions: Action[],
  attributeTree: AttributeTree,
  perks?: Perk[],
  characterStats?: CharacterStats,
) => {
  const armorWeight =
    equipment?.armors?.reduce((sum: number, armor: Item) => {
      if (armor.stats.weight && !armor.stats.currentPower) {
        return sum + armor.stats.weight;
      }
      return sum;
    }, 0) || 0;

  const nonArmorWeight =
    [
      ...(equipment?.weapons || []),
      ...(equipment?.reusables || []),
      ...(equipment?.consumables || []),
    ].reduce((sum: number, item: Item) => {
      if (item.stats.weight) {
        return sum + item.stats.weight;
      }
      return sum;
    }, 0) || 0;

  const armorValue =
    equipment?.armors?.reduce((sum: number, armor: Item) => {
      if (armor.stats.armor && armor.stats.currentBlock) {
        return sum + armor.stats.armor;
      }
      return sum;
    }, 0) || 0;

  const wardValue =
    equipment?.armors?.reduce((sum: number, armor: Item) => {
      if (armor.stats.ward && armor.stats.currentBlock) {
        return sum + armor.stats.ward;
      }
      return sum;
    }, 0) || 0;

  const equippedCyber =
    equipment?.augmentations?.reduce((sum: number, cybernetic: Item) => {
      if (cybernetic.stats.cyber) {
        return sum + cybernetic.stats.cyber;
      }
      return sum;
    }, 0) || 0;

  let stats = {
    maxHealth: characterStats?.maxHealth
      ? characterStats.maxHealth +
        10 +
        attributeTree?.violence.skills.threshold.points * 2
      : 10 + attributeTree?.violence.skills.threshold.points * 2,
    maxSanity: characterStats?.maxSanity
      ? characterStats.maxSanity +
        5 +
        attributeTree?.esoterica.skills.mysticism.points * 2
      : 5 + attributeTree?.esoterica.skills.mysticism.points * 2,
    maxEquip: characterStats?.maxEquip
      ? characterStats.maxEquip +
        10 +
        attributeTree?.violence.skills.threshold.points * 2
      : 10 + attributeTree?.violence.skills.threshold.points * 2,
    maxCyber: characterStats?.maxCyber
      ? characterStats?.maxCyber +
        5 +
        attributeTree?.cybernetica.skills.chromebits.points * 2
      : 5 + attributeTree?.cybernetica.skills.chromebits.points * 2,
    speed: characterStats?.speed
      ? characterStats?.speed +
        4 +
        attributeTree?.violence.skills.assault.points * 1
      : 4 + attributeTree?.violence.skills.assault.points * 1,
    armor: armorValue,
    ward: wardValue,
    evasion: characterStats?.evasion ? characterStats?.evasion + 1 : 1,
    weight: nonArmorWeight + armorWeight,
    cyber: equippedCyber,
    permanentInjuries: characterStats?.permanentInjuries || 5,
    permanentInsanities: characterStats?.permanentInsanities || 5,
    actions: 3,
    reactions: 1,
    hands: 2,
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

  actions.forEach((action) => {
    if (action.active && action.modifiers) {
      stats = calculateBonus(stats, action.modifiers);
    }
  });

  perks?.forEach((perk) => {
    if (perk.modifiers) {
      stats = calculateBonus(stats, perk.modifiers);
    }
  });

  return stats;
};

export default calculateStats;
