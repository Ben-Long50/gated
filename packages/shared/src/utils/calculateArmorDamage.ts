import { Character } from '../types/character.js';
import { Item } from '../types/item.js';

export const calculateArmorDamage = (
  item: Item,
  target: Character,
  instances: number,
) => {
  const equippedArmor = target.equipment.armors.filter(
    (item: Item) => item.equipped,
  );

  const sortedArmor = equippedArmor
    .filter((armor) => armor.stats.armor && armor.stats.currentBlock)
    .sort((a, b) => b.stats.armor - a.stats.armor);

  const sortedWardArmor = equippedArmor
    .filter((armor) => armor.stats.ward && armor.stats.currentBlock)
    .sort((a, b) => b.stats.ward - a.stats.ward);

  const requiredArmor = item.stats?.damage || 0;

  const selectedArmor = [];
  let index = 0;
  let totalSelectedArmorValue = 0;

  while (
    totalSelectedArmorValue < requiredArmor &&
    index < sortedArmor.length
  ) {
    totalSelectedArmorValue += sortedArmor[index].stats.armor;
    selectedArmor.push(sortedArmor[index]);
    index++;
  }

  const blockData = [] as any[];

  selectedArmor.forEach((armor) => {
    const data = {
      id: armor.id,
      blocks: 0,
      blockedDamage: 0,
      overflowDamage: 0,
    };
    let remainingInstances = instances;
    for (let i = 0; i <= remainingInstances; i++) {
      if (armor.stats.currentBlock > data.blocks) {
        data.blocks += 1;
        data.blockedDamage += armor.stats.armor;
      } else if (armor.stats.currentBlock <= 0) {
        data.overflowDamage += armor.stats.armor;
      }
    }

    blockData.push(data);
  });

  const overflowDamage =
    requiredArmor > totalSelectedArmorValue
      ? requiredArmor - totalSelectedArmorValue
      : 0;

  return blockData;
};
