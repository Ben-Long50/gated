import prisma from '../config/database.js';
import itemServices from '../services/itemServices.js';
import { calculateCosts } from './rollUtilities.js';

const parseBlockData = async (
  phaseActionId: number,
  blockData: {
    blockedDamage: number;
    blockedSanityDamage: number;
    armorIds: number[];
  }[],
) => {
  let blockedDamage = 0;
  let blockedSanityDamage = 0;

  const armorCosts = new Map();

  for (const data of blockData) {
    if (data.blockedDamage) {
      blockedDamage += data.blockedDamage;
    }
    if (data.blockedSanityDamage) {
      blockedSanityDamage += data.blockedSanityDamage;
    }

    data.armorIds.forEach((id) => {
      const currentValue = armorCosts.get(id);
      if (currentValue) {
        armorCosts.set(id, currentValue + 1);
      } else {
        armorCosts.set(id, 1);
      }
    });
  }

  const armors = [];

  for (const id of armorCosts.keys()) {
    const armor = await itemServices.getItemById(id);
    armors.push({ ...armor, blocks: armorCosts.get(id) });
    await calculateCosts(undefined, armor, {
      costs: {
        currentBlock: armorCosts.get(id),
      },
    });
  }

  const armorIds = Array.from(armorCosts.keys()) || [];

  await prisma.history.update({
    where: { id: phaseActionId },
    data: {
      armorSnapshots: armors,
      armorIds,
      blockData,
    },
  });

  return { blockedDamage, blockedSanityDamage, armorIds };
};

export default parseBlockData;
