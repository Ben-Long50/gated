import { Character } from 'src/types/character';
import calculateLevelBonus from './calculateLevelBonus';

const getLevelBonusData = (character: Character, level: number) => {
  const {
    attributePoints,
    skillPoints,
    perkPoints,
    masterPerkPoints,
    availableAttributePoints,
    availableSkillPoints,
    availablePerkPoints,
    availableMasterPerkPoints,
  } = calculateLevelBonus(level, character?.attributes, character?.perks);

  const {
    attributePoints: prevAttributePoints,
    skillPoints: prevSkillPoints,
    perkPoints: prevPerkPoints,
    masterPerkPoints: prevMasterPerkPoints,
  } = calculateLevelBonus(level - 1, character?.attributes, character?.perks);

  const levelUpAttributePoints = attributePoints - prevAttributePoints;
  const levelUpSkillPoints = skillPoints - prevSkillPoints;
  const levelUpPerkPoints = perkPoints - prevPerkPoints;
  const levelUpMasterPerkPoints = masterPerkPoints - prevMasterPerkPoints;

  let outstandingPoints = 0;

  if (levelUpAttributePoints) {
    outstandingPoints += availableAttributePoints;
  }
  if (levelUpSkillPoints) {
    outstandingPoints += availableSkillPoints;
  }
  if (levelUpPerkPoints) {
    outstandingPoints += availablePerkPoints;
  }
  if (levelUpMasterPerkPoints) {
    outstandingPoints += availableMasterPerkPoints;
  }

  const levelBonusUsed = outstandingPoints <= 0;

  return {
    levelUpAttributePoints,
    levelUpSkillPoints,
    levelUpPerkPoints,
    levelUpMasterPerkPoints,
    levelBonusUsed,
  };
};

export default getLevelBonusData;
